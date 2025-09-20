import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// PATCH - Update user role (with role hierarchy)
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { role, name, email, password } = body

    // Get the target user first to check permissions
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, email: true, name: true }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Role hierarchy validation
    if (session.user.role === 'ADMIN') {
      // ADMIN cannot modify SUPER_ADMIN users
      if (targetUser.role === 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Cannot modify Super Admin users' }, { status: 403 })
      }
      
      // ADMIN cannot promote users to SUPER_ADMIN
      if (role === 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Cannot promote to Super Admin' }, { status: 403 })
      }
    }

    // Prevent users from modifying themselves (to avoid lockout)
    if (session.user.id === id && role && role !== session.user.role) {
      return NextResponse.json({ error: 'Cannot modify your own role' }, { status: 403 })
    }

    // Build update data
    const updateData = {}
    if (role !== undefined) {
      const validRoles = ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN']
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      }
      updateData.role = role
    }
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    
    // Handle password update
    if (password !== undefined && password.trim() !== '') {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    return NextResponse.json({ user })

  } catch (error) {
    console.error('User update error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE - Delete user (with role hierarchy and cascade for SUPER_ADMIN)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Get the target user first to check permissions
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { 
        id: true, 
        role: true, 
        email: true,
        name: true,
        _count: {
          select: {
            orders: true,
            accounts: true,
            sessions: true,
            cart: true,
            addresses: true,
            reviews: true
          }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Role hierarchy validation
    if (session.user.role === 'ADMIN' && targetUser.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot delete Super Admin users' }, { status: 403 })
    }

    // Prevent users from deleting themselves
    if (session.user.id === id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 403 })
    }

    // For SUPER_ADMIN: Force delete with cascade (delete all related data)
    if (session.user.role === 'SUPER_ADMIN') {
      console.log(`SUPER_ADMIN attempting to delete user ${id} with data:`, targetUser._count)
      
      try {
        await prisma.$transaction(async (tx) => {
          console.log('Starting deletion transaction...')
          
          // Step 1: Delete order items first (they reference orders which reference users)
          const orderItemsResult = await tx.orderItem.deleteMany({
            where: {
              order: {
                userId: id
              }
            }
          })
          console.log(`Deleted ${orderItemsResult.count} order items`)

          // Step 2: Delete orders (no cascade in schema, so manual delete required)
          const ordersResult = await tx.order.deleteMany({
            where: { userId: id }
          })
          console.log(`Deleted ${ordersResult.count} orders`)

          // Step 3: Delete user (this will auto-cascade delete Account, Session, CartItem, Address, Review)
          const userResult = await tx.user.delete({
            where: { id }
          })
          console.log('User deleted:', userResult.email)
        })
        
        console.log('Transaction completed successfully')
      } catch (transactionError) {
        console.error('Transaction failed:', transactionError)
        throw transactionError
      }

      return NextResponse.json({ 
        message: `User '${targetUser.name}' and all related data deleted successfully`,
        deletedData: {
          orders: targetUser._count.orders,
          accounts: targetUser._count.accounts,
          sessions: targetUser._count.sessions,
          cartItems: targetUser._count.cart,
          addresses: targetUser._count.addresses,
          reviews: targetUser._count.reviews
        }
      })
    }

    // For ADMIN: Regular delete (will fail if there are related records)
    try {
      await prisma.user.delete({
        where: { id }
      })
      return NextResponse.json({ message: 'User deleted successfully' })
    } catch (deleteError) {
      if (deleteError.code === 'P2003') {
        return NextResponse.json({ 
          error: 'Cannot delete user with existing orders or related data. Contact Super Admin for force deletion.' 
        }, { status: 409 })
      }
      throw deleteError
    }

  } catch (error) {
    console.error('User deletion error:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: 'Cannot delete user due to foreign key constraints. User has related data that must be removed first.' 
      }, { status: 409 })
    }
    return NextResponse.json({ 
      error: `Failed to delete user: ${error.message}` 
    }, { status: 500 })
  }
}

// GET - Get specific user details
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Role hierarchy: ADMIN cannot see SUPER_ADMIN details
    if (session.user.role === 'ADMIN' && user.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}