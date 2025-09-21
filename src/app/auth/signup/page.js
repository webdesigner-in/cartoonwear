"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Loader2, User, Mail, Lock, Eye, EyeOff, Sparkles, Heart, ShoppingBag, UserPlus, Shield, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Strong password validation
    const passwordErrors = [];
    if (password.length < 8) {
      passwordErrors.push('at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push('one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      passwordErrors.push('one special character (!@#$%^&*)');
    }

    if (passwordErrors.length > 0) {
      const errorMsg = `Password must contain ${passwordErrors.join(', ')}`;
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Account created! Redirecting to sign in...');
        toast.success('Account created! Redirecting to sign in...');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          window.location.href = '/auth/signin';
        }, 1200);
      } else {
        setError(data.error || 'Registration failed');
        toast.error(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
      toast.error('Registration failed');
    }
    setLoading(false);
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-warm-50">
        <Loader2 className="animate-spin h-10 w-10 text-accent" />
      </div>
    );
  }

  // Don't render the form if user is authenticated
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-golden/20 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-200/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-golden/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-orange-300/10 rounded-full blur-xl animate-float delay-700"></div>
      </div>
      
      <div className="w-full max-w-lg relative z-10">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Header Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-golden via-orange-300 to-amber-300"></div>
          
          {/* Logo Section */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-golden to-orange-400 rounded-2xl mb-4 shadow-lg">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-golden to-orange-500 bg-clip-text text-transparent mb-2">
              Join Our Community!
            </h1>
            <p className="text-gray-600 flex items-center justify-center gap-1">
              Create your account and start shopping <Heart className="w-4 h-4 text-red-400 animate-pulse" />
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="relative group">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-golden h-5 w-5 group-focus-within:scale-110 transition-transform" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-golden focus:bg-white transition-all duration-300 placeholder-gray-400 font-medium"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative group">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-golden h-5 w-5 group-focus-within:scale-110 transition-transform" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-golden focus:bg-white transition-all duration-300 placeholder-gray-400 font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-golden h-5 w-5 group-focus-within:scale-110 transition-transform" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-golden focus:bg-white transition-all duration-300 placeholder-gray-400 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-golden transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 space-y-1">
                <div>Password must contain:</div>
                <ul className="ml-2 space-y-0.5">
                  <li>• At least 8 characters</li>
                  <li>• One uppercase & lowercase letter</li>
                  <li>• One number & special character</li>
                </ul>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative group">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Confirm Password</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-golden h-5 w-5 group-focus-within:scale-110 transition-transform" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-golden focus:bg-white transition-all duration-300 placeholder-gray-400 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-golden transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm text-green-700 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-golden to-orange-400 hover:from-golden-dark hover:to-orange-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Creating Account...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Account Created!</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <div className="text-gray-600">
              Already have an account?
              <Link 
                href="/auth/signin" 
                className="ml-1 font-semibold text-golden hover:text-golden-dark transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-golden hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-golden hover:underline">
              Privacy Policy
            </Link>
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

export default SignUpPage;
