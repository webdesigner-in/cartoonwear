'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Eye, Calendar, MapPin, CreditCard } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function OrdersPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Wait for auth to load before making any decisions
    if (authLoading) return
    
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }

    async function fetchOrders() {
      try {
        const res = await fetch('/api/order')
        if (!res.ok) throw new Error('Failed to fetch orders')
        const data = await res.json()
        setOrders(data.orders)
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [authLoading, isAuthenticated, router])

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'CONFIRMED': return 'text-blue-600 bg-blue-100'
      case 'PROCESSING': return 'text-purple-600 bg-purple-100'
      case 'SHIPPED': return 'text-indigo-600 bg-indigo-100'
      case 'DELIVERED': return 'text-green-600 bg-green-100'
      case 'CANCELLED': return 'text-red-600 bg-red-100'
      case 'RETURNED': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'PAID': return 'text-green-600 bg-green-100'
      case 'FAILED': return 'text-red-600 bg-red-100'
      case 'REFUNDED': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Show loading state while auth is being checked or orders are loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-700 mb-4">Start shopping to see your orders here.</p>
            <Link href="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-golden" />
                        <span className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-golden" />
                        <span className="text-gray-700 font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-golden" />
                        <span className="text-gray-700 font-medium">
                          {order.address.city}, {order.address.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-golden" />
                        <span className="text-gray-700 font-medium capitalize">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                            <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                              {item.product.images && item.product.images.length > 0 ? (
                                <img
                                  src={(() => {
                                    try {
                                      const images = typeof item.product.images === 'string' 
                                        ? JSON.parse(item.product.images) 
                                        : item.product.images;
                                      return Array.isArray(images) ? images[0] : images;
                                    } catch {
                                      return item.product.images[0] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop';
                                    }
                                  })()}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop';
                                    e.target.onerror = null;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                  🧶
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </span>
                            <span className="text-xs text-gray-600">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Total and Actions */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{order.totalAmount}
                      </div>
                      {order.shippingAmount > 0 && (
                        <div className="text-sm text-gray-700">
                          Shipping: ₹{order.shippingAmount}
                        </div>
                      )}
                    </div>
                    
                    <Link
                      href={`/orders/${order.id}`}
                      className="btn btn-secondary flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}