import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromHeaders } from '@/lib/permissions';

export async function GET() {
  console.log('👥 Users API - Starting request');
  try {
    const user = await getUserFromHeaders();
    console.log('🔑 user role:', user.role);

    // Only admins can list users
    if (user.role !== 'ADMIN') {
      console.log('❌ Access denied: user is not an admin');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('✅ Access granted: Fetching users');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📋 Found ${users.length} users`);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('💥 Users API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
