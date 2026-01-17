import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { headers } from 'next/headers';
import db from '@/db';
import { task } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const getUserFromHeader = async () => {
  const headersList = await headers();
  const authHeader = headersList.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserFromHeader();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const body = await request.json();
  const updates: any = {};
  if (typeof body.complete === 'boolean') updates.complete = body.complete;
  if (typeof body.title === 'string') updates.title = body.title;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: 'No valid fields' }, { status: 400 });
  }

  const taskId = Number(id);

  if (!Number.isFinite(taskId)) {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  const updated = await db
    .update(task)
    .set(updates)
    .where(and(eq(task.id, taskId), eq(task.userId, user.id as number)))
    .returning();

  if (!updated || updated.length === 0) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  return NextResponse.json(updated[0]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserFromHeader();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const taskId = Number(id);
  if (!Number.isFinite(taskId)) {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  await db.delete(task).where(and(eq(task.id, taskId), eq(task.userId, user.id as number)));

  return NextResponse.json({ ok: true });
}
