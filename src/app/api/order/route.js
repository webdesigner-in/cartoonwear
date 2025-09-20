import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

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

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId,
        paymentMethod,
        totalAmount,
        shippingAmount,
        status: 'PENDING',
        paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PENDING',
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
        address: true
      }
    })

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id }
    })

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