'use client'

import { useState, useEffect } from 'react'
import ImageDebug from '@/components/ImageDebug'

export default function TestImagesPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">🖼️ Image Test Page</h1>
        <p className="text-gray-600 mb-8">Testing product image loading and debugging information.</p>
        
        <div className="space-y-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
              
              {/* Debug Information */}
              <ImageDebug product={product} />
              
              {/* Image Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={typeof img === 'string' ? img : img.url}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onLoad={() => console.log(`✅ Image ${index + 1} loaded for ${product.name}`)}
                          onError={(e) => {
                            console.error(`❌ Image ${index + 1} failed for ${product.name}:`, e.target.src)
                            e.target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop'
                            e.target.onerror = null
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 break-all">
                        Image {index + 1}: {typeof img === 'string' ? img.substring(0, 50) + '...' : JSON.stringify(img).substring(0, 50) + '...'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-gray-50 p-8 rounded-lg text-center">
                    <div className="text-4xl mb-2">🧶</div>
                    <p className="text-gray-500">No images available for this product</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">There are no products in the database.</p>
          </div>
        )}
      </div>
    </div>
  )
}