import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Manual payment update for testing
export async function POST(request) {
  try {
    const body = await request.json();
    const { cashfreeOrderId, paymentStatus = 'PAID', orderStatus = 'CONFIRMED' } = body;

    console.log('🧪 Manual payment update:', { cashfreeOrderId, paymentStatus, orderStatus });

    if (!cashfreeOrderId) {
      return NextResponse.json({ error: 'Cashfree Order ID required' }, { status: 400 });
    }

    // Find order by Cashfree order ID (paymentId)
    const order = await prisma.order.findFirst({
      where: { paymentId: cashfreeOrderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        },
        address: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found with Cashfree ID: ' + cashfreeOrderId }, { status: 404 });
    }

    console.log(`📦 Found order ${order.id}, current status:`, {
      paymentStatus: order.paymentStatus,
      orderStatus: order.status
    });

    // Update the payment status
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: orderStatus,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        },
        address: true
      }
    });

    console.log(`✅ Order ${order.id} updated:`, {
      paymentStatus: updatedOrder.paymentStatus,
      orderStatus: updatedOrder.status
    });

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully',
      order: {
        id: updatedOrder.id,
        paymentId: updatedOrder.paymentId,
        paymentStatus: updatedOrder.paymentStatus,
        status: updatedOrder.status,
        totalAmount: updatedOrder.totalAmount,
        user: updatedOrder.user,
        items: updatedOrder.items,
        address: updatedOrder.address
      }
    });

  } catch (error) {
    console.error('❌ Manual payment update error:', error);
    return NextResponse.json({ 
      error: 'Payment update failed', 
      details: error.message 
    }, { status: 500 });
  }
}

// GET - List recent orders for testing
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        paymentId: true,
        paymentStatus: true,
        status: true,
        totalAmount: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        internalId: order.id.slice(-8),
        fullId: order.id,
        cashfreeOrderId: order.paymentId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        amount: order.totalAmount,
        createdAt: order.createdAt
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}