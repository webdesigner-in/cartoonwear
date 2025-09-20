import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPaymentStatusUpdateEmail } from '@/lib/email/orderNotifications';

// POST - Test payment success (for testing only)
export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, paymentStatus = 'PAID' } = body;

    console.log('🧪 Test payment endpoint called:', { orderId, paymentStatus });

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // Find order by internal ID or Cashfree order ID
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { paymentId: orderId }
        ]
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

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log(`📦 Test updating order ${order.id}, current status: ${order.paymentStatus}`);

    const previousPaymentStatus = order.paymentStatus;
    const previousOrderStatus = order.status;

    let newOrderStatus = order.status;
    if (paymentStatus === 'PAID' && order.status === 'PENDING') {
      newOrderStatus = 'CONFIRMED';
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: newOrderStatus
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

    console.log(`📝 Test update completed:`);
    console.log(`   Payment: ${previousPaymentStatus} → ${paymentStatus}`);
    console.log(`   Order: ${previousOrderStatus} → ${newOrderStatus}`);

    // Send email notification
    try {
      if (paymentStatus !== previousPaymentStatus) {
        console.log(`📧 Sending test payment status email: ${previousPaymentStatus} → ${paymentStatus}`);
        await sendPaymentStatusUpdateEmail(updatedOrder, previousPaymentStatus, paymentStatus);
      }
    } catch (emailError) {
      console.error('❌ Failed to send test email notification:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Test payment status updated',
      order: {
        id: updatedOrder.id,
        paymentStatus: updatedOrder.paymentStatus,
        status: updatedOrder.status,
        previousPaymentStatus,
        previousOrderStatus
      },
      emailSent: paymentStatus !== previousPaymentStatus
    });

  } catch (error) {
    console.error('❌ Test payment error:', error);
    return NextResponse.json({ 
      error: 'Test payment failed', 
      details: error.message 
    }, { status: 500 });
  }
}

// GET - Test endpoint info
export async function GET() {
  return NextResponse.json({
    message: 'Test payment endpoint',
    usage: 'POST with { "orderId": "order_id", "paymentStatus": "PAID|FAILED" }',
    purpose: 'For testing payment status updates during development'
  });
}