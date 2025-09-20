'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package,
  ArrowRight,
  Home
} from 'lucide-react'
import { formatAmount } from '@/lib/cashfree'
import AnimatedDeliveryTruck from '@/components/icons/AnimatedDeliveryTruck'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderStatus, setOrderStatus] = useState('checking')
  const [orderData, setOrderData] = useState(null)
  const [error, setError] = useState(null)

  const orderId = searchParams.get('order_id')

  useEffect(() => {
    if (!orderId) {
      setError('No order ID found')
      setOrderStatus('error')
      return
    }

    // Check payment status
    checkPaymentStatus()
  }, [orderId])

  const checkPaymentStatus = async () => {
    try {
      console.log('🔍 Checking payment status for order:', orderId)
      console.log('📊 URL search params:', Array.from(searchParams.entries()))
      
      // Check if this is development mode
      const isDevMode = searchParams.get('dev_mode') === 'true'
      
      if (isDevMode) {
        console.log('🚧 Development mode - simulating successful payment')
        setOrderData({
          id: orderId,
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          totalAmount: 3500,
          paymentId: orderId,
          paymentMethod: 'cashfree_dev'
        })
        setOrderStatus('success')
        return
      }
      
      const response = await fetch(`/api/payment/status?orderId=${orderId}`)
      const data = await response.json()
      
      console.log('📊 Payment status API response:', {
        status: response.status,
        success: data.success,
        orderFound: !!data.order,
        orderId: data.order?.id,
        paymentId: data.order?.paymentId,
        paymentStatus: data.order?.paymentStatus,
        orderStatus: data.order?.status
      })

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check payment status')
      }

      setOrderData(data.order)
      
      // Determine status based on payment status
      switch (data.order.paymentStatus) {
        case 'PAID':
          setOrderStatus('success')
          break
        case 'FAILED':
          setOrderStatus('failed')
          break
        default:
          setOrderStatus('pending')
          break
      }

    } catch (error) {
      console.error('Payment status check failed:', error)
      setError(error.message)
      setOrderStatus('error')
    }
  }

  const getStatusIcon = () => {
    switch (orderStatus) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-500" />
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />
      default:
        return <XCircle className="h-16 w-16 text-gray-400" />
    }
  }

  const getStatusMessage = () => {
    switch (orderStatus) {
      case 'success':
        return {
          title: 'Payment Successful! 🎉',
          message: 'Thank you for your order! Your payment has been processed successfully.',
          color: 'text-green-600'
        }
      case 'failed':
        return {
          title: 'Payment Failed 😔',
          message: 'We couldn\'t process your payment. Please try again or contact support.',
          color: 'text-red-600'
        }
      case 'pending':
        return {
          title: 'Payment Processing ⏳',
          message: 'Your payment is being processed. You will receive a confirmation shortly.',
          color: 'text-yellow-600'
        }
      default:
        return {
          title: 'Something went wrong 🚫',
          message: error || 'Unable to verify payment status.',
          color: 'text-gray-600'
        }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {orderStatus === 'checking' ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-golden"></div>
            ) : orderStatus === 'success' ? (
              <div className="flex flex-col items-center">
                <AnimatedDeliveryTruck 
                  className="w-20 h-16 mb-4" 
                  color="#d97706" 
                  isAnimating={true}
                />
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            ) : (
              getStatusIcon()
            )}
          </div>

          {/* Status Message */}
          <h1 className={`text-3xl font-bold ${statusInfo.color} mb-4`}>
            {orderStatus === 'checking' ? 'Checking Payment Status...' : statusInfo.title}
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            {orderStatus === 'checking' ? 'Please wait while we verify your payment.' : statusInfo.message}
          </p>

          {/* Order Details */}
          {orderData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#{orderData.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cashfree Order ID:</span>
                  <span className="font-medium">{orderData.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-lg">{formatAmount(orderData.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status:</span>
                  <span className={`font-medium px-2 py-1 rounded text-sm ${
                    orderData.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    orderData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {orderData.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {orderStatus === 'success' && orderData && (
              <Link
                href={`/orders/${orderData.id}`}
                className="bg-golden hover:bg-golden-dark text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Package className="h-5 w-5" />
                View My Order
              </Link>
            )}
            
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Home className="h-5 w-5" />
              Continue Shopping
            </Link>

            {orderStatus === 'failed' && (
              <Link
                href="/checkout"
                className="bg-golden hover:bg-golden-dark text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Try Again
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>

          {/* Additional Info */}
          {orderStatus === 'success' && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                📧 A confirmation email has been sent to your registered email address.
                <br />
                🚚 You will receive tracking information once your order is shipped.
              </p>
            </div>
          )}

          {orderStatus === 'pending' && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⏰ Your payment is being processed. This usually takes a few minutes.
                <br />
                📧 You will receive an email confirmation once the payment is verified.
              </p>
            </div>
          )}
        </div>

        {/* Support Info */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Need help? Contact us at{' '}
            <a 
              href="mailto:hello@thekroshetnani.com" 
              className="text-golden hover:underline"
            >
              hello@thekroshetnani.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-golden mx-auto mb-4"></div>
            <p>Loading payment status...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
