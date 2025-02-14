import { cookies } from 'next/headers';
import { MongoClient, ObjectId } from 'mongodb';
import { verifyToken } from './auth';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI as string;

export type Role = 'ADMIN' | 'COMPOSER' | 'VIEWER';

export function canManageOccasions(role: Role): boolean {
  return ['ADMIN', 'COMPOSER'].includes(role);
}

export async function getUserFromHeaders() {
  const client = new MongoClient(uri);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      throw new Error('No token found');
    }

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
      role: user.role as Role,
    };
  } catch (error) {
    throw new Error('Unauthorized');
  } finally {
    await client.close();
  }
}

export function canApproveOccasions(role: Role): boolean {
  return role === 'ADMIN';
}

export function canDeleteOccasions(role: Role): boolean {
  return role === 'ADMIN';
}

export function isAuthorizedForAction(
  userRole: Role,
  requiredRole: Role
): boolean {
  const roleHierarchy: { [key in Role]: number } = {
    ADMIN: 3,
    COMPOSER: 2,
    VIEWER: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
