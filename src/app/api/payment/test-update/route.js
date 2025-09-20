import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Test endpoint to manually update payment status for debugging
export async function POST(request) {
  try {
    const { orderId, paymentStatus, orderStatus } = await request.json()
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    console.log('🧪 Test payment update for:', { orderId, paymentStatus, orderStatus })

    // Try to find order by internal ID first, then by paymentId
    let order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      order = await prisma.order.findFirst({
        where: { paymentId: orderId }
      })
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log('📋 Found order:', {
      id: order.id,
      paymentId: order.paymentId,
      currentStatus: order.status,
      currentPaymentStatus: order.paymentStatus
    })

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: paymentStatus || order.paymentStatus,
        status: orderStatus || order.status,
        updatedAt: new Date()
      }
    })

    console.log('✅ Updated order:', {
      id: updatedOrder.id,
      paymentId: updatedOrder.paymentId,
      newStatus: updatedOrder.status,
      newPaymentStatus: updatedOrder.paymentStatus
    })

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: {
        id: updatedOrder.id,
        paymentId: updatedOrder.paymentId,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus
      }
    })

  } catch (error) {
    console.error('❌ Test update failed:', error)
    return NextResponse.json({
      error: 'Failed to update order',
      details: error.message
    }, { status: 500 })
  }
}

// GET method to list recent orders for testing
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      select: {
        id: true,
        paymentId: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        createdAt: true,
        user: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({
      success: true,
      orders,
      message: `Found ${orders.length} recent orders`
    })
  } catch (error) {
    console.error('❌ Failed to fetch orders:', error)
    return NextResponse.json({
      error: 'Failed to fetch orders',
      details: error.message
    }, { status: 500 })
  }
}