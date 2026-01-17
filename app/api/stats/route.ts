import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { headers } from 'next/headers';
import db from '@/db';
import { task } from '@/db/schema';
import { eq, and, sql, gte, lte } from 'drizzle-orm';

const getUserFromHeader = async () => {
  const headersList = await headers();
  const authHeader = headersList.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}

export async function GET(request: Request) {
  const user = await getUserFromHeader();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month'); // YYYY-MM

  if (!month) {
    return NextResponse.json({ message: 'Month is required' }, { status: 400 });
  }

  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  // Fetch all tasks for the month
  const tasks = await db
    .select({
      date: task.task_at,
      complete: task.complete,
    })
    .from(task)
    .where(
      and(
        eq(task.userId, user.id as number),
        gte(task.task_at, startDate.toISOString().split('T')[0]),
        lte(task.task_at, endDate.toISOString().split('T')[0])
      )
    );

  // Aggregate stats per day
  const stats: Record<string, { total: number; completed: number; rate: number }> = {};

  tasks.forEach(t => {
    // t.date is a string "YYYY-MM-DD" from db
    const dateStr = t.date;
    if (!stats[dateStr]) {
      stats[dateStr] = { total: 0, completed: 0, rate: 0 };
    }
    stats[dateStr].total += 1;
    if (t.complete) {
      stats[dateStr].completed += 1;
    }
  });

  Object.values(stats).forEach(day => {
    day.rate = day.total === 0 ? 0 : Math.round((day.completed / day.total) * 100);
  });

  return NextResponse.json(stats);
}
