"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/components/CartContext';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
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
          setCart(data.cart.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.images ? JSON.parse(item.product.images)[0] : '',
            quantity: item.quantity,
          })));
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
    <div className="min-h-screen bg-cream-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-12 flex items-center justify-center gap-3">
            <ShoppingCart className="h-8 w-8 text-golden" />Shopping Cart
          </h2>
          {loading ? (
            <div className="text-center py-12 text-gray-900 text-xl font-semibold">Loading cart...</div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
              <div className="text-8xl mb-6">🧒</div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h3>
              <p className="text-xl text-gray-600 mb-8 font-medium">Add some beautiful crochet items to your cart!</p>
              <Link href="/products" className="bg-golden hover:bg-golden-dark text-white text-xl font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">🛒 Shop Products</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg border border-cream-300 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  {/* Mobile Layout */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Product Image and Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-cream-300 shadow-sm flex-shrink-0" 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop';
                          e.target.onerror = null;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">{item.name}</h4>
                        <div className="text-golden font-bold text-lg">₹{item.price}</div>
                        <div className="text-sm text-gray-600 mt-1">Subtotal: ₹{item.price * item.quantity}</div>
                      </div>
                    </div>
                    
                    {/* Controls - Mobile: Full width row, Desktop: Side by side */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button 
                          className="w-8 h-8 flex items-center justify-center bg-cream-100 hover:bg-cream-200 text-gray-800 rounded-md font-semibold transition-colors border border-cream-300" 
                          onClick={() => handleQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-lg text-gray-900 min-w-[3rem] text-center px-3 py-1 bg-cream-50 rounded-md border border-cream-300">{item.quantity}</span>
                        <button 
                          className="w-8 h-8 flex items-center justify-center bg-cream-100 hover:bg-cream-200 text-gray-800 rounded-md font-semibold transition-colors border border-cream-300" 
                          onClick={() => handleQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-md transition-colors border border-red-200" 
                        onClick={() => handleRemove(item.id)}
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Total Section */}
              <div className="bg-white/80 backdrop-blur-sm border border-cream-300 rounded-xl shadow-lg p-6 mt-8">
                <div className="flex justify-between items-center">
                  <div className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    💰 Total Amount
                  </div>
                  <div className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</div>
                </div>
                <div className="mt-4 pt-4 border-t border-cream-300">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-8">
                <Link 
                  href={session ? '/checkout' : '/auth/signin'}
                  className="bg-golden hover:bg-golden-dark text-white text-xl font-bold px-12 py-5 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 inline-flex items-center gap-3"
                >
                  <PackageTruck className="w-6 h-6" color="white" />
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
