import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPaymentSignature } from '@/lib/cashfree'

export async function POST(request) {
  try {
    console.log('🔔 Cashfree webhook received')
    
    const signature = request.headers.get('x-webhook-signature')
    const rawBody = await request.text()
    
    console.log('📝 Webhook signature:', signature ? 'Present' : 'Missing')
    console.log('📝 Webhook body length:', rawBody.length)

    if (!signature) {
      console.log('No signature provided')
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    // Parse the webhook data
    let webhookData
    try {
      webhookData = JSON.parse(rawBody)
      console.log('🔍 Parsed webhook data:', JSON.stringify(webhookData, null, 2))
    } catch (error) {
      console.error('❌ Invalid JSON in webhook:', error)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    // Verify webhook signature (skip in development)
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment && signature) {
      const isValidSignature = verifyPaymentSignature(webhookData, signature)
      if (!isValidSignature) {
        console.log('❌ Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    console.log('✅ Webhook data verified')

    // Extract data from webhook - handle multiple formats
    let cashfreeOrderId, payment_status, order_status, payment_method, cf_payment_id
    
    // Format 1: Standard Cashfree webhook
    if (webhookData.data && webhookData.data.order) {
      const { data: { order, payment = {} } } = webhookData
      cashfreeOrderId = order.order_id
      order_status = order.order_status
      payment_status = payment.payment_status
      payment_method = payment.payment_method
      cf_payment_id = payment.cf_payment_id
    } 
    // Format 2: Direct order data
    else if (webhookData.order_id) {
      cashfreeOrderId = webhookData.order_id
      payment_status = webhookData.payment_status || webhookData.order_status
      order_status = webhookData.order_status
      payment_method = webhookData.payment_method
      cf_payment_id = webhookData.cf_payment_id
    }
    
    console.log('📊 Extracted webhook data:', {
      cashfreeOrderId,
      payment_status,
      order_status,
      payment_method
    })

    if (!cashfreeOrderId) {
      console.error('❌ No order ID in webhook data')
      return NextResponse.json({ error: 'No order ID provided' }, { status: 400 })
    }

    console.log(`🔄 Processing webhook for Cashfree order: ${cashfreeOrderId}, payment status: ${payment_status}`)

    // Find the order in database ONLY by paymentId (Cashfree order ID)
    // This prevents wrong receipts by ensuring exact payment ID match
    console.log(`🔍 Looking for order with paymentId: ${cashfreeOrderId}`)
    
    const order = await prisma.order.findFirst({
      where: {
        paymentId: cashfreeOrderId
      },
      include: {
        user: {
          select: { email: true, name: true }
        }
      }
    })

    if (!order) {
      console.error(`❌ Order not found for Cashfree payment ID: ${cashfreeOrderId}`)
      console.log('📋 Available orders with pending payments:')
      
      // Log recent orders for debugging
      const recentOrders = await prisma.order.findMany({
        where: {
          paymentStatus: 'PENDING',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        select: { id: true, paymentId: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
      
      console.log('Recent pending orders:', recentOrders)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log(`✅ Found order: ${order.id} for user: ${order.user?.email || order.userId}`)
    console.log(`📋 Current status - order: ${order.status}, payment: ${order.paymentStatus}`)

    // Prevent duplicate updates
    if (payment_status === 'SUCCESS' && order.paymentStatus === 'PAID') {
      console.log('⚠️  Order already marked as paid, skipping update')
      return NextResponse.json({ 
        message: 'Order already updated',
        orderId: order.id,
        paymentStatus: order.paymentStatus
      })
    }

    // Determine new payment status
    let newPaymentStatus = 'PENDING'
    let newOrderStatus = order.status

    switch (payment_status?.toUpperCase()) {
      case 'SUCCESS':
        newPaymentStatus = 'PAID'
        newOrderStatus = 'CONFIRMED'
        break
      case 'FAILED':
        newPaymentStatus = 'FAILED'
        newOrderStatus = 'CANCELLED'
        break
      case 'USER_DROPPED':
        newPaymentStatus = 'FAILED'
        newOrderStatus = 'CANCELLED'
        break
      case 'VOID':
        newPaymentStatus = 'FAILED'
        newOrderStatus = 'CANCELLED'
        break
      default:
        newPaymentStatus = 'PENDING'
        break
    }

    console.log(`Updating order ${order.id}: payment=${newPaymentStatus}, order=${newOrderStatus}`)

    // Update order in database
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
        updatedAt: new Date(),
        // Store additional payment details
        notes: payment_message || null
      }
    })

    console.log('Order updated successfully:', updatedOrder.id)

    // Log the webhook event for debugging
    await prisma.order.update({
      where: { id: order.id },
      data: {
        notes: `Payment ${payment_status} via ${payment_method}. CF Payment ID: ${cf_payment_id}. ${payment_message || ''}`
      }
    })

    console.log('Webhook processed successfully')

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      orderId: order.id,
      paymentStatus: newPaymentStatus
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error.message 
    }, { status: 500 })
  }
}

// GET method for webhook verification during setup
export async function GET(request) {
  return NextResponse.json({ 
    message: 'Cashfree webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}