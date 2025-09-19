import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current date and previous periods for comparison
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Parallel queries for dashboard stats
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      recentOrders,
      topProducts,
      userGrowth,
      orderStatusCount,
      categoriesWithProductCount
    ] = await Promise.all([
      // Total active users
      prisma.user.count({
        where: { 
          isActive: true,
          role: 'CUSTOMER'
        }
      }),

      // Total active products
      prisma.product.count({
        where: { isActive: true }
      }),

      // Total orders
      prisma.order.count(),

      // Total revenue (all time)
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        where: {
          paymentStatus: 'PAID'
        }
      }),

      // Current month revenue
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        where: {
          paymentStatus: 'PAID',
          createdAt: {
            gte: startOfMonth
          }
        }
      }),

      // Last month revenue
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        where: {
          paymentStatus: 'PAID',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),

      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }),

      // Top selling products (last 30 days)
      prisma.orderItem.groupBy({
        by: ['productId'],
        _count: {
          productId: true
        },
        _sum: {
          quantity: true
        },
        where: {
          order: {
            createdAt: {
              gte: thirtyDaysAgo
            },
            paymentStatus: 'PAID'
          }
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      }),

      // User growth (last 30 days, grouped by day)
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM User 
        WHERE createdAt >= ${thirtyDaysAgo}
        AND role = 'CUSTOMER'
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,

      // Order status breakdown
      prisma.order.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),

      // Categories with product counts
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              products: {
                where: {
                  isActive: true
                }
              }
            }
          }
        },
        orderBy: {
          products: {
            _count: 'desc'
          }
        },
        take: 5
      })
    ])

    // Get product details for top products
    const topProductIds = topProducts.map(item => item.productId)
    const productDetails = await prisma.product.findMany({
      where: {
        id: {
          in: topProductIds
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true
      }
    })

    // Combine top products with their details
    const topProductsWithDetails = topProducts.map(item => {
      const product = productDetails.find(p => p.id === item.productId)
      return {
        ...item,
        product: {
          ...product,
          images: product?.images ? JSON.parse(product.images) : []
        }
      }
    })

    // Calculate growth percentages
    const currentMonthRevenue = monthlyRevenue._sum.totalAmount || 0
    const lastMonthRevenueAmount = lastMonthRevenue._sum.totalAmount || 0
    const revenueGrowth = lastMonthRevenueAmount > 0 
      ? ((currentMonthRevenue - lastMonthRevenueAmount) / lastMonthRevenueAmount) * 100
      : 0

    const dashboardData = {
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        monthlyRevenue: currentMonthRevenue,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100
      },
      charts: {
        userGrowth: userGrowth.map(item => ({
          date: item.date,
          users: Number(item.count)
        })),
        orderStatus: orderStatusCount.map(item => ({
          status: item.status,
          count: item._count.status
        })),
        topCategories: categoriesWithProductCount.map(cat => ({
          name: cat.name,
          productCount: cat._count.products
        }))
      },
      recentOrders: recentOrders.map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          productName: item.product.name
        }))
      })),
      topProducts: topProductsWithDetails
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}