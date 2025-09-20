"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  // Always fetch cart count from database
  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) return setCartCount(0);
      const data = await res.json();
      setCartCount(data.cart.reduce((sum, item) => sum + item.quantity, 0));
    } catch {
      setCartCount(0);
    }
  };

  // Fetch cart count on mount
  useEffect(() => {
    fetchCartCount();
  }, []);

  // Expose fetchCartCount for updates
  return (
    <CartContext.Provider value={{ cartCount, updateCartCount: fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
