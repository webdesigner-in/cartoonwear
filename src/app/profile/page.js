'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { User, MapPin, Plus, Edit, Trash2, Save, X, Mail, Calendar, Shield, ShoppingBag, Package } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  })

  useEffect(() => {
    // Wait for auth to load before making any decisions
    if (authLoading) return
    
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }

    async function fetchData() {
      try {
        console.log('Auth user data:', authUser)
        
        // If we have session data, use it immediately as fallback
        if (authUser) {
          setUser(authUser)
        }
        
        // Fetch user data
        try {
          const userRes = await fetch('/api/user')
          if (userRes.ok) {
            const userData = await userRes.json()
            console.log('User data received:', userData)
            if (userData.user) {
              setUser(userData.user)
            }
          } else {
            console.warn('Failed to fetch user data from API, status:', userRes.status)
            if (!authUser) {
              throw new Error('No user data available')
            }
          }
        } catch (userErr) {
          console.warn('Error fetching user data:', userErr)
          if (!authUser) {
            throw new Error('Unable to load user profile')
          }
        }

        // Fetch addresses
        try {
          const addressRes = await fetch('/api/address')
          if (!addressRes.ok) throw new Error('Failed to fetch addresses')
          const addressData = await addressRes.json()
          setAddresses(addressData.addresses)
        } catch (addressErr) {
          console.error('Error fetching addresses:', addressErr)
          toast.error('Failed to load addresses')
          setAddresses([])
        }
      } catch (err) {
        console.error('General error:', err)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [authLoading, isAuthenticated, router, authUser])

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const method = editingAddress ? 'PUT' : 'POST'
      const url = editingAddress ? '/api/address' : '/api/address'
      const body = editingAddress 
        ? { id: editingAddress.id, ...addressForm }
        : addressForm

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!res.ok) throw new Error('Failed to save address')
      
      const data = await res.json()
      
      if (editingAddress) {
        setAddresses(addresses.map(addr => 
          addr.id === editingAddress.id ? data.address : addr
        ))
        toast.success('Address updated successfully')
      } else {
        setAddresses([...addresses, data.address])
        toast.success('Address added successfully')
      }
      
      resetAddressForm()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const res = await fetch('/api/address', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (!res.ok) throw new Error('Failed to delete address')
      
      setAddresses(addresses.filter(addr => addr.id !== id))
      toast.success('Address deleted successfully')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setAddressForm({
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address1: address.address1,
      address2: address.address2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    })
    setShowAddressForm(true)
  }

  const resetAddressForm = () => {
    setAddressForm({
      firstName: '',
      lastName: '',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false
    })
    setShowAddressForm(false)
    setEditingAddress(null)
  }

  // Show loading state while auth is being checked or profile is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
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
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-golden to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || authUser?.name}! 👋</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Manage your account information, addresses, and view your crochet journey with us</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-2">
            <div className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-golden/20 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-golden" />
                </div>
                Account Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Full Name</label>
                    <div className="text-blue-900 font-semibold text-lg">{user?.name || authUser?.name || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Email Address</label>
                    <div className="text-green-900 font-semibold">{user?.email || authUser?.email || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Account Type</label>
                    <div className="text-purple-900 font-semibold capitalize">
                      {user?.role?.toLowerCase() || authUser?.role?.toLowerCase() || 'Customer'}
                      {(user?.role === 'ADMIN' || authUser?.role === 'ADMIN') && ' ✨'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-1">Member Since</label>
                    <div className="text-orange-900 font-semibold">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Management */}
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-golden/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-golden" />
                  </div>
                  Delivery Addresses
                </h2>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Plus className="h-4 w-4" />
                  Add Address
                </button>
              </div>

              {addresses.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="w-16 h-16 bg-golden/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-8 w-8 text-golden" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses added yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">Add your delivery addresses to make checkout faster and easier</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="btn btn-primary shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Add Your First Address
                    </button>
                  </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map(address => (
                      <div key={address.id} className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                        address.isDefault 
                          ? 'border-golden bg-gradient-to-r from-golden/5 to-orange-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-golden/30'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              address.isDefault 
                                ? 'bg-golden text-white' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-lg">
                                {address.firstName} {address.lastName}
                              </div>
                              {address.isDefault && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-golden text-white text-xs rounded-full font-medium">
                                  ⭐ Default Address
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="p-2 text-golden hover:text-golden-dark hover:bg-golden/10 rounded-lg transition-colors"
                              title="Edit address"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete address"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-gray-700 space-y-1 pl-13">
                          <div className="font-medium">{address.address1}</div>
                          {address.address2 && <div>{address.address2}</div>}
                          <div>{address.city}, {address.state} {address.zipCode}</div>
                          <div className="text-gray-600">{address.country}</div>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <span className="font-medium">📞 {address.phone}</span>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-golden" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="block w-full p-3 text-left border border-cream-300 rounded-lg hover:border-golden hover:bg-golden/5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">My Orders</div>
                      <div className="text-xs text-gray-600">Track your purchases</div>
                    </div>
                  </div>
                </Link>
                
                <Link
                  href="/products"
                  className="block w-full p-3 text-left border border-cream-300 rounded-lg hover:border-golden hover:bg-golden/5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Browse Products</div>
                      <div className="text-xs text-gray-600">Discover new items</div>
                    </div>
                  </div>
                </Link>
                
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="block w-full p-3 text-left border border-cream-300 rounded-lg hover:border-golden hover:bg-golden/5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center">
                      <Plus className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Add Address</div>
                      <div className="text-xs text-gray-600">Quick address setup</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="card p-6 bg-gradient-to-br from-golden/10 to-orange-50 border border-golden/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Journey 🌟</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Addresses</span>
                  <span className="font-bold text-golden">{addresses.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Account Type</span>
                  <span className="font-bold text-golden capitalize">
                    {user?.role?.toLowerCase() || authUser?.role?.toLowerCase() || 'Customer'}
                  </span>
                </div>
                <div className="pt-2 border-t border-golden/20">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🧶</div>
                    <div className="text-sm text-gray-600">Crochet Enthusiast</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Form Modal */}
        {showAddressForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={resetAddressForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={addressForm.firstName}
                      onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden/20 focus:border-golden text-gray-900 font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={addressForm.lastName}
                      onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent text-gray-800 font-medium text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent text-gray-800 font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    required
                    value={addressForm.address1}
                    onChange={(e) => setAddressForm({...addressForm, address1: e.target.value})}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent text-gray-800 font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={addressForm.address2}
                    onChange={(e) => setAddressForm({...addressForm, address2: e.target.value})}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent text-gray-800 font-medium text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent text-gray-800 font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent text-gray-800 font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={addressForm.zipCode}
                      onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})}
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent text-gray-800 font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent text-gray-800 font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                    className="h-4 w-4 text-accent focus:ring-accent-light border-cream-300 rounded "
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </button>
                  <button
                    type="button"
                    onClick={resetAddressForm}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}