import db from "@/db";
import { task } from "@/db/schema";
import { cookies } from 'next/headers';
import { eq, and, gte, lte } from 'drizzle-orm';
import { NextResponse } from 'next/server';

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
  let created_at = url.searchParams.get('created_at');
  if (!created_at) {
    created_at = new Date().toISOString().split('T')[0];
  }

  const conditions = [eq(task.userId, user.id)];

  if (created_at) {
    // Build start/end bounds for the provided date so we match the whole day
    const start = new Date(created_at);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    conditions.push(gte(task.createdAt, start), lte(task.createdAt, end));
  }

  const builder = db.select().from(task).where(and(...conditions));

  const data = await builder;

  return NextResponse.json({ data, created_at });
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

  const { name } = await request.json();
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ message: 'Invalid name' }, { status: 400 });
  }

  const newTask = await db
    .insert(task)
    .values({ name, userId: user.id })
    .returning();

  return NextResponse.json(newTask[0]);
}