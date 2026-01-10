import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;

  if (!userCookie) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const user = JSON.parse(userCookie);
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
