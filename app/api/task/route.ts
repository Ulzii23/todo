import db from "@/db";
import { task } from "@/db/schema";
import { cookies } from 'next/headers';
import { eq, and, gte, lte } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import moment from 'moment-timezone';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;

  if (!userCookie) {
    return NextResponse.json([], { status: 200 });
  }

  let user;
  try {
    user = JSON.parse(userCookie);
  } catch (err) {
    return NextResponse.json([], { status: 200 });
  }

  const url = new URL(request.url);
  let task_at = url.searchParams.get('task_at');
  if (!task_at) {
    task_at = new Date().toISOString().split('T')[0];
  }

  const conditions = [eq(task.userId, user.id)];

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
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;

  if (!userCookie) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  let user;
  try {
    user = JSON.parse(userCookie);
  } catch (err) {
    return NextResponse.json({ message: 'Invalid user cookie' }, { status: 400 });
  }

  const { title, task_at } = await request.json();
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ message: 'Invalid title' }, { status: 400 });
  }

  const newTask = await db
    .insert(task)
    .values({ title:title, userId: user.id, task_at: task_at })
    .returning();

  return NextResponse.json(newTask[0]);
}