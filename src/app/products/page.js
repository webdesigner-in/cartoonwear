'use client'

import { useState, useEffect } from 'react'
import { useProductStore } from '@/store/productStore';
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, fetchProducts } = useProductStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
      fetchProducts().finally(() => setLoading(false));
    }
  }, [products.length, fetchProducts]);

  // Only filter by search term
  const filteredProducts = products.filter(product => {
    return product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Component is now imported from ui/ProductCard

  return (
    <div className="min-h-screen bg-cream-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            🧶 Our Crochet Collection
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto font-semibold leading-relaxed">
            Discover our complete range of handmade crochet items, each crafted with love and attention to detail.
          </p>
        </div>

        {/* Search Filter Only */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-cream-300 p-8 mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-golden h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border-2 border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden bg-warm-50 text-gray-900 placeholder-gray-600 text-lg font-medium shadow-sm"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    variant="default" 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🧶</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-700 mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                  }}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Results Summary */}
        {!loading && (
          <div className="text-center mt-8 text-gray-700 font-medium">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>

    </div>
  )
}