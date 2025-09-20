import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Fetch admin dashboard stats
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Fetching dashboard stats...')

    const [
      totalProducts,
      activeProducts,
      totalOrders,
      totalUsers,
      paidRevenue,
      totalRevenue,
      ordersByStatus,
      recentOrdersCount
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'PAID' }
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: true
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ])

    console.log('Dashboard stats fetched:', {
      totalProducts,
      activeProducts,
      totalOrders,
      totalUsers,
      paidRevenue: paidRevenue._sum.totalAmount,
      totalRevenue: totalRevenue._sum.totalAmount,
      ordersByStatus,
      recentOrdersCount
    })

    return NextResponse.json({
      totalProducts,
      activeProducts,
      totalOrders,
      totalUsers,
      totalRevenue: paidRevenue._sum.totalAmount || 0,
      totalRevenueAll: totalRevenue._sum.totalAmount || 0,
      ordersByStatus,
      recentOrdersCount
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch dashboard stats',
      details: error.message 
    }, { status: 500 })
  }
}
