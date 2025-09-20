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

  // Check product availability and stock
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, stock: true, isActive: true }
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  if (!product.isActive) {
    return NextResponse.json({ error: 'This product is no longer available' }, { status: 400 });
  }

  // Get current cart quantity for this product
  const currentCartItem = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } }
  });

  const currentCartQuantity = currentCartItem ? currentCartItem.quantity : 0;
  const newTotalQuantity = currentCartQuantity + quantity;

  // Check if requested quantity exceeds available stock
  if (newTotalQuantity > product.stock) {
    const availableToAdd = product.stock - currentCartQuantity;
    if (availableToAdd <= 0) {
      return NextResponse.json({ 
        error: 'This item is already at maximum available quantity in your cart',
        availableStock: product.stock,
        currentInCart: currentCartQuantity
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: `Only ${availableToAdd} more items can be added. ${product.name} has ${product.stock} in stock and you already have ${currentCartQuantity} in your cart.`,
      availableStock: product.stock,
      currentInCart: currentCartQuantity,
      maxCanAdd: availableToAdd
    }, { status: 400 });
  }

  // Upsert cart item
  const cartItem = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
  });
  
  return NextResponse.json({ 
    cartItem,
    message: quantity > 0 ? `Added ${quantity} items to cart` : `Updated cart quantity`
  });
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
