import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { sendPaymentStatusUpdateEmail, sendOrderStatusUpdateEmail } from '@/lib/email/orderNotifications'

// PATCH - Update specific order status
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { status, paymentStatus, trackingNumber } = body

    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    // Get the current order to compare status changes
    const currentOrder = await prisma.order.findUnique({
      where: { id },
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
    })

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Build update data object
    const updateData = {}
    if (status !== undefined) updateData.status = status
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber

    // Update the order
    const order = await prisma.order.update({
      where: { id },
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
    })

    // Send email notifications for status changes
    try {
      // Send payment status update email if payment status changed
      if (paymentStatus !== undefined && paymentStatus !== currentOrder.paymentStatus) {
        console.log(`Payment status changed: ${currentOrder.paymentStatus} → ${paymentStatus}`)
        await sendPaymentStatusUpdateEmail(order, currentOrder.paymentStatus, paymentStatus)
      }

      // Send order status update email if order status changed
      if (status !== undefined && status !== currentOrder.status) {
        console.log(`Order status changed: ${currentOrder.status} → ${status}`)
        await sendOrderStatusUpdateEmail(order, currentOrder.status, status)
      }
    } catch (emailError) {
      // Log email errors but don't fail the request
      console.error('Email notification error:', emailError)
    }

    return NextResponse.json({ order })

  } catch (error) {
    console.error('Order update error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

// GET - Get specific order details
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const order = await prisma.order.findUnique({
      where: { id },
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
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })

  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}