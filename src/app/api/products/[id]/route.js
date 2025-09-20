import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          select: {
            rating: true,
            title: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Parse images and calculate rating
    let imagesArr = []
    try {
      imagesArr = product.images ? JSON.parse(product.images) : []
    } catch {
      imagesArr = []
    }
    // Ensure we have at least one valid image or use placeholder
    if (!Array.isArray(imagesArr) || imagesArr.length === 0) {
      imagesArr = ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop"]
    }

    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : 0

    const productWithRating = {
      ...product,
      images: imagesArr,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: product.reviews.length
    }

    return NextResponse.json({ product: productWithRating })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}