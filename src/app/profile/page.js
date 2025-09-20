'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { User, MapPin, Plus, Edit, Trash2, Save, X } from 'lucide-react'
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
        // Fetch user data
        const userRes = await fetch('/api/user')
        if (!userRes.ok) throw new Error('Failed to fetch user')
        const userData = await userRes.json()
        setUser(userData.user)

        // Fetch addresses
        const addressRes = await fetch('/api/address')
        if (!addressRes.ok) throw new Error('Failed to fetch addresses')
        const addressData = await addressRes.json()
        setAddresses(addressData.addresses)
      } catch (err) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [authLoading, isAuthenticated, router])

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and addresses</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-golden" />
              Account Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="text-gray-900">{user?.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="text-gray-900">{user?.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="text-gray-900 capitalize">{user?.role?.toLowerCase()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <div className="text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Address Management */}
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-golden" />
                  Delivery Addresses
                </h2>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Address
                </button>
              </div>

              {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📍</div>
                    <p className="text-gray-700 mb-4">No addresses added yet</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="btn btn-secondary"
                    >
                      Add Your First Address
                    </button>
                  </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map(address => (
                      <div key={address.id} className="p-4 border border-cream-300 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-gray-900">
                            {address.firstName} {address.lastName}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-golden hover:text-golden-dark"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">
                          <div>{address.address1}</div>
                          {address.address2 && <div>{address.address2}</div>}
                          <div>{address.city}, {address.state} {address.zipCode}</div>
                          <div>{address.country}</div>
                          <div className="mt-1">Phone: {address.phone}</div>
                          {address.isDefault && (
                            <span className="inline-block mt-2 px-2 py-1 bg-golden text-white text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
              )}
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