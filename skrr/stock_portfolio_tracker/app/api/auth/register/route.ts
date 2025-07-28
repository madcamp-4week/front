import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Validate input
    if (!name || !email || !password) {
      return new NextResponse('Missing name, email, or password', { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: '이미 가입된 이메일입니다.' }, { status: 409 }); // 409 Conflict
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user in database
    const user = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    // Do not return the password hash in the response
    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('[REGISTER_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
