import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = await headers();
  const authHeader = headersList.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ user: null }, { status: 200 }); // Return null user if no token
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: payload }, { status: 200 });
}
