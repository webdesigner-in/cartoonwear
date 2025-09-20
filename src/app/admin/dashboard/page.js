'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight,
  Eye,
  Calendar
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AdminSidebar from '@/components/AdminSidebar'
import Link from 'next/link'

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeProducts: 0,
    totalRevenueAll: 0,
    recentOrdersCount: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // Wait for auth to load before making any decisions
    if (authLoading) return
    
    if (!isAuthenticated || !user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      router.push('/')
      return
    }

    async function fetchData() {
      try {
        console.log('Fetching dashboard data...')
        
        // Fetch dashboard stats
        const statsRes = await fetch('/api/admin/dashboard')
        console.log('Stats response status:', statsRes.status)
        
        if (!statsRes.ok) {
          const errorData = await statsRes.json()
          console.error('Stats error:', errorData)
          throw new Error(errorData.error || 'Failed to fetch stats')
        }
        
        const statsData = await statsRes.json()
        console.log('Stats data received:', statsData)
        setStats(statsData)

        // Fetch recent orders (limit to 5)
        const ordersRes = await fetch('/api/admin/orders')
        console.log('Orders response status:', ordersRes.status)
        
        if (!ordersRes.ok) {
          console.warn('Failed to fetch orders, continuing with empty orders')
          setRecentOrders([])
        } else {
          const ordersData = await ordersRes.json()
          console.log('Orders data received:', ordersData)
          setRecentOrders(ordersData.orders?.slice(0, 5) || [])
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        toast.error(`Dashboard Error: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [authLoading, isAuthenticated, user, router])

  // Show loading state while auth is being checked or admin data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Don't render anything if not authenticated or not admin (will redirect)
  if (!isAuthenticated || !user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 lg:ml-0">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening in your store.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-golden/10 rounded-lg">
                  <Package className="h-6 w-6 text-golden" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/products" className="text-golden hover:text-golden-dark font-medium text-sm flex items-center gap-1">
                  Manage Products <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                  View Orders <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/users" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                  Manage Users <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-purple-600 font-medium text-sm">All time earnings</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                  <Link href="/admin/orders" className="text-golden hover:text-golden-dark font-medium flex items-center gap-1">
                    View All <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-golden/10 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-golden" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Order #{order.id.slice(-8)}</div>
                          <div className="text-sm text-gray-600">
                            {order.user?.name} • {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₹{order.totalAmount}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No orders yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/admin/products" className="block w-full p-3 text-left border border-cream-300 rounded-lg hover:border-golden hover:bg-golden/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-golden" />
                      <div>
                        <div className="font-medium text-gray-900">Manage Products</div>
                        <div className="text-sm text-gray-600">Add, edit, delete products</div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin/orders" className="block w-full p-3 text-left border border-cream-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Process Orders</div>
                        <div className="text-sm text-gray-600">View and manage orders</div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin/users" className="block w-full p-3 text-left border border-cream-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-900">Manage Users</div>
                        <div className="text-sm text-gray-600">User roles and permissions</div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/" className="block w-full p-3 text-left border border-cream-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">View Site</div>
                        <div className="text-sm text-gray-600">See customer experience</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}