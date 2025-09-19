import Link from 'next/link'
import { Heart, Star, ShoppingBag } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-white via-cream-50 to-warm-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern-crochet.svg')] bg-repeat"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white backdrop-blur-sm border border-cream-300 rounded-full px-4 py-2 text-sm text-gray-800 font-medium shadow-sm">
              <Heart className="h-4 w-4 text-accent" />
              <span>Handmade with Love</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Beautiful
                <span className="block text-accent">Crochet Creations</span>
                <span className="block">for Every Home</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-800 max-w-2xl leading-relaxed font-medium">
                Discover our collection of handmade crochet items, from cozy blankets and stylish accessories to adorable amigurumi. Each piece is crafted with care and attention to detail.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start space-x-8 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">500+</div>
                <div className="text-sm text-gray-800 font-semibold">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">50+</div>
                <div className="text-sm text-gray-800 font-semibold">Unique Designs</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-3xl font-bold text-accent">4.9</span>
                  <Star className="h-5 w-5 text-accent fill-current" />
                </div>
                <div className="text-sm text-gray-800 font-semibold">Average Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="btn btn-primary text-lg px-8 py-4 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Link>
              <Link
                href="/about"
                className="btn btn-secondary text-lg px-8 py-4 hover:shadow-lg transition-all duration-200"
              >
                Learn More
              </Link>
            </div>

            {/* Special Offer */}
            <div className="bg-white/90 border border-accent/30 rounded-2xl p-6 max-w-md mx-auto lg:mx-0 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-accent/10 rounded-full p-2 flex-shrink-0">
                  <Heart className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Free Shipping</h3>
                  <p className="text-sm text-gray-800">
                    On orders above ₹1,000. Limited time offer!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Gallery */}
          <div className="relative lg:h-[600px] slide-in">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Large Image */}
              <div className="col-span-2 relative">
                <div className="card overflow-hidden h-80 bg-gradient-to-br from-cream-100 to-cream-200">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-6xl mb-4">🧶</div>
                      <p className="text-sm">Featured Crochet Item</p>
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-cream-300 rounded-full px-3 py-1 text-xs font-medium text-accent">
                  New Arrival
                </div>
              </div>

              {/* Small Images */}
              <div className="card overflow-hidden h-36 bg-gradient-to-br from-warm-50 to-warm-100">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-3xl mb-2">🏠</div>
                    <p className="text-xs">Home Decor</p>
                  </div>
                </div>
              </div>
              
              <div className="card overflow-hidden h-36 bg-gradient-to-br from-accent-light to-cream-100">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-3xl mb-2">👶</div>
                    <p className="text-xs">Baby Items</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -bottom-4 -right-4 bg-accent/10 backdrop-blur-sm rounded-full p-3 border border-accent/20">
              <Star className="h-5 w-5 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-20 fill-white"
        >
          <path d="M0,80L48,85.3C96,91,192,101,288,90.7C384,80,480,48,576,42.7C672,37,768,59,864,69.3C960,80,1056,80,1152,74.7C1248,69,1344,59,1392,53.3L1440,48L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  )
}