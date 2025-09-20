// Test the new HTTP-based Cashfree implementation
require('dotenv').config({ path: './.env.local' })

console.log('Environment variables:')
console.log('CASHFREE_APP_ID:', process.env.CASHFREE_APP_ID)
console.log('CASHFREE_SECRET_KEY:', process.env.CASHFREE_SECRET_KEY ? 'Set' : 'Not set')
console.log('CASHFREE_ENVIRONMENT:', process.env.CASHFREE_ENVIRONMENT)
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
console.log('CASHFREE_DEV_MODE:', process.env.CASHFREE_DEV_MODE)

// Test the new Cashfree implementation
async function testCashfree() {
  try {
    const { createPaymentSession, generateOrderId } = require('./src/lib/cashfree.js')
    
    console.log('\n✅ Cashfree library imported successfully')
    
    // Test order ID generation
    const orderId = generateOrderId()
    console.log('Generated order ID:', orderId)
    
    // Test payment session creation
    const testOrderData = {
      orderId: orderId,
      amount: 100,
      customerId: 'test_customer_123',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '9876543210'
    }
    
    console.log('\n🔄 Testing payment session creation...')
    const result = await createPaymentSession(testOrderData)
    
    if (result.success) {
      console.log('✅ Payment session created successfully!')
      console.log('Session ID:', result.sessionId)
      console.log('Payment URL:', result.paymentUrl)
    } else {
      console.log('❌ Payment session creation failed:')
      console.log('Error:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Error testing Cashfree:', error.message)
  }
}

// Run the test
testCashfree()
