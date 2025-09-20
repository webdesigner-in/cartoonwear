"use client";
import { useState, useEffect } from 'react';
import { Mail, Loader2, Shield, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      // Replace with your API endpoint for password reset
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('If your email exists, a reset link has been sent to your inbox.');
        setEmail('');
      } else {
        setError(data.error || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-golden/20 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-200/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-golden/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-orange-300/10 rounded-full blur-xl animate-float delay-700"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Header Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-golden via-orange-300 to-amber-300"></div>
          
          {/* Logo Section */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-golden to-orange-400 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-golden to-orange-500 bg-clip-text text-transparent mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">
              Enter your email address and we'll send you a secure link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-golden h-5 w-5 group-focus-within:scale-110 transition-transform" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-golden focus:bg-white transition-all duration-300 placeholder-gray-400 font-medium"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm text-green-700 font-medium">{message}</p>
                </div>
              </div>
            )}

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-golden to-orange-400 hover:from-golden-dark hover:to-orange-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-3">
            <div className="text-gray-600">
              Remember your password?
              <Link 
                href="/auth/signin" 
                className="ml-1 font-semibold text-golden hover:text-golden-dark transition-colors"
              >
                Sign in here
              </Link>
            </div>
            <div className="text-gray-600">
              Don't have an account?
              <Link 
                href="/auth/signup" 
                className="ml-1 font-semibold text-golden hover:text-golden-dark transition-colors"
              >
                Sign up here
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or{' '}
            <button 
              onClick={() => window.location.reload()} 
              className="text-golden hover:underline font-medium transition-colors"
            >
              try again
            </button>
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
