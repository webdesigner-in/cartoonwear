import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's addresses
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ addresses })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

// POST - Create new address
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone, address1, address2, city, state, zipCode, country, isDefault } = body

    if (!firstName || !lastName || !phone || !address1 || !city || !state || !zipCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        phone,
        address1,
        address2,
        city,
        state,
        zipCode,
        country: country || 'India',
        isDefault: isDefault || false
      }
    })

    return NextResponse.json({ address }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}

// PUT - Update address
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 })
    }

    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: session.user.id }
    })

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // If this is set as default, unset other defaults
    if (updateData.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ address })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

// DELETE - Delete address
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 })
    }

    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: session.user.id }
    })

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    await prisma.address.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Address deleted successfully' })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}