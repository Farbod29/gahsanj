import { NextResponse } from 'next/server';
import { z } from 'zod';
import { MongoClient } from 'mongodb';
import { comparePasswords, createToken } from '@/lib/auth';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!process.env.JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

const uri = process.env.MONGODB_URI as string;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  console.log('🔵 Login attempt started');
  const client = new MongoClient(uri);

  try {
    const body = await req.json();
    console.log('📨 Login request for email:', body.email);

    const { email, password } = loginSchema.parse(body);

    await client.connect();
    const db = client.db('farakhor');
    const collection = db.collection('users');

    const user = await collection.findOne({
      email: {
        $regex: `^${email.trim()}$`,
        $options: 'i',
      },
    });
    console.log('🔍 User lookup result:', user ? 'Found' : 'Not found');

    if (!user) {
      console.log('❌ Login failed: user not found');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePasswords(password, user.password);
    console.log(
      '🔐 Password validation:',
      isValidPassword ? 'Success' : 'Failed'
    );

    if (!isValidPassword) {
      console.log('❌ Login failed: Invalid password');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('💥 Login error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
