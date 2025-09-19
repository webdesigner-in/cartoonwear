import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Fetch single product
export async function GET(request, { params }) {
  try {
    const { id } = params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Parse images and calculate average rating
    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0

    const productWithDetails = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      averageRating,
      reviewCount: product.reviews.length,
      reviews: product.reviews.map(review => ({
        ...review,
        images: review.images ? JSON.parse(review.images) : []
      }))
    }

    return NextResponse.json({ product: productWithDetails })

  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT - Update product (Admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
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
      washCare,
      isActive
    } = body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if SKU already exists (excluding current product)
    if (sku && sku !== existingProduct.sku) {
      const existingSKU = await prisma.product.findUnique({
        where: { sku }
      })

      if (existingSKU) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 400 }
        )
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(images && { images: JSON.stringify(images) }),
        ...(categoryId && { categoryId }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(sku && { sku }),
        ...(material && { material }),
        ...(size && { size }),
        ...(color && { color }),
        ...(pattern && { pattern }),
        ...(difficulty && { difficulty }),
        ...(washCare && { washCare }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({
      product: {
        ...updatedProduct,
        images: JSON.parse(updatedProduct.images)
      },
      message: 'Product updated successfully'
    })

  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product (Admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Soft delete - set isActive to false instead of actually deleting
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}