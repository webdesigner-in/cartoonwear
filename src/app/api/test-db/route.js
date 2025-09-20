import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Simple database test
    const result = await prisma.$queryRaw`SELECT 1 as test`
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection working',
      result 
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    }, { status: 500 })
  }
}