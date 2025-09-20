"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Menu, X, UserCircle, Package, Settings, LogOut } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, isLoading, signOut } = useAuth();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream-50 border-b-2 border-cream-300 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-golden transition-colors">
              🧶 The Kroshet Nani
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-900 hover:text-golden px-3 py-2 rounded-md text-sm font-semibold transition-colors hover:bg-warm-50"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/cart"
              className="p-2 text-gray-900 hover:text-golden transition-colors relative hover:bg-warm-50 rounded-lg"
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-golden text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </Link>

            {isLoading ? (
              <div className="spinner"></div>
            ) : user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-900 hover:text-golden transition-colors px-3 py-2 rounded-lg hover:bg-warm-50">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-semibold">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border-2 border-cream-300 py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-warm-100 hover:text-golden transition-colors rounded-md mx-2">
                    <UserCircle className="h-4 w-4 text-golden" />
                    Profile
                  </Link>
                  <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-warm-100 hover:text-golden transition-colors rounded-md mx-2">
                    <Package className="h-4 w-4 text-golden" />
                    My Orders
                  </Link>
                  {['ADMIN', 'SUPER_ADMIN'].includes(user.role) && (
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-warm-100 hover:text-golden transition-colors rounded-md mx-2">
                      <Settings className="h-4 w-4 text-golden" />
                      Admin Dashboard
                    </Link>
                  )}
                  <hr className="my-2 border-cream-200 mx-2" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-md mx-2"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/auth/signin" className="text-gray-900 hover:text-golden px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-warm-50">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-golden hover:bg-golden-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/cart"
              className="p-2 text-gray-900 hover:text-golden transition-colors relative hover:bg-warm-50 rounded-lg"
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-golden text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-900 hover:text-golden transition-colors hover:bg-warm-50 rounded-lg"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-cream-50 border-t-2 border-cream-300">
            <div className="px-4 pt-4 pb-3 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-900 hover:text-golden block px-4 py-3 rounded-lg text-base font-semibold transition-colors hover:bg-warm-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-cream-300">
                {isLoading ? (
                  <div className="spinner"></div>
                ) : user ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-gray-900 font-medium">{user.name}</div>
                    <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-gray-900 hover:text-golden hover:bg-warm-100 rounded-md text-base font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                      <UserCircle className="h-4 w-4 text-golden" />
                      Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 px-3 py-2 text-gray-900 hover:text-golden hover:bg-warm-100 rounded-md text-base font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                      <Package className="h-4 w-4 text-golden" />
                      My Orders
                    </Link>
                    {['ADMIN', 'SUPER_ADMIN'].includes(user.role) && (
                      <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-900 hover:text-golden hover:bg-warm-100 rounded-md text-base font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <Settings className="h-4 w-4 text-golden" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md text-base font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link href="/auth/signin" className="block px-3 py-2 text-gray-900 hover:text-golden rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="block px-3 py-2 bg-golden text-white rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}