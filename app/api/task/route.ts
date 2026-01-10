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
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  const conditions = [eq(task.userId, user.id)];

  if (startDate) {
    const s = new Date(startDate);
    conditions.push(gte(task.createdAt, s));
  }
  if (endDate) {
    const e = new Date(endDate);
    conditions.push(lte(task.createdAt, e));
  }

  const builder = db.select().from(task).where(and(...conditions));

  const data = await builder;

  return NextResponse.json(data);
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