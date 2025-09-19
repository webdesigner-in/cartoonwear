import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Fetch all products (with optional filtering)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 12

    const skip = (page - 1) * limit

    const where = {
      isActive: true,
      ...(category && { category: { name: { contains: category, mode: 'insensitive' } } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { material: { contains: search, mode: 'insensitive' } },
          { color: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: {
            select: {
              rating: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Calculate average rating for each product
    const productsWithRating = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
        : 0,
      reviewCount: product.reviews.length
    }))

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product (Admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      images,
      categoryId,
      stock,
      sku,
      material,
      size,
      color,
      pattern,
      difficulty,
      washCare
    } = body

    if (!name || !description || !price || !categoryId || !sku) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existingSKU = await prisma.product.findUnique({
      where: { sku }
    })

    if (existingSKU) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images: JSON.stringify(images || []),
        categoryId,
        stock: parseInt(stock) || 0,
        sku,
        material,
        size,
        color,
        pattern,
        difficulty,
        washCare,
        isActive: true
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({
      product: {
        ...product,
        images: JSON.parse(product.images)
      },
      message: 'Product created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}