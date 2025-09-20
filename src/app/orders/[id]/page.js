'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Truck, Phone, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  async function fetchOrderData(showRefreshing = false) {
    try {
      if (showRefreshing) setRefreshing(true)
      
      const res = await fetch(`/api/order/${params.id}`, {
        cache: 'no-store' // Force fresh data
      })
      if (!res.ok) throw new Error('Order not found')
      const data = await res.json()
      setOrder(data.order)
      
      // If payment is still pending, check for updates
      if (data.order.paymentStatus === 'PENDING' && data.order.paymentId) {
        console.log('Payment still pending, checking for updates...')
        try {
          const statusRes = await fetch(`/api/payment/status?orderId=${data.order.paymentId}`)
          if (statusRes.ok) {
            const statusData = await statusRes.json()
            if (statusData.success && statusData.order.paymentStatus !== data.order.paymentStatus) {
              setOrder(statusData.order)
            }
          }
        } catch (statusError) {
          console.log('Status check failed:', statusError)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  useEffect(() => {
    // Wait for auth to load before making any decisions
    if (authLoading) return
    
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }

    if (params.id) {
      fetchOrderData()
    }
  }, [params.id, authLoading, isAuthenticated, router])
  
  // Auto-refresh every 30 seconds if payment is pending
  useEffect(() => {
    if (order && order.paymentStatus === 'PENDING') {
      const interval = setInterval(() => {
        fetchOrderData()
      }, 30000) // 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [order])
  
  const handleRefresh = () => {
    fetchOrderData(true)
  }

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

  // Show loading state while auth is being checked or order is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h3>
            <p className="text-gray-700 mb-4">The order you're looking for doesn't exist.</p>
            <Link href="/orders" className="btn btn-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/orders" className="text-golden hover:text-golden-dark hover:underline flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-golden hover:text-golden-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Refresh order status"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Updating...' : 'Refresh'}
                </button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-golden" />
                  <span className="font-medium text-gray-900">Order #{order.id.slice(-8)}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              
              {order.trackingNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-golden" />
                  <span className="text-gray-900 font-medium">Tracking: {order.trackingNumber}</span>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={(() => {
                            try {
                              const images = typeof item.product.images === 'string' 
                                ? JSON.parse(item.product.images) 
                                : item.product.images;
                              return Array.isArray(images) ? images[0] : images;
                            } catch {
                              return item.product.images[0] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop';
                            }
                          })()}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop';
                            e.target.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          🧶
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                      <p className="text-sm text-gray-600">Material: {item.product.material}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">₹{item.price}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      <div className="text-sm font-medium text-gray-900">
                        Total: ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-golden" />
                Delivery Address
              </h2>
              <div className="text-gray-700">
                <div className="font-medium text-gray-900">
                  {order.address.firstName} {order.address.lastName}
                </div>
                <div>{order.address.address1}</div>
                {order.address.address2 && <div>{order.address.address2}</div>}
                <div>{order.address.city}, {order.address.state} {order.address.zipCode}</div>
                <div>{order.address.country}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="h-4 w-4 text-golden" />
                  <span className="text-gray-900 font-medium">{order.address.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-900">₹{order.totalAmount - order.shippingAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping</span>
                  <span className="text-gray-900">
                    {order.shippingAmount === 0 ? 'Free' : `₹${order.shippingAmount}`}
                  </span>
                </div>
                <div className="border-t border-cream-300 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-golden font-bold">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-golden" />
                Payment Information
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Method</span>
                  <span className="text-gray-900 capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-golden" />
                Order Timeline
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-golden rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Order Placed</div>
                    <div className="text-xs text-gray-700">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {order.status !== 'PENDING' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-golden rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Order Confirmed</div>
                      <div className="text-xs text-gray-700">
                        {new Date(order.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {order.status === 'SHIPPED' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-golden rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Shipped</div>
                      <div className="text-xs text-gray-700">
                        {order.trackingNumber && `Tracking: ${order.trackingNumber}`}
                      </div>
                    </div>
                  </div>
                )}

                {order.status === 'DELIVERED' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Delivered</div>
                      <div className="text-xs text-gray-700">
                        Order completed successfully
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
