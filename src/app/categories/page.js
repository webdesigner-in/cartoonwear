'use client'

import { useState, useEffect } from 'react'
import { useProductStore } from '@/store/productStore'
import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        setCategories(data.categories)
      } catch (err) {
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Product Categories
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore our crochet collections organized by category. Each category offers unique handmade items crafted with care.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-700">Categories will appear here once they are added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="card group hover:shadow-lg transition-all duration-200"
              >
                <div className="aspect-square bg-gradient-to-br from-cream-100 to-cream-200 rounded-t-lg flex items-center justify-center relative overflow-hidden group-hover:from-cream-200 group-hover:to-cream-300 transition-all duration-200">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="text-center text-gray-500 group-hover:text-gray-600 transition-colors">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-200">🧶</div>
                      <p className="text-lg font-medium">{category.name}</p>
                    </div>
                  )}
                  
                  {/* Subtle hover indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <ArrowRight className="h-4 w-4 text-golden" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {category.description || 'Beautiful handmade crochet items in this category.'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="h-4 w-4 text-golden" />
                      <span className="font-medium">{category._count?.products || 0} products</span>
                    </div>
                    <span className="text-golden font-bold group-hover:text-golden-dark transition-colors">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-sm border border-cream-300 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-700 mb-6">
              Browse all our products or contact us for custom orders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn btn-primary">
                View All Products
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}