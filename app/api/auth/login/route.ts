import db from "@/db";
import { user } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.username, username))
    .limit(1);

  if (!userRecord) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    userRecord.password
  );

  if (!isPasswordValid) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }

  // ❗ never return password hash
  const { password: _, ...safeUser } = userRecord;

  // Generate JWT Token
  const token = await signToken({ ...safeUser });

  // Return token and user in response
  return NextResponse.json({
    message: "Login successful",
    user: safeUser,
    token
  });
}
