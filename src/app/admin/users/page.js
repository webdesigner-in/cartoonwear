'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Shield,
  ShieldCheck,
  Crown,
  Mail,
  Calendar,
  ShoppingBag,
  Key,
  RefreshCw,
  Copy
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminUsers() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  })

  useEffect(() => {
    if (authLoading) return
    
    if (!isAuthenticated || !user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      router.push('/')
      return
    }

    fetchUsers()
  }, [authLoading, isAuthenticated, user, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        // Update existing user
        const updateData = {
          name: userForm.name,
          role: userForm.role
        }
        
        // Only include password if it's provided
        if (userForm.password.trim()) {
          updateData.password = userForm.password
        }
        
        const response = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        
        setUsers(users.map(u => u.id === editingUser.id ? data.user : u))
        toast.success('User updated successfully')
      } else {
        // Create new user
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userForm),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        
        setUsers([data.user, ...users])
        toast.success('User created successfully')
      }
      
      setShowUserForm(false)
      resetUserForm()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleUpdateUser = async (userId, updateData) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      
      setUsers(users.map(u => u.id === userId ? data.user : u))
      toast.success('User updated successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteUser = async (userId, userName, userRole, userOrderCount) => {
    const isSuperAdmin = user.role === 'SUPER_ADMIN'
    const hasOrders = userOrderCount > 0
    
    let confirmMessage = `Are you sure you want to delete ${userName}?`
    
    if (isSuperAdmin && hasOrders) {
      confirmMessage += `\n\n⚠️ This user has ${userOrderCount} order(s). As Super Admin, you can force delete this user and ALL related data including:\n• Orders and order items\n• User addresses\n• OAuth accounts\n• Sessions\n\nThis action cannot be undone!`
    } else if (hasOrders) {
      confirmMessage += `\n\n⚠️ This user has ${userOrderCount} order(s). Deletion may fail due to related data.`
    } else {
      confirmMessage += `\n\nThis action cannot be undone.`
    }

    if (!confirm(confirmMessage)) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      
      setUsers(users.filter(u => u.id !== userId))
      
      // Show detailed success message for super admin
      if (isSuperAdmin && data.deletedData) {
        const { orders, accounts, sessions, cartItems, addresses, reviews } = data.deletedData
        const parts = []
        if (orders > 0) parts.push(`${orders} orders`)
        if (cartItems > 0) parts.push(`${cartItems} cart items`)
        if (addresses > 0) parts.push(`${addresses} addresses`)
        if (reviews > 0) parts.push(`${reviews} reviews`)
        if (accounts > 0) parts.push(`${accounts} accounts`)
        if (sessions > 0) parts.push(`${sessions} sessions`)
        
        const detailText = parts.length > 0 ? ` Removed: ${parts.join(', ')}` : ''
        toast.success(
          `User deleted successfully!${detailText}`,
          { duration: 6000 }
        )
      } else {
        toast.success(data.message || 'User deleted successfully')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    
    // Ensure at least one character from each type
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)] // lowercase
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)] // uppercase
    password += "0123456789"[Math.floor(Math.random() * 10)] // number
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)] // special
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  const handleGeneratePassword = () => {
    const newPassword = generatePassword()
    setUserForm({...userForm, password: newPassword})
  }

  const handleCopyPassword = async () => {
    if (userForm.password) {
      try {
        await navigator.clipboard.writeText(userForm.password)
        toast.success('Password copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy password')
      }
    }
  }

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'CUSTOMER'
    })
    setEditingUser(null)
  }

  const handleEditUser = (userToEdit) => {
    setUserForm({
      name: userToEdit.name,
      email: userToEdit.email,
      password: '', // Don't populate password for security
      role: userToEdit.role
    })
    setEditingUser(userToEdit)
    setShowUserForm(true)
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Crown className="h-4 w-4 text-purple-600" />
      case 'ADMIN':
        return <ShieldCheck className="h-4 w-4 text-blue-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredUsers = users.filter(usr => {
    const matchesSearch = 
      usr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usr.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'ALL' || usr.role === roleFilter

    return matchesSearch && matchesRole
  })

  const canModifyUser = (targetUser) => {
    // Super admin can modify anyone except themselves for role changes
    if (user.role === 'SUPER_ADMIN') return true
    
    // Admin cannot modify super admins
    if (user.role === 'ADMIN' && targetUser.role === 'SUPER_ADMIN') return false
    
    return true
  }

  const canDeleteUser = (targetUser) => {
    // Cannot delete yourself
    if (user.id === targetUser.id) return false
    
    // Admin cannot delete super admins
    if (user.role === 'ADMIN' && targetUser.role === 'SUPER_ADMIN') return false
    
    return true
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-0 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
      
      <div className="flex-1 lg:ml-0">
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
              <p className="text-gray-600">Manage users and their roles</p>
            </div>
            {user.role === 'SUPER_ADMIN' && (
              <button
                onClick={() => {
                  resetUserForm()
                  setShowUserForm(true)
                }}
                className="mt-4 sm:mt-0 bg-golden hover:bg-golden-dark text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                Add User
              </button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="card p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden focus:border-transparent"
                >
                  <option value="ALL">All Roles</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                  {user.role === 'SUPER_ADMIN' && (
                    <option value="SUPER_ADMIN">Super Admin</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? filteredUsers.map(usr => (
                    <tr key={usr.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{usr.name}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="h-3 w-3" />
                              {usr.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {canModifyUser(usr) ? (
                            <select
                              value={usr.role}
                              onChange={(e) => handleUpdateUser(usr.id, { role: e.target.value })}
                              className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-golden ${getRoleColor(usr.role)}`}
                              disabled={usr.id === user.id || (user.role === 'ADMIN' && usr.role === 'SUPER_ADMIN')}
                            >
                              <option value="CUSTOMER">Customer</option>
                              <option value="ADMIN">Admin</option>
                              {user.role === 'SUPER_ADMIN' && (
                                <option value="SUPER_ADMIN">Super Admin</option>
                              )}
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(usr.role)}`}>
                              {usr.role.replace('_', ' ')}
                            </span>
                          )}
                          {getRoleIcon(usr.role)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className={`h-4 w-4 ${usr._count.orders > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span className={`${usr._count.orders > 0 ? 'text-blue-700 font-medium' : 'text-gray-900'}`}>
                            {usr._count.orders}
                          </span>
                          {usr._count.orders > 0 && user.role === 'SUPER_ADMIN' && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                              Has Data
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(usr.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {canModifyUser(usr) && (
                            <button
                              onClick={() => handleEditUser(usr)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {canDeleteUser(usr) && (
                            <button
                              onClick={() => handleDeleteUser(usr.id, usr.name, usr.role, usr._count.orders)}
                              className={`p-2 rounded-lg transition-colors ${
                                usr._count.orders > 0 && user.role === 'SUPER_ADMIN'
                                  ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50 border border-orange-200' 
                                  : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                              }`}
                              title={user.role === 'SUPER_ADMIN' && usr._count.orders > 0 ? `Force Delete (${usr._count.orders} orders)` : "Delete User"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-medium">No users found</p>
                          <p className="text-sm">
                            {searchTerm || roleFilter !== 'ALL' ? 'Try adjusting your search terms or filters' : 'Users will appear here when they register'}
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

      {/* User Form Modal */}
      {showUserForm && user.role === 'SUPER_ADMIN' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h3>
                <button
                  onClick={() => setShowUserForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden focus:border-transparent"
                    placeholder="Enter user name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden focus:border-transparent"
                    placeholder="Enter email address"
                    disabled={editingUser}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editingUser && <span className="text-xs text-gray-500">(leave empty to keep current)</span>}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="password"
                        required={!editingUser}
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden focus:border-transparent"
                        placeholder={editingUser ? "Enter new password (optional)" : "Enter password"}
                        minLength="6"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                      title="Generate secure password"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    {userForm.password && (
                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                        title="Copy password"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {userForm.password && (
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <div className="text-gray-600">
                        Password strength: {userForm.password.length >= 12 ? 
                          <span className="text-green-600 font-medium">Very Strong</span> : 
                          userForm.password.length >= 8 ? 
                          <span className="text-blue-600 font-medium">Strong</span> : 
                          userForm.password.length >= 6 ? 
                          <span className="text-orange-600 font-medium">Fair</span> :
                          <span className="text-red-600 font-medium">Weak</span>
                        }
                      </div>
                      <div className="text-gray-500">
                        {userForm.password.length} characters
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden focus:border-transparent"
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-golden hover:bg-golden-dark text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUserForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}