import axios from 'axios'

// Get Cashfree configuration
const getCashfreeConfig = () => {
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    console.error('Missing Cashfree credentials:', {
      appId: !!process.env.CASHFREE_APP_ID,
      secretKey: !!process.env.CASHFREE_SECRET_KEY,
      environment: process.env.CASHFREE_ENVIRONMENT
    })
    throw new Error('Cashfree credentials not found in environment variables')
  }

  const isProduction = process.env.CASHFREE_ENVIRONMENT === 'production'
  const baseUrl = isProduction
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg'

  console.log('Cashfree config:', {
    appId: process.env.CASHFREE_APP_ID?.substring(0, 8) + '...',
    environment: process.env.CASHFREE_ENVIRONMENT,
    baseUrl
  })

  return {
    baseUrl,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-client-id': process.env.CASHFREE_APP_ID,
      'x-client-secret': process.env.CASHFREE_SECRET_KEY,
      'x-api-version': '2023-08-01'
    }
  }
}

// Create payment session
const createPaymentSession = async (orderData) => {
  
  try {
    const config = getCashfreeConfig()
    
    const request = {
      order_id: orderData.orderId,
      order_amount: parseFloat(orderData.amount),
      order_currency: 'INR',
      customer_details: {
        customer_id: String(orderData.customerId),
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
      },
      order_meta: {
        return_url: `https://www.thekroshetnani.com/payment/success?order_id={order_id}`,
        notify_url: `https://www.thekroshetnani.com/api/payment/webhook`,
        payment_methods: 'cc,dc,upi,nb,app,paylater'
      }
    }

    console.log('Creating payment session with request:', JSON.stringify(request, null, 2))

    // Make direct API call to Cashfree
    const response = await axios.post(
      `${config.baseUrl}/orders`,
      request,
      { headers: config.headers }
    )
    
    console.log('Payment session response:', JSON.stringify(response.data, null, 2))
    
    if (response.data) {
      // According to Cashfree v2023-08-01 API docs, use the payment_link from response
      let paymentUrl = null
      
      // Check for payment_link in the response (this is what the API should return)
      if (response.data.payment_link) {
        paymentUrl = response.data.payment_link
      } 
      // Fallback: Check for payment_links object
      else if (response.data.payment_links && response.data.payment_links.web) {
        paymentUrl = response.data.payment_links.web
      }
      // Last resort: Construct URL from payment_session_id
      else if (response.data.payment_session_id) {
        const isProduction = process.env.CASHFREE_ENVIRONMENT === 'production'
        const baseHost = isProduction ? 'payments.cashfree.com' : 'payments-test.cashfree.com'
        paymentUrl = `https://${baseHost}/pay/${response.data.payment_session_id}`
      }
        
      // Log all available fields for debugging
      console.log('Available response fields:', Object.keys(response.data))
      console.log('Payment URL determined:', paymentUrl)
      
      return {
        success: true,
        sessionId: response.data.payment_session_id,
        orderId: response.data.order_id,
        cfOrderId: response.data.cf_order_id,
        paymentUrl: paymentUrl,
        rawResponse: response.data // Include raw response for debugging
      }
    } else {
      throw new Error('Invalid response from Cashfree API')
    }
  } catch (error) {
    console.error('Payment session creation failed:', error)
    console.error('Error details:', error.response?.data || error.message)
    
    // Log error for debugging
    console.error('Cashfree API Error - Full Response:', error.response?.data)
    console.error('Cashfree API Error - Status:', error.response?.status)
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Payment session creation failed'
    }
  }
}

// Verify payment signature
const verifyPaymentSignature = (postData, signature) => {
  try {
    // For now, we'll skip signature verification in development
    // In production, you should implement proper signature verification
    // using the webhook signature verification logic
    console.log('Webhook signature verification - signature:', signature)
    console.log('Webhook signature verification - data:', JSON.stringify(postData))
    
    // TODO: Implement proper signature verification
    // For now, return true to allow webhook processing
    return true
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

// Get order status
const getOrderStatus = async (orderId) => {
  try {
    const config = getCashfreeConfig()
    
    const response = await axios.get(
      `${config.baseUrl}/orders/${orderId}/payments`,
      { headers: config.headers }
    )
    
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    console.error('Order status fetch failed:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `TKN_${timestamp}_${random}`
}

// Format amount for display
const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

// Named exports
export {
  createPaymentSession,
  verifyPaymentSignature,
  getOrderStatus,
  generateOrderId,
  formatAmount
}
