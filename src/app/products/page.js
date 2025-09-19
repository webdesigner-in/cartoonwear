'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Search, Filter } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Mock products for now (same as homepage)
  const mockProducts = [
    {
      id: '1',
      name: 'Cozy Baby Blanket',
      description: 'Soft and warm crochet baby blanket perfect for newborns. Made with premium cotton yarn for ultimate comfort and safety.',
      price: 1299,
      images: ['/placeholder-crochet-1.jpg'],
      averageRating: 4.8,
      reviewCount: 24,
      material: 'Cotton',
      color: 'Pink',
      category: { name: 'Baby Items' }
    },
    {
      id: '2',
      name: 'Amigurumi Bear',
      description: 'Adorable handmade teddy bear, perfect gift for children. Crafted with love and attention to detail.',
      price: 899,
      images: ['/placeholder-crochet-2.jpg'],
      averageRating: 5.0,
      reviewCount: 18,
      material: 'Cotton',
      color: 'Brown',
      category: { name: 'Toys' }
    },
    {
      id: '3',
      name: 'Decorative Cushion Cover',
      description: 'Elegant crochet cushion cover with floral pattern. Perfect for adding a cozy touch to your living room.',
      price: 699,
      images: ['/placeholder-crochet-3.jpg'],
      averageRating: 4.6,
      reviewCount: 31,
      material: 'Wool',
      color: 'Cream',
      category: { name: 'Home Decor' }
    },
    {
      id: '4',
      name: 'Summer Hat',
      description: 'Lightweight and breathable crochet hat for summer. Stylish protection from the sun.',
      price: 549,
      images: ['/placeholder-crochet-4.jpg'],
      averageRating: 4.7,
      reviewCount: 15,
      material: 'Cotton',
      color: 'White',
      category: { name: 'Accessories' }
    },
    {
      id: '5',
      name: 'Kitchen Pot Holders',
      description: 'Set of 4 colorful crochet pot holders. Heat-resistant and practical for everyday kitchen use.',
      price: 399,
      images: ['/placeholder-crochet-5.jpg'],
      averageRating: 4.5,
      reviewCount: 22,
      material: 'Cotton',
      color: 'Multicolor',
      category: { name: 'Kitchen' }
    },
    {
      id: '6',
      name: 'Baby Booties',
      description: 'Cute little booties for babies, available in multiple colors. Soft and comfortable for tiny feet.',
      price: 299,
      images: ['/placeholder-crochet-6.jpg'],
      averageRating: 4.9,
      reviewCount: 38,
      material: 'Cotton',
      color: 'Blue',
      category: { name: 'Baby Items' }
    },
    {
      id: '7',
      name: 'Granny Square Afghan',
      description: 'Classic granny square afghan blanket. Perfect for cozy evenings and adding warmth to any room.',
      price: 1899,
      images: ['/placeholder-crochet-7.jpg'],
      averageRating: 4.8,
      reviewCount: 12,
      material: 'Wool',
      color: 'Rainbow',
      category: { name: 'Home Decor' }
    },
    {
      id: '8',
      name: 'Crochet Bag',
      description: 'Stylish handmade crochet bag for everyday use. Durable and fashionable with comfortable handles.',
      price: 799,
      images: ['/placeholder-crochet-8.jpg'],
      averageRating: 4.6,
      reviewCount: 28,
      material: 'Cotton',
      color: 'Natural',
      category: { name: 'Accessories' }
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const categories = ['All', 'Baby Items', 'Home Decor', 'Accessories', 'Toys', 'Kitchen']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || 
                           product.category.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  const ProductCard = ({ product }) => (
    <div className="card group cursor-pointer">
      <div className="relative overflow-hidden rounded-t-lg">
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

          <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">
            New
          </div>
        </div>

        <div className="p-4 space-y-3 bg-gray-800">
          <div>
            <h3 className="font-semibold text-accent text-base leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-white mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

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

          <div className="flex items-center justify-between text-sm text-gray-300 font-medium">
            <span>Material: {product.material}</span>
            <span>Color: {product.color}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-accent">
              ₹{product.price}
            </span>
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
    <main className="min-h-screen bg-cream-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Crochet Collection
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover our complete range of handmade crochet items, each crafted with love and attention to detail.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-cream-300 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent appearance-none bg-white text-gray-900"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
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
                  <ProductCard key={product.id} product={product} />
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
                    setSearchTerm('')
                    setSelectedCategory('')
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

      <Footer />
    </main>
  )
}