import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPaymentStatusUpdateEmail } from '@/lib/email/orderNotifications';

// GET - Handle payment callback (success/failure)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get('order_id');
    const order_status = searchParams.get('order_status');
    const payment_session_id = searchParams.get('payment_session_id');

    console.log('🔄 Payment callback received:', {
      order_id,
      order_status,
      payment_session_id
    });

    if (!order_id) {
      console.error('❌ No order ID in callback');
      return NextResponse.redirect(new URL('/payment/failed', request.url));
    }

    // Find order by Cashfree order ID
    const order = await prisma.order.findFirst({
      where: { paymentId: order_id },
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
      console.error(`❌ Order not found: ${order_id}`);
      return NextResponse.redirect(new URL('/payment/failed', request.url));
    }

    console.log(`📦 Processing callback for order ${order.id}, current payment status: ${order.paymentStatus}`);

    let newPaymentStatus = order.paymentStatus;
    let newOrderStatus = order.status;

    // Update payment status based on callback
    if (order_status === 'PAID' || order_status === 'SUCCESS') {
      newPaymentStatus = 'PAID';
      // If payment successful and order is pending, confirm it
      if (order.status === 'PENDING') {
        newOrderStatus = 'CONFIRMED';
      }
    } else if (order_status === 'FAILED' || order_status === 'CANCELLED') {
      newPaymentStatus = 'FAILED';
      if (order_status === 'CANCELLED') {
        newOrderStatus = 'CANCELLED';
      }
    }

    // Update order if status changed
    const statusChanged = newPaymentStatus !== order.paymentStatus || newOrderStatus !== order.status;
    
    if (statusChanged) {
      console.log(`📝 Updating order ${order.id}:`);
      console.log(`   Payment: ${order.paymentStatus} → ${newPaymentStatus}`);
      console.log(`   Order: ${order.status} → ${newOrderStatus}`);

      const updateData = {};
      if (newPaymentStatus !== order.paymentStatus) {
        updateData.paymentStatus = newPaymentStatus;
      }
      if (newOrderStatus !== order.status) {
        updateData.status = newOrderStatus;
      }

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: updateData,
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

      // Send email notification for status changes
      try {
        if (newPaymentStatus !== order.paymentStatus) {
          console.log(`📧 Sending payment status email: ${order.paymentStatus} → ${newPaymentStatus}`);
          await sendPaymentStatusUpdateEmail(updatedOrder, order.paymentStatus, newPaymentStatus);
        }
      } catch (emailError) {
        console.error('❌ Failed to send callback email notification:', emailError);
      }

      console.log(`✅ Order ${order.id} updated via callback`);
    }

    // Redirect based on payment status
    if (newPaymentStatus === 'PAID') {
      return NextResponse.redirect(new URL(`/payment/success?order=${order.id}`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/payment/failed?order=${order.id}`, request.url));
    }

  } catch (error) {
    console.error('❌ Payment callback error:', error);
    return NextResponse.redirect(new URL('/payment/failed', request.url));
  }
}

// POST - Handle payment callback via POST (alternative)
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('🔄 Payment callback POST received:', body);

    const { order_id, order_status, payment_session_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'No order ID provided' }, { status: 400 });
    }

    // Find order by Cashfree order ID
    const order = await prisma.order.findFirst({
      where: { paymentId: order_id },
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

    let newPaymentStatus = order.paymentStatus;
    let newOrderStatus = order.status;

    // Update payment status
    if (order_status === 'PAID' || order_status === 'SUCCESS') {
      newPaymentStatus = 'PAID';
      if (order.status === 'PENDING') {
        newOrderStatus = 'CONFIRMED';
      }
    } else if (order_status === 'FAILED' || order_status === 'CANCELLED') {
      newPaymentStatus = 'FAILED';
      if (order_status === 'CANCELLED') {
        newOrderStatus = 'CANCELLED';
      }
    }

    // Update if changed
    const statusChanged = newPaymentStatus !== order.paymentStatus || newOrderStatus !== order.status;
    
    if (statusChanged) {
      const updateData = {};
      if (newPaymentStatus !== order.paymentStatus) {
        updateData.paymentStatus = newPaymentStatus;
      }
      if (newOrderStatus !== order.status) {
        updateData.status = newOrderStatus;
      }

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: updateData,
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

      // Send email notification
      try {
        if (newPaymentStatus !== order.paymentStatus) {
          await sendPaymentStatusUpdateEmail(updatedOrder, order.paymentStatus, newPaymentStatus);
        }
      } catch (emailError) {
        console.error('❌ Failed to send POST callback email notification:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      payment_status: newPaymentStatus,
      order_status: newOrderStatus,
      updated: statusChanged
    });

  } catch (error) {
    console.error('❌ Payment POST callback error:', error);
    return NextResponse.json({ 
      error: 'Callback processing failed', 
      details: error.message 
    }, { status: 500 });
  }
}