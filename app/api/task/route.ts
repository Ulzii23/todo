import db from "@/db";
import { task } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { headers } from 'next/headers';
import { eq, and, gte, lte } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import moment from 'moment-timezone';

const getUserFromHeader = async () => {
  const headersList = await headers();
  const authHeader = headersList.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}

export async function GET(request: Request) {
  const user = await getUserFromHeader();

  if (!user) {
    return NextResponse.json([], { status: 200 });
  }

  const url = new URL(request.url);
  let task_at = url.searchParams.get('task_at');
  if (!task_at) {
    task_at = new Date().toISOString().split('T')[0];
  }

  const conditions = [eq(task.userId, user.id as number)];

  if (task_at) {
    const find_date = moment
      .tz(task_at, 'YYYY-MM-DD', 'Asia/Ulaanbaatar')
      .startOf('day')
      .format('YYYY-MM-DD');

    conditions.push(
      eq(task.task_at, find_date)
    );
  }
  const builder = db.select().from(task).where(and(...conditions));

  const data = await builder;

  return NextResponse.json({ data, task_at });
}


export async function POST(request: Request) {
  const user = await getUserFromHeader();

  if (!user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { title, task_at } = await request.json();
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ message: 'Invalid title' }, { status: 400 });
  }

  const newTask = await db
    .insert(task)
    .values({ title: title, userId: user.id as number, task_at: task_at })
    .returning();

  return NextResponse.json(newTask[0]);
}