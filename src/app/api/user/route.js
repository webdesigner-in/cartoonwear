import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch all users and count (for admin dashboard)
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Only allow admin to fetch all users
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    // Non-admin: return only current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isActive: true,
      },
    });
    if (!user) {
      // User not found, clear session and force logout
      return NextResponse.json({ error: 'User not found, logging out.' }, { status: 403 });
    }
    return NextResponse.json({ user });
  }
  // Admin: return all users and count
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
    },
  });
  return NextResponse.json({ users, total: users.length });
}

// PUT - Update current user profile
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: body.name,
      image: body.image,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
    },
  });
  return NextResponse.json({ user });
}
