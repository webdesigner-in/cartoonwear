import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { createPaymentSession, generateOrderId } from '@/lib/cashfree'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { cartItems, addressId, totalAmount, shippingAmount = 0, taxAmount = 0 } = body

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!addressId) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 })
    }

    console.log('Payment initiation request:', { cartItems, addressId, totalAmount })

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id
      }
    })

    if (!address) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    // Generate unique order ID
    const cashfreeOrderId = generateOrderId()

    // Create order in database first
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId: addressId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'cashfree',
        totalAmount: totalAmount,
        shippingAmount: shippingAmount,
        taxAmount: taxAmount,
        paymentId: cashfreeOrderId,
        items: {
          create: cartItems.map(item => ({
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
        user: true
      }
    })

    console.log('Order created in database:', order.id)

    // Prepare payment session data
    const paymentData = {
      orderId: cashfreeOrderId,
      amount: totalAmount,
      customerId: session.user.id,
      customerName: user.name || address.firstName + ' ' + address.lastName,
      customerEmail: user.email,
      customerPhone: address.phone
    }

    console.log('Creating payment session with data:', paymentData)

    // Create payment session with Cashfree
    const paymentSession = await createPaymentSession(paymentData)

    if (!paymentSession.success) {
      // Delete the created order if payment session creation fails
      await prisma.order.delete({ where: { id: order.id } })
      return NextResponse.json({ 
        error: 'Payment session creation failed',
        details: paymentSession.error 
      }, { status: 500 })
    }

    // Clear user's cart after successful order creation
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id }
    })

    console.log('Payment session created successfully:', paymentSession)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      cashfreeOrderId: cashfreeOrderId,
      paymentSessionId: paymentSession.sessionId,
      paymentUrl: paymentSession.paymentUrl,
      amount: totalAmount
    })

  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json({ 
      error: 'Payment initiation failed',
      details: error.message 
    }, { status: 500 })
  }
}