import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// PATCH - Update product stock (Admin only)
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { stock, operation = 'set' } = body; // operation can be 'set', 'add', or 'subtract'

    if (stock === undefined || stock < 0) {
      return NextResponse.json({ error: 'Valid stock value required' }, { status: 400 });
    }

    // Get current product
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true, stock: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let newStock;
    switch (operation) {
      case 'add':
        newStock = product.stock + stock;
        break;
      case 'subtract':
        newStock = Math.max(0, product.stock - stock);
        break;
      case 'set':
      default:
        newStock = stock;
        break;
    }

    // Update product stock
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: newStock },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        isActive: true,
        sku: true,
        updatedAt: true
      }
    });

    console.log(`📦 Stock updated for ${product.name}: ${product.stock} → ${newStock} (${operation}: ${stock})`);

    return NextResponse.json({ 
      success: true, 
      product: updatedProduct,
      previousStock: product.stock,
      operation,
      change: stock
    });

  } catch (error) {
    console.error('Stock update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update stock', 
      details: error.message 
    }, { status: 500 });
  }
}

// GET - Get product stock information
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        isActive: true,
        sku: true,
        // Get recent orders to show stock movement
        orderItems: {
          select: {
            quantity: true,
            createdAt: true,
            order: {
              select: {
                id: true,
                status: true,
                paymentStatus: true,
                createdAt: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate stock metrics
    const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const recentSales = product.orderItems.filter(item => {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 7);
      return new Date(item.createdAt) > dayAgo;
    }).reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      product: {
        ...product,
        metrics: {
          totalSold,
          recentSales,
          stockStatus: product.stock === 0 ? 'out_of_stock' : product.stock < 5 ? 'low_stock' : 'in_stock'
        }
      }
    });

  } catch (error) {
    console.error('Stock fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stock information', 
      details: error.message 
    }, { status: 500 });
  }
}