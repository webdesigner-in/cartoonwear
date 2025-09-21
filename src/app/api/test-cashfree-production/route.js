import { NextResponse } from 'next/server'
import { createPaymentSession } from '@/lib/cashfree'

export async function POST(request) {
  try {
    console.log('🧪 Testing Cashfree Production Credentials...')
    
    // Test data for a small amount
    const testOrderData = {
      orderId: `TEST_${Date.now()}`,
      amount: 1.00, // Rs 1 for testing
      customerId: 'test_customer',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '9999999999'
    }
    
    console.log('📋 Test order data:', testOrderData)
    
    // Try to create a payment session
    const result = await createPaymentSession(testOrderData)
    
    console.log('📊 Cashfree API Response:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Cashfree production test completed',
      result: result,
      environment: {
        CASHFREE_ENVIRONMENT: process.env.CASHFREE_ENVIRONMENT,
        CASHFREE_DEV_MODE: process.env.CASHFREE_DEV_MODE,
        NODE_ENV: process.env.NODE_ENV
      }
    })
    
  } catch (error) {
    console.error('❌ Cashfree production test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.response?.data || 'No additional details',
      environment: {
        CASHFREE_ENVIRONMENT: process.env.CASHFREE_ENVIRONMENT,
        CASHFREE_DEV_MODE: process.env.CASHFREE_DEV_MODE,
        NODE_ENV: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Cashfree Production Test Endpoint',
    instructions: 'Send a POST request to test production credentials'
  })
}