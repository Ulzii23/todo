import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  // Clear the cookie by setting it to empty with maxAge 0
  const res = NextResponse.json({ ok: true });
  res.cookies.set('user', '', { path: '/', maxAge: 0 });
  return res;
}
