import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch all cart items for logged-in user
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  // Check if user exists in DB
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found. Please log in again.' }, { status: 403 });
  }
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  return NextResponse.json({ cart: cartItems });
}

// POST - Add item to cart
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  // Check if user exists in DB
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found. Please log in again.' }, { status: 403 });
  }
  const body = await request.json();
  const { productId, quantity = 1 } = body;
  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }
  // Upsert cart item
  const cartItem = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
  });
  return NextResponse.json({ cartItem });
}

// DELETE - Remove item from cart
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  // Check if user exists in DB
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found. Please log in again.' }, { status: 403 });
  }
  const body = await request.json();
  const { productId } = body;
  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }
  await prisma.cartItem.delete({
    where: { userId_productId: { userId, productId } },
  });
  return NextResponse.json({ message: 'Item removed from cart' });
}
