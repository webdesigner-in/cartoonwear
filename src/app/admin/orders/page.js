'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { toastInfo, toastSuccess, toastError } from '@/utils/toast'
import { 
  Eye, 
  Search, 
  ShoppingCart,
  Calendar,
  User,
  Package,
  CreditCard,
  IndianRupee,
  Copy,
  ExternalLink,
  Database,
  Shield
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminOrders() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [paymentFilter, setPaymentFilter] = useState('ALL')
  const [showOnlyWithPaymentId, setShowOnlyWithPaymentId] = useState(false)

  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated || !user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      router.push('/')
      return
    }

    fetchOrders()
  }, [authLoading, isAuthenticated, user, router])

  // Add scroll shadow effect
  useEffect(() => {
    const scrollContainer = document.querySelector('.admin-orders-table-scroll')
    const leftShadow = document.querySelector('.scroll-shadow-left')
    
    if (!scrollContainer || !leftShadow) return
    
    const handleScroll = () => {
      if (scrollContainer.scrollLeft > 10) {
        leftShadow.style.opacity = '1'
      } else {
        leftShadow.style.opacity = '0'
      }
    }
    
    scrollContainer.addEventListener('scroll', handleScroll)
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [loading])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update order status')
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      toast.success('Order status updated successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handlePaymentStatusUpdate = async (orderId, newPaymentStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      })

      if (!response.ok) throw new Error('Failed to update payment status')
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
      ))
      toast.success('Payment status updated successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Helper function to copy text to clipboard
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      toastSuccess(`${label} copied to clipboard!`)
    } catch (error) {
      toastError('Failed to copy to clipboard')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'ALL' || order.paymentStatus === paymentFilter
    const hasPaymentId = !showOnlyWithPaymentId || order.paymentId

    return matchesSearch && matchesStatus && matchesPayment && hasPaymentId
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-0 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 lg:ml-0 min-w-0">
        <div className="p-8 max-w-none">
          <div className="w-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                Admin Panel
              </div>
            </div>
            <p className="text-gray-600 mb-4">Track and manage customer orders with payment details</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Copy className="h-4 w-4" />
                <span>Copy Order & Payment IDs</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <ExternalLink className="h-4 w-4" />
                <span>Cashfree Integration</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <User className="h-4 w-4" />
                <span>Customer Details</span>
              </div>
              <div className="flex items-center gap-2 text-orange-600">
                <Database className="h-4 w-4" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          {orders.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 truncate">Total Orders</p>
                    <p className="text-xl font-bold text-gray-900">{orders.length}</p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <ShoppingCart className="h-7 w-7 text-golden" />
                  </div>
                </div>
              </div>
              
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 truncate">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {orders.filter(o => o.status === 'PENDING').length}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <Calendar className="h-7 w-7 text-yellow-500" />
                  </div>
                </div>
              </div>
              
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 truncate">Delivered</p>
                    <p className="text-xl font-bold text-green-600">
                      {orders.filter(o => o.status === 'DELIVERED').length}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <Package className="h-7 w-7 text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 truncate">Revenue (Paid)</p>
                    <p className="text-lg font-bold text-green-600 truncate">
                      ₹{orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <IndianRupee className="h-7 w-7 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="card p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search orders by ID, Cashfree ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden focus:border-transparent"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden focus:border-transparent min-w-[120px]"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden focus:border-transparent min-w-[120px]"
                >
                  <option value="ALL">All Payments</option>
                  <option value="PENDING">Payment Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg whitespace-nowrap">
                  <input
                    type="checkbox"
                    id="cashfree-filter"
                    checked={showOnlyWithPaymentId}
                    onChange={(e) => setShowOnlyWithPaymentId(e.target.checked)}
                    className="text-golden focus:ring-golden focus:ring-2 flex-shrink-0"
                  />
                  <label htmlFor="cashfree-filter" className="text-sm text-gray-700 flex items-center gap-1">
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Cashfree Only</span>
                    <span className="sm:hidden">CF Only</span>
                  </label>
                </div>
              </div>
            </div>
            {showOnlyWithPaymentId && (
              <div className="mt-2 text-sm text-purple-600 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Showing only orders with Cashfree payment IDs
              </div>
            )}
          </div>

          {/* Orders Table */}
          <div className="w-full">
            {/* Scroll hint */}
            <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
              <span>👈 Scroll horizontally to see all columns</span>
              <button 
                onClick={() => {
                  const scrollContainer = document.querySelector('.admin-orders-table-scroll')
                  if (scrollContainer) {
                    scrollContainer.scrollTo({ left: scrollContainer.scrollWidth, behavior: 'smooth' })
                  }
                }}
                className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                title="Scroll to end"
              >
                Scroll to end →
              </button>
              <button 
                onClick={() => {
                  const scrollContainer = document.querySelector('.admin-orders-table-scroll')
                  if (scrollContainer) {
                    scrollContainer.scrollTo({ left: 0, behavior: 'smooth' })
                  }
                }}
                className="text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                title="Scroll to start"
              >
                ← Back to start
              </button>
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{filteredOrders.length} orders</span>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative">
              {/* Scroll indicators */}
              <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none z-10 rounded-r-lg"></div>
              <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none z-10 rounded-l-lg opacity-0 scroll-shadow-left"></div>
              
              <div className="overflow-x-auto admin-orders-table-scroll" style={{width: '100%'}}>
                <table className="border-collapse" style={{minWidth: '1400px', width: 'max-content'}}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider" style={{width: '160px', minWidth: '160px'}}>
                      Order ID
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider" style={{width: '200px', minWidth: '200px'}}>
                      Customer
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider" style={{width: '180px', minWidth: '180px'}}>
                      Cashfree ID
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider" style={{width: '140px', minWidth: '140px'}}>
                      Date
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider" style={{width: '100px', minWidth: '100px'}}>
                      Items
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider" style={{width: '100px', minWidth: '100px'}}>
                      Total
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider" style={{width: '120px', minWidth: '120px'}}>
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider" style={{width: '140px', minWidth: '140px'}}>
                      Payment Status
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider" style={{width: '80px', minWidth: '80px'}}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4" style={{width: '160px'}}>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-golden/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="h-5 w-5 text-golden" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-gray-900">#{order.id.slice(-8)}</span>
                              <button
                                onClick={() => copyToClipboard(order.id, 'Internal Order ID')}
                                className="p-1 text-gray-400 hover:text-golden transition-colors flex-shrink-0"
                                title="Copy full order ID"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500">Internal ID</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4" style={{width: '200px'}}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {order.user?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1 min-w-0">
                              <span className="truncate max-w-[120px] block" title={order.user?.email}>
                                {order.user?.email}
                              </span>
                              {order.user?.email && (
                                <button
                                  onClick={() => copyToClipboard(order.user.email, 'Customer Email')}
                                  className="p-0.5 text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0"
                                  title="Copy customer email"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4" style={{width: '180px'}}>
                        <div>
                          {order.paymentId ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ExternalLink className="h-4 w-4 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                    {order.paymentId.slice(-8)}
                                  </code>
                                  <button
                                    onClick={() => copyToClipboard(order.paymentId, 'Cashfree Order ID')}
                                    className="p-1 text-gray-400 hover:text-purple-500 transition-colors flex-shrink-0"
                                    title="Copy Cashfree order ID"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="text-xs text-gray-500 truncate">Cashfree</div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm flex items-center gap-2">
                              <Database className="h-4 w-4 flex-shrink-0" />
                              <span className="text-xs">No Payment ID</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4" style={{width: '140px'}}>
                        <div className="flex items-center gap-1 text-gray-700">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <div className="text-xs">
                            <div className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                            <div className="text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4" style={{width: '100px'}}>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-900">{order.items?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900 text-sm" style={{width: '100px'}}>
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-4 py-4" style={{width: '120px'}}>
                        <div>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className={`w-full px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-golden focus:outline-none cursor-pointer ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'CONFIRMED' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-4" style={{width: '140px'}}>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <select
                            value={order.paymentStatus || 'PENDING'}
                            onChange={(e) => handlePaymentStatusUpdate(order.id, e.target.value)}
                            className={`flex-1 px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-golden focus:outline-none cursor-pointer ${
                              order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                              order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                              order.paymentStatus === 'REFUNDED' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="FAILED">Failed</option>
                            <option value="REFUNDED">Refunded</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-4" style={{width: '80px'}}>
                        <button
                          onClick={() => {
                            toastInfo('Order details view coming soon')
                          }}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="9" className="px-4 py-12 text-center">
                        <div className="text-gray-500">
                          <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-medium">No orders found</p>
                          <p className="text-sm">
                            {searchTerm || statusFilter !== 'ALL' ? 'Try adjusting your search terms or filters' : 'Orders will appear here when customers place them'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                </table>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>
      
      {/* Custom CSS for horizontal scrolling - scoped to this component only */}
      <style jsx>{`
        .admin-orders-table-scroll {
          max-width: 100%;
          overflow-x: auto;
          overflow-y: visible;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          
          /* Firefox */
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #f3f4f6;
        }
        
        /* Webkit browsers (Chrome, Safari, Edge) */
        .admin-orders-table-scroll::-webkit-scrollbar {
          height: 16px;
        }
        
        .admin-orders-table-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
          margin: 0 8px;
        }
        
        .admin-orders-table-scroll::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 8px;
          border: 2px solid #f1f5f9;
          transition: background-color 0.2s ease;
        }
        
        .admin-orders-table-scroll::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        /* Table minimum width enforcement */
        .admin-orders-table-scroll table {
          table-layout: auto;
          border-spacing: 0;
        }
        
        /* Scroll shadow transitions */
        .scroll-shadow-left {
          transition: opacity 0.3s ease;
        }
        
        /* Enhanced mobile touch support */
        @media (max-width: 768px) {
          .admin-orders-table-scroll {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            /* Add momentum scrolling */
            scroll-snap-type: x proximity;
          }
          
          .admin-orders-table-scroll::-webkit-scrollbar {
            display: none;
          }
          
          /* Make table columns snap-scroll friendly on mobile */
          .admin-orders-table-scroll table th,
          .admin-orders-table-scroll table td {
            scroll-snap-align: start;
          }
        }
        
        /* Add subtle animation to scroll shadows */
        .scroll-shadow-left,
        .admin-orders-table-scroll + div::before {
          transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Ensure table maintains proper layout */
        .admin-orders-table-scroll {
          contain: layout style;
        }
        
        /* Improve scrollbar visibility */
        @media (hover: hover) and (pointer: fine) {
          .admin-orders-table-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
          }
          
          .admin-orders-table-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
            transform: scaleY(1.2);
          }
        }
        
      `}</style>
    </div>
  )
}
