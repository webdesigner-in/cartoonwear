import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST - Submit a review for a product
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const body = await request.json();
  const { productId, rating, comment } = body;
  if (!productId || !rating || !comment) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Upsert review (one review per user per product)
  const review = await prisma.review.upsert({
    where: { userId_productId: { userId, productId } },
    update: { rating, comment },
    create: { userId, productId, rating, comment },
    include: { user: { select: { name: true, image: true } } },
  });
  return NextResponse.json({ review });
}
