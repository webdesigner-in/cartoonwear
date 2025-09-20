import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getOrderStatus } from '@/lib/cashfree'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    console.log('🔍 Checking payment status for order:', orderId)

    // Try to find order by paymentId (Cashfree order ID) first
    let order = await prisma.order.findFirst({
      where: { paymentId: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        address: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // If not found by paymentId, check if it's our internal order ID
    // This is for backward compatibility with the success page
    if (!order) {
      console.log('🔄 Not found by paymentId, trying internal order ID...')
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          address: true,
          items: {
            include: {
              product: true
            }
          }
        }
      })
    }

    if (!order) {
      console.error('❌ Order not found:', orderId)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log('✅ Order found in database:', {
      id: order.id,
      paymentId: order.paymentId,
      paymentStatus: order.paymentStatus,
      status: order.status,
      userEmail: order.user?.email,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt
    })

    // If payment is still pending, check with Cashfree
    if (order.paymentStatus === 'PENDING' && order.paymentId) {
      console.log('🔄 Payment still pending, checking with Cashfree API...')
      console.log('📋 Query details - orderId from request:', orderId, 'paymentId in DB:', order.paymentId)
      
      const cashfreeStatus = await getOrderStatus(order.paymentId)
      
      if (cashfreeStatus.success && cashfreeStatus.data && cashfreeStatus.data.length > 0) {
        const latestPayment = cashfreeStatus.data[0]
        console.log('Cashfree payment status:', latestPayment)

        let newPaymentStatus = order.paymentStatus
        let newOrderStatus = order.status

        // Update status based on Cashfree response
        switch (latestPayment.payment_status?.toUpperCase()) {
          case 'SUCCESS':
            newPaymentStatus = 'PAID'
            newOrderStatus = 'CONFIRMED'
            break
          case 'FAILED':
          case 'USER_DROPPED':
          case 'VOID':
            newPaymentStatus = 'FAILED'
            newOrderStatus = 'CANCELLED'
            break
          default:
            // Keep current status
            break
        }

        // Update order in database if status changed
        if (newPaymentStatus !== order.paymentStatus || newOrderStatus !== order.status) {
          console.log('🔄 Status change detected - updating order:', {
            orderId: order.id,
            paymentId: order.paymentId,
            oldPaymentStatus: order.paymentStatus,
            newPaymentStatus,
            oldOrderStatus: order.status,
            newOrderStatus
          })
          
          order = await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: newPaymentStatus,
              status: newOrderStatus,
              updatedAt: new Date()
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              address: true,
              items: {
                include: {
                  product: true
                }
              }
            }
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        paymentId: order.paymentId,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        user: order.user,
        address: order.address,
        items: order.items
      }
    })

  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json({ 
      error: 'Failed to check payment status',
      details: error.message 
    }, { status: 500 })
  }
}