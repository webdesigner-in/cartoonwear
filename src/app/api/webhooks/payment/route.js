import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPaymentStatusUpdateEmail } from '@/lib/email/orderNotifications';

// POST - Handle payment webhook from payment provider
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('🔔 Payment webhook received:', JSON.stringify(body, null, 2));

    // For Cashfree webhook, the structure will be different
    // This is a generic implementation that can be adapted for different providers
    const { 
      order_id, 
      payment_id, 
      order_status, 
      payment_status,
      order_amount,
      // Cashfree specific fields
      cf_payment_id,
      order_token,
      payment_method,
      payment_group
    } = body;

    // Extract the Cashfree order ID from webhook
    const cashfreeOrderId = order_id;

    if (!cashfreeOrderId) {
      console.error('❌ No Cashfree order ID found in webhook payload');
      return NextResponse.json({ error: 'No order ID provided' }, { status: 400 });
    }

    // Find the order in our database using paymentId (which stores Cashfree order ID)
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
      console.error(`❌ Order not found with Cashfree order ID: ${cashfreeOrderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log(`📦 Processing webhook for order ${order.id}`);

    // Determine new payment status based on webhook data
    let newPaymentStatus = order.paymentStatus; // Default to current status
    let newOrderStatus = order.status;

    // Handle different payment provider responses
    if (order_status === 'PAID' || payment_status === 'SUCCESS' || payment_status === 'PAID') {
      newPaymentStatus = 'PAID';
      // If payment is successful and order is still pending, confirm it
      if (order.status === 'PENDING') {
        newOrderStatus = 'CONFIRMED';
      }
    } else if (order_status === 'FAILED' || payment_status === 'FAILED') {
      newPaymentStatus = 'FAILED';
    } else if (order_status === 'CANCELLED' || payment_status === 'CANCELLED') {
      newPaymentStatus = 'FAILED';
      newOrderStatus = 'CANCELLED';
    } else if (payment_status === 'PENDING' || payment_status === 'PROCESSING') {
      newPaymentStatus = 'PENDING';
    }

    // Update the order if status changed
    const statusChanged = newPaymentStatus !== order.paymentStatus || newOrderStatus !== order.status;
    
    if (statusChanged) {
      console.log(`📝 Updating order ${order.id}:`);
      console.log(`   Payment: ${order.paymentStatus} → ${newPaymentStatus}`);
      console.log(`   Order: ${order.status} → ${newOrderStatus}`);

      // Prepare update data
      const updateData = {};
      if (newPaymentStatus !== order.paymentStatus) {
        updateData.paymentStatus = newPaymentStatus;
      }
      if (newOrderStatus !== order.status) {
        updateData.status = newOrderStatus;
      }
      
      // Add payment tracking information
      if (payment_id) updateData.paymentId = payment_id;
      if (cf_payment_id) updateData.paymentId = cf_payment_id;

      // Update the order
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

      // Send email notifications
      try {
        // Send payment status update email if payment status changed
        if (newPaymentStatus !== order.paymentStatus) {
          console.log(`📧 Sending payment status update email: ${order.paymentStatus} → ${newPaymentStatus}`);
          await sendPaymentStatusUpdateEmail(updatedOrder, order.paymentStatus, newPaymentStatus);
        }

        // If order status also changed, we could send another notification
        // For now, we'll rely on the payment status email to inform about order confirmation
        
      } catch (emailError) {
        console.error('❌ Failed to send webhook email notification:', emailError);
        // Don't fail the webhook processing due to email errors
      }

      console.log(`✅ Order ${order.id} updated successfully`);
    } else {
      console.log(`ℹ️ No status change required for order ${order.id}`);
    }

    // Return success response to payment provider
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      cashfree_order_id: cashfreeOrderId,
      internal_order_id: order.id,
      updated: statusChanged
    });

  } catch (error) {
    console.error('❌ Payment webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message }, 
      { status: 500 }
    );
  }
}

// GET - Test endpoint to verify webhook is working
export async function GET() {
  return NextResponse.json({ 
    message: 'Payment webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}