'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { useCart } from '@/components/CartContext'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, ArrowLeft, Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react'

export default function ProductDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const { updateCartCount } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const res = await fetch(`/api/products/${params.id}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data.product)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = async () => {
    if (!session) {
      toast.error('Please sign in to add items to cart')
      return
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      })

      if (!res.ok) throw new Error('Failed to add to cart')
      
      toast.success('Added to cart!')
      await updateCartCount()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + delta))
    setQuantity(newQuantity)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h3>
            <p className="text-lg text-gray-700 mb-6">The product you're looking for doesn't exist.</p>
            <Link href="/products" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-all shadow-lg">
              <ArrowLeft className="h-5 w-5" />
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/products" className="text-yellow-600 hover:text-yellow-800 flex items-center gap-2 font-semibold text-lg hover:underline transition-all">
            <ArrowLeft className="h-5 w-5" />
            Back to Products
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden border border-cream-300 shadow-lg">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
                    e.target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop';
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                  onLoad={() => console.log('Image loaded successfully:', product.images[selectedImageIndex])}
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                  <div className="text-6xl mb-4">🧶</div>
                  <p className="text-lg font-medium text-center px-4">{product.name}</p>
                  <p className="text-sm text-gray-400 mt-2">No image available</p>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-accent' : 'border-cream-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover transition-all duration-200 hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop';
                        e.target.onerror = null;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.averageRating || 0)
                          ? 'text-accent fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-xl font-black text-yellow-600 bg-red-50 px-4 py-2 rounded-lg border-2 border-red-200 inline-block">
              ₹{product.price}
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Material:</span>
                <span className="text-gray-900">{product.material || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Size:</span>
                <span className="text-gray-900">{product.size || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Color:</span>
                <span className="text-gray-900">{product.color || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Pattern:</span>
                <span className="text-gray-900">{product.pattern || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Difficulty:</span>
                <span className="text-gray-900">{product.difficulty || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Stock:</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Care Instructions */}
            {product.washCare && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Care Instructions</h3>
                <p className="text-gray-700">{product.washCare}</p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-cream-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-5 w-5 text-gray-700" />
                  </button>
                  <span className="px-6 py-3 font-bold text-lg text-gray-900">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <ShoppingCart className="h-6 w-6" />
                {product.stock === 0 ? 'Out of Stock' : ' Add to Cart'}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-cream-300">
              <div className="text-center">
                <Truck className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders above ₹1,000</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Quality Guarantee</p>
                <p className="text-xs text-gray-600">Handmade with care</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}