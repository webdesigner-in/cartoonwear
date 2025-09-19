'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ShoppingCart, Heart } from 'lucide-react'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=6')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for now (will be replaced with real data from API)
  const mockProducts = [
    {
      id: '1',
      name: 'Cozy Baby Blanket',
      description: 'Soft and warm crochet baby blanket perfect for newborns',
      price: 1299,
      images: ['/placeholder-crochet-1.jpg'],
      averageRating: 4.8,
      reviewCount: 24,
      material: 'Cotton',
      color: 'Pink'
    },
    {
      id: '2',
      name: 'Amigurumi Bear',
      description: 'Adorable handmade teddy bear, perfect gift for children',
      price: 899,
      images: ['/placeholder-crochet-2.jpg'],
      averageRating: 5.0,
      reviewCount: 18,
      material: 'Cotton',
      color: 'Brown'
    },
    {
      id: '3',
      name: 'Decorative Cushion Cover',
      description: 'Elegant crochet cushion cover with floral pattern',
      price: 699,
      images: ['/placeholder-crochet-3.jpg'],
      averageRating: 4.6,
      reviewCount: 31,
      material: 'Wool',
      color: 'Cream'
    },
    {
      id: '4',
      name: 'Summer Hat',
      description: 'Lightweight and breathable crochet hat for summer',
      price: 549,
      images: ['/placeholder-crochet-4.jpg'],
      averageRating: 4.7,
      reviewCount: 15,
      material: 'Cotton',
      color: 'White'
    },
    {
      id: '5',
      name: 'Kitchen Pot Holders',
      description: 'Set of 4 colorful crochet pot holders',
      price: 399,
      images: ['/placeholder-crochet-5.jpg'],
      averageRating: 4.5,
      reviewCount: 22,
      material: 'Cotton',
      color: 'Multicolor'
    },
    {
      id: '6',
      name: 'Baby Booties',
      description: 'Cute little booties for babies, available in multiple colors',
      price: 299,
      images: ['/placeholder-crochet-6.jpg'],
      averageRating: 4.9,
      reviewCount: 38,
      material: 'Cotton',
      color: 'Blue'
    }
  ]

  const displayProducts = products.length > 0 ? products : mockProducts

  const ProductCard = ({ product }) => (
    <div className="card group cursor-pointer">
      <div className="relative overflow-hidden rounded-t-lg">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center relative">
          <div className="text-center">
            <div className="text-4xl mb-2">🧶</div>
            <p className="text-sm font-medium text-accent">{product.name}</p>
          </div>
          
          {/* Action buttons - always visible */}
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-sm">
              <Heart className="h-3 w-3 text-gray-600" />
            </button>
            <Link
              href={`/products/${product.id}`}
              className="bg-accent text-white p-2 rounded-full hover:bg-accent/90 transition-colors shadow-sm"
            >
              <ShoppingCart className="h-3 w-3" />
            </Link>
          </div>

          {/* Sale badge */}
          <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">
            New
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3 bg-gray-800">
          <div>
            <h3 className="font-semibold text-accent text-base leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-white mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.averageRating)
                      ? 'text-accent fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-300">
              ({product.reviewCount})
            </span>
          </div>

          {/* Material and Color */}
          <div className="flex items-center space-x-4 text-sm text-gray-300 font-medium">
            <span>Material: {product.material}</span>
            <span>Color: {product.color}</span>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-accent">
                ₹{product.price}
              </span>
            </div>
            <Link
              href={`/products/${product.id}`}
              className="btn btn-primary text-sm px-4 py-2"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover our most popular handmade crochet items, each crafted with love and attention to detail.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="btn btn-secondary text-lg px-8 py-3 hover:shadow-lg transition-all duration-200"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}