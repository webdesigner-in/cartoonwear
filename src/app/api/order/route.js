import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email/orderNotifications'

// POST - Create new order
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { addressId, paymentMethod, totalAmount, shippingAmount, items } = body

    if (!addressId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id }
    })

    if (!address) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }

    // Check stock availability for all items
    const stockValidation = await Promise.all(
      items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, stock: true, isActive: true }
        })
        
        if (!product) {
          return { valid: false, message: `Product not found` }
        }
        
        if (!product.isActive) {
          return { valid: false, message: `${product.name} is no longer available` }
        }
        
        if (product.stock < item.quantity) {
          return { 
            valid: false, 
            message: `Insufficient stock for ${product.name}. Only ${product.stock} available, but ${item.quantity} requested.`
          }
        }
        
        return { valid: true, product }
      })
    )
    
    // Check if any validation failed
    const invalidItems = stockValidation.filter(result => !result.valid)
    if (invalidItems.length > 0) {
      return NextResponse.json({ 
        error: 'Stock validation failed', 
        details: invalidItems.map(item => item.message)
      }, { status: 400 })
    }

    // Determine payment status based on payment method
    // For online payments, we'll start as PENDING and update via webhook
    // For COD, it remains PENDING until delivery
    const initialPaymentStatus = paymentMethod === 'cod' ? 'PENDING' : 'PENDING'

    // Use transaction to ensure atomicity
    const order = await prisma.$transaction(async (tx) => {
      // Create order with items
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          addressId,
          paymentMethod,
          totalAmount,
          shippingAmount,
          status: 'PENDING',
          paymentStatus: initialPaymentStatus,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          address: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
      
      // Reduce stock for each item
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
        
        console.log(`✅ Reduced stock for product ${item.productId} by ${item.quantity}`);
      }
      
      return newOrder
    })

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id }
    })

    // Send order confirmation email
    try {
      console.log(`Sending order confirmation email for order ${order.id}...`)
      await sendOrderConfirmationEmail(order, initialPaymentStatus)
    } catch (emailError) {
      // Log email errors but don't fail the order creation
      console.error('Failed to send order confirmation email:', emailError)
    }

    return NextResponse.json({ order }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

// GET - Fetch user's orders
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ orders })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}