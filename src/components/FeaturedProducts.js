'use client'

import { useState, useEffect } from 'react'
import { useProductStore } from '@/store/productStore';
import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'

export default function FeaturedProducts() {
  // Use Zustand store for products
  const { products, fetchProducts } = useProductStore();
  const displayProducts = products.slice(0, 6); // Show first 6 as featured

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  // Component is now imported from ui/ProductCard

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
        {displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧶</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured products available</h3>
            <p className="text-gray-600 mb-6">Check back soon for our latest handmade crochet items!</p>
            <Link href="/products" className="btn btn-primary">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variant="featured" 
              />
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