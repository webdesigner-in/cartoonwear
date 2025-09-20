'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { signOut } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: BarChart3,
      description: 'Overview & Analytics'
    },
    {
      name: 'Products',
      href: '/admin/products', 
      icon: Package,
      description: 'Manage Products'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      description: 'Order Management'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      description: 'User Management'
    }
  ]

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const isActive = (href) => pathname === href

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-20 h-fit">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white border border-cream-300 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <Menu className="h-5 w-5 text-gray-900" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-cream-300 shadow-xl z-30 transition-all duration-300 ease-in-out flex flex-col
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'w-16' : 'w-64'}
      `}>
        
        {/* Header */}
        <div className="relative p-4 border-b border-cream-300 bg-gradient-to-r from-golden/10 to-cream-100">
          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex absolute top-4 right-4 p-1.5 hover:bg-cream-200 rounded-md transition-colors z-10"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>
          
          {/* Header Content */}
          <div className={`transition-all duration-300 ${collapsed ? 'opacity-0 invisible' : 'opacity-100 visible'} pr-12`}>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">Management Hub</p>
          </div>
          
          {/* Collapsed State Icon */}
          <div className={`transition-all duration-300 ${collapsed ? 'opacity-100 visible' : 'opacity-0 invisible'} absolute top-4 left-4`}>
            <div className="w-8 h-8 bg-golden rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Back to Site */}
          <Link
            href="/"
            className={`
              flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
              text-gray-700 hover:bg-cream-100 hover:text-gray-900
              ${collapsed ? 'justify-center' : 'justify-start'}
            `}
            title={collapsed ? 'Back to Site' : ''}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">Back to Site</span>}
          </Link>

          <div className="border-t border-cream-200 pt-4 mt-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${active 
                      ? 'bg-golden text-white shadow-md' 
                      : 'text-gray-700 hover:bg-cream-100 hover:text-gray-900'
                    }
                    ${collapsed ? 'justify-center' : 'justify-start'}
                  `}
                  title={collapsed ? item.name : ''}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <div className="ml-3 min-w-0 flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className={`text-xs ${active ? 'text-white/80' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                  {!collapsed && active && (
                    <div className="w-2 h-2 bg-white rounded-full opacity-80" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-cream-300 p-4">
          <button
            onClick={handleSignOut}
            className={`
              w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200
              ${collapsed ? 'justify-center' : 'justify-start'}
            `}
            title={collapsed ? 'Sign Out' : ''}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
