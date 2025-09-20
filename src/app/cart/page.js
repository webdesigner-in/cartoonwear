"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, Heart, ArrowLeft, ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import PackageTruck from '@/components/icons/PackageTruck';

// Fetch cart data from API

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateCartCount } = useCart();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      setError(null);
      if (session) {
        try {
          const res = await fetch('/api/cart');
          if (!res.ok) throw new Error('Failed to fetch cart');
          const data = await res.json();
          setCart(data.cart.map(item => {
            let imageUrl = '';
            try {
              if (item.product.images) {
                if (typeof item.product.images === 'string') {
                  const parsedImages = JSON.parse(item.product.images);
                  imageUrl = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : '';
                } else if (Array.isArray(item.product.images) && item.product.images.length > 0) {
                  imageUrl = item.product.images[0];
                }
              }
            } catch (error) {
              console.warn('Error parsing product images:', error);
              imageUrl = '';
            }
            
            return {
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              image: imageUrl,
              quantity: item.quantity,
              material: item.product.material,
              size: item.product.size,
              color: item.product.color,
            };
          }));
          localStorage.removeItem('guestCart');
        } catch (err) {
          setError('Failed to fetch cart');
          setCart([]);
        }
      } else {
        // Guest user: use localStorage
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
          setCart(JSON.parse(guestCart));
        } else {
          setCart([]);
        }
      }
      setLoading(false);
    }
    fetchCart();
  }, [session]);

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handlers
  const handleRemove = async (id) => {
    if (session) {
      try {
        const res = await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id }),
        });
        if (!res.ok) throw new Error('Failed to remove item');
        setCart(cart.filter(item => item.id !== id));
        await updateCartCount();
        toast.success('Item removed from cart');
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      const updatedCart = cart.filter(item => item.id !== id);
      setCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      toast.success('Item removed from cart');
    }
  };

  const handleQuantity = async (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    if (session) {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id, quantity: newQuantity - item.quantity }),
        });
        setCart(cart.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));
        await updateCartCount();
        toast.success('Cart updated');
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      const updatedCart = cart.map(i => i.id === id ? { ...i, quantity: newQuantity } : i);
      setCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      toast.success('Cart updated');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
      {/* Header with breadcrumb */}
      <div className="bg-white shadow-sm border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/" className="hover:text-golden transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-golden transition-colors">Products</Link>
            <span>/</span>
            <span className="text-golden font-medium">Shopping Cart</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-golden" />
              Shopping Cart
            </h1>
            <Link 
              href="/products" 
              className="text-golden hover:text-golden-dark transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden"></div>
            <span className="ml-4 text-gray-600 text-lg">Loading your cart...</span>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-8xl mb-6">🛜</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
              <p className="text-gray-600 mb-8">Discover our beautiful handcrafted crochet items!</p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-golden hover:bg-golden-dark text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <ShoppingBag className="h-5 w-5" />
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-golden" />
                  Cart Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="group relative bg-gradient-to-r from-cream-50 to-white rounded-xl p-4 border border-cream-200 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shadow-md">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop';
                                  e.target.onerror = null;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-golden text-2xl">
                                🧶
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{item.name}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.material && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                {item.material}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                                {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                {item.size}
                              </span>
                            )}
                          </div>
                          <div className="text-golden font-bold text-xl">₹{item.price}</div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-white rounded-lg border border-cream-300 shadow-sm">
                            <button 
                              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-golden hover:bg-golden/10 rounded-l-lg transition-colors" 
                              onClick={() => handleQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[3rem] text-center font-bold text-gray-900 px-2">{item.quantity}</span>
                            <button 
                              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-golden hover:bg-golden/10 rounded-r-lg transition-colors" 
                              onClick={() => handleQuantity(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button 
                            className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors group" 
                            onClick={() => handleRemove(item.id)}
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t border-cream-200 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Item subtotal:</span>
                        <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Order Summary Card */}
                <div className="bg-gradient-to-br from-white to-cream-50 rounded-2xl shadow-xl p-6 border border-cream-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    📊 Order Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span className="font-semibold">₹{total.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Shipping
                      </span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    
                    {total >= 1000 ? (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-green-800 text-sm font-medium flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          You’ve qualified for free shipping!
                        </p>
                      </div>
                    ) : (
                      <div className="bg-golden/10 p-3 rounded-lg border border-golden/30">
                        <p className="text-golden text-sm font-medium">
                          Add ₹{(1000 - total).toFixed(2)} more for free shipping!
                        </p>
                        <div className="mt-2 bg-golden/20 rounded-full h-2">
                          <div 
                            className="bg-golden h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min((total / 1000) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-cream-300 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-golden">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link 
                    href={session ? '/checkout' : '/auth/signin'}
                    className="w-full mt-6 bg-gradient-to-r from-golden to-golden-dark hover:from-golden-dark hover:to-golden text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {session ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                  </Link>
                  
                  {/* Security Badge */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
                
                {/* Continue Shopping Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-cream-200">
                  <h4 className="font-semibold text-gray-900 mb-3">🌟 Keep Shopping</h4>
                  <p className="text-gray-600 text-sm mb-4">Discover more handcrafted treasures!</p>
                  <Link 
                    href="/products" 
                    className="w-full bg-cream-100 hover:bg-cream-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Browse More Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
