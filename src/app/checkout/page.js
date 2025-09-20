'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useCart } from '@/components/CartContext'
import Link from 'next/link'
import { ArrowLeft, MapPin, CreditCard, Truck, Shield } from 'lucide-react'
import AnimatedDeliveryTruck from '@/components/icons/AnimatedDeliveryTruck'

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { updateCartCount } = useCart()
  const [cart, setCart] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [orderAnimating, setOrderAnimating] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isPaymentRedirecting, setIsPaymentRedirecting] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    async function fetchData() {
      try {
        // Fetch cart
        const cartRes = await fetch('/api/cart')
        if (!cartRes.ok) throw new Error('Failed to fetch cart')
        const cartData = await cartRes.json()
        setCart(cartData.cart)

        // Fetch addresses
        const addressRes = await fetch('/api/address')
        if (!addressRes.ok) throw new Error('Failed to fetch addresses')
        const addressData = await addressRes.json()
        setAddresses(addressData.addresses)
        
        // Set default address
        const defaultAddr = addressData.addresses.find(addr => addr.isDefault)
        if (defaultAddr) {
          setSelectedAddress(defaultAddr.id)
        }
      } catch (err) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session, router])

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    const subtotal = calculateSubtotal()
    return subtotal >= 1000 ? 0 : 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }

    setProcessing(true)
    
    try {
      if (paymentMethod === 'online') {
        // Handle Cashfree payment
        await handleOnlinePayment()
      } else {
        // Handle COD order
        await handleCODOrder()
      }
    } catch (err) {
      toast.error(err.message)
      setProcessing(false)
      setOrderAnimating(false)
      setIsPaymentRedirecting(false)
    }
  }

  const handleCODOrder = async () => {
    setOrderAnimating(true)
    
    const orderData = {
      addressId: selectedAddress,
      paymentMethod: 'cod',
      totalAmount: calculateTotal(),
      shippingAmount: calculateShipping(),
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }))
    }

    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })

    if (!res.ok) throw new Error('Failed to place order')
    
    const order = await res.json()
    
    // Show animation for 2 seconds before proceeding
    setTimeout(() => {
      toast.success('Order placed successfully! Your delivery is on the way!')
      
      // Clear cart
      updateCartCount()
      
      // Redirect to order confirmation after animation
      setTimeout(() => {
        router.push(`/orders/${order.order.id}`)
      }, 500)
    }, 2000)
  }

  const handleOnlinePayment = async () => {
    setIsPaymentRedirecting(true)
    
    const paymentData = {
      cartItems: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      })),
      addressId: selectedAddress,
      totalAmount: calculateTotal(),
      shippingAmount: calculateShipping()
    }

    console.log('Initiating payment with data:', paymentData)

    const res = await fetch('/api/payment/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || 'Failed to initiate payment')
    }
    
    const paymentResponse = await res.json()
    console.log('Payment initiated:', paymentResponse)
    
    // Clear cart before redirecting to payment
    updateCartCount()
    
    // Redirect to Cashfree payment page
    toast.success('Redirecting to secure payment gateway...')
    
    // Small delay for UX, then redirect
    setTimeout(() => {
      window.location.href = paymentResponse.paymentUrl
    }, 1000)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-700 mb-4">Add some items to your cart before checkout.</p>
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
        <div className="mb-8">
          <Link href="/cart" className="text-golden hover:text-golden-dark hover:underline flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-golden" />
                Delivery Address
              </h2>
              
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-700 mb-4">No addresses found</p>
                  <Link href="/profile" className="btn btn-primary">
                    Add Address
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(address => (
                    <label key={address.id} className="block">
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddress === address.id 
                          ? 'border-golden bg-golden/10' 
                          : 'border-cream-300 hover:border-golden'
                      }`}>
                        <div className="font-medium text-gray-700">
                          {address.firstName} {address.lastName}
                        </div>
                        <div className="text-gray-700">
                          {address.address1}
                          {address.address2 && `, ${address.address2}`}
                        </div>
                        <div className="text-gray-700">
                          {address.city}, {address.state} {address.zipCode}
                        </div>
                        <div className="text-gray-700">{address.country}</div>
                        <div className="text-gray-700">Phone: {address.phone}</div>
                        {address.isDefault && (
                          <span className="inline-block mt-2 px-2 py-1 bg-accent text-white text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-golden" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <label className="block">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'cod' 
                      ? 'border-golden bg-golden/10' 
                      : 'border-cream-300 hover:border-golden'
                  }`}>
                    <div className="font-medium text-gray-700">Cash on Delivery</div>
                    <div className="text-sm text-gray-700">Pay when your order arrives</div>
                  </div>
                </label>
                
                <label className="block">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'online' 
                      ? 'border-golden bg-golden/10' 
                      : 'border-cream-300 hover:border-golden'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-700">Online Payment</div>
                        <div className="text-sm text-gray-600">Pay securely with UPI, Cards, Net Banking</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">Powered by</div>
                        <div className="text-sm font-bold text-blue-600">Cashfree</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="h-3 w-3" />
                      <span>SSL Encrypted • Secure Payment Gateway</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {(() => {
                        try {
                          let imageUrl = null;
                          if (item.product.images) {
                            if (typeof item.product.images === 'string') {
                              const parsedImages = JSON.parse(item.product.images);
                              imageUrl = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : null;
                            } else if (Array.isArray(item.product.images) && item.product.images.length > 0) {
                              imageUrl = item.product.images[0];
                            }
                          }
                          
                          return imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=64&h=64&fit=crop';
                                e.target.onerror = null;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              🧶
                            </div>
                          );
                        } catch (error) {
                          return (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              🧶
                            </div>
                          );
                        }
                      })()
                      }
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-700">{item.product.name}</h3>
                      <p className="text-sm text-gray-700">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-gray-700">
                      ₹{item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Price Breakdown</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-700">₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping</span>
                  <span className="text-gray-700">
                    {calculateShipping() === 0 ? 'Free' : `₹${calculateShipping()}`}
                  </span>
                </div>
                <div className="border-t border-cream-300 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-700">Total</span>
                    <span className="text-golden">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {calculateSubtotal() < 1000 && (
                <div className="mt-4 p-3 bg-golden/10 rounded-lg">
                  <p className="text-sm text-golden">
                    Add ₹{1000 - calculateSubtotal()} more for free shipping!
                  </p>
                </div>
              )}
            </div>

            {/* Security Features */}
            <div className="card p-6">
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <Shield className="h-5 w-5 text-golden" />
                <span>Secure checkout with SSL encryption</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={processing || !selectedAddress}
              className="w-full btn btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
            >
              {processing ? (
                <>
                  <AnimatedDeliveryTruck 
                    className="w-6 h-6" 
                    color="white" 
                    isAnimating={orderAnimating}
                  />
                  {orderAnimating ? 'Delivering Your Order...' : 'Processing...'}
                </>
              ) : (
                <>
                  <AnimatedDeliveryTruck className="w-6 h-6" color="white" />
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </main>
  )
}
