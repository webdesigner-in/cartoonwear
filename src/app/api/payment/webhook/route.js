import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPaymentSignature } from '@/lib/cashfree'

export async function POST(request) {
  try {
    console.log('Webhook received from Cashfree')
    
    const signature = request.headers.get('x-webhook-signature')
    const rawBody = await request.text()
    
    console.log('Webhook signature:', signature)
    console.log('Webhook body:', rawBody)

    if (!signature) {
      console.log('No signature provided')
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    // Parse the webhook data
    let webhookData
    try {
      webhookData = JSON.parse(rawBody)
    } catch (error) {
      console.error('Invalid JSON in webhook:', error)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    // Verify webhook signature
    const isValidSignature = verifyPaymentSignature(webhookData, signature)
    if (!isValidSignature) {
      console.log('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    console.log('Webhook data verified:', webhookData)

    const { 
      data: {
        order: {
          order_id: cashfreeOrderId,
          order_status,
          order_amount
        } = {},
        payment: {
          payment_status,
          payment_method,
          cf_payment_id,
          payment_amount,
          payment_time,
          payment_message
        } = {}
      } = {},
      event_time,
      type: eventType
    } = webhookData

    if (!cashfreeOrderId) {
      console.error('No order ID in webhook data')
      return NextResponse.json({ error: 'No order ID provided' }, { status: 400 })
    }

    console.log(`Processing webhook for order: ${cashfreeOrderId}, status: ${payment_status}`)

    // Find the order in database
    const order = await prisma.order.findFirst({
      where: { paymentId: cashfreeOrderId }
    })

    if (!order) {
      console.error(`Order not found for Cashfree order ID: ${cashfreeOrderId}`)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log(`Found order in database: ${order.id}`)

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