import bcrypt from 'bcrypt';
import db from '@/db';
import { user } from '@/db/schema';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert the new user into the database
    const newUser = await db
      .insert(user)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .returning();

    // Return user without password
    const { password: _, ...safeUser } = newUser[0];

    // Set user cookie
    const response = NextResponse.json({ message: 'User registered successfully', user: safeUser });
    response.cookies.set('user', JSON.stringify(safeUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    // Handle unique constraint violation or other errors
    if (error.code === '23505') { // PostgreSQL unique violation
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}
