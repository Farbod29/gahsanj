import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';
import { JWTPayload } from 'jose/dist/types/types';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!process.env.JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

const uri = process.env.MONGODB_URI as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

export interface UserJWT extends JWTPayload {
  id: string;
  email: string;
  username: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createToken(payload: UserJWT): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
  return token;
}

export async function verifyToken(token: string): Promise<UserJWT> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as UserJWT;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function setAuthCookie(token: string): void {
  const response = new NextResponse();
  response.cookies.set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function getUserFromToken(token: string) {
  if (!uri) throw new Error('MongoDB URI is not defined');

  const client = new MongoClient(uri);

  try {
    const decoded = await verifyToken(token);
    await client.connect();
    const db = client.db('farakhor');
    const collection = db.collection('users');

    const user = await collection.findOne({ _id: new ObjectId(decoded.id) });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    };
  } catch (error) {
    throw new Error('Invalid token');
  } finally {
    await client.close();
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookiesList = await cookies();
  const authCookie = cookiesList.get('auth-token');
  return authCookie?.value || null;
}

export function logout(): NextResponse {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('auth-token');
  return response;
}
