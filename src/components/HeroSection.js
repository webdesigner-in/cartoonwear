import Link from 'next/link'
import { Heart, Star, ShoppingBag } from 'lucide-react'
import CrochetImage from '@/components/ui/CrochetImage'

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream-50 via-warm-50 to-cream-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/crochet-pattern.svg')] bg-repeat"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-warm-100 border-2 border-golden rounded-full px-6 py-3 text-sm text-gray-900 font-bold shadow-md">
              <Heart className="h-5 w-5 text-golden" />
              <span>✨ Handmade with Love</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Beautiful
                <span className="block text-golden">Crochet Creations</span>
                <span className="block">for Every Home</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-700 max-w-2xl leading-relaxed font-semibold">
                Discover our collection of handmade crochet items, from cozy blankets and stylish accessories to adorable amigurumi. Each piece is crafted with care and attention to detail.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start space-x-8 py-6">
              <div className="text-center">
                <div className="text-4xl font-black text-golden">500+</div>
                <div className="text-sm text-gray-900 font-bold">💖 Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-golden">50+</div>
                <div className="text-sm text-gray-900 font-bold">🎨 Unique Designs</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-4xl font-black text-golden">4.9</span>
                  <Star className="h-6 w-6 text-golden fill-current" />
                </div>
                <div className="text-sm text-gray-900 font-bold">⭐ Average Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="bg-golden hover:bg-golden-dark text-white text-lg font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 justify-center"
              >
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Link>
              <Link
                href="/about"
                className="bg-white hover:bg-cream-100 text-gray-900 text-lg font-bold px-8 py-4 rounded-xl border-2 border-cream-300 hover:border-golden shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 justify-center"
              >
                📚 Learn More
              </Link>
            </div>

            {/* Special Offer */}
            <div className="bg-gradient-to-r from-warm-50 to-warm-100 border-2 border-golden rounded-2xl p-6 max-w-md mx-auto lg:mx-0 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-golden rounded-full p-3 flex-shrink-0">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 mb-2 text-lg">🚚 Free Shipping</h3>
                  <p className="text-base text-gray-800 font-semibold">
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
                <CrochetImage
                  src="/crochet-images/hero-main.jpg"
                  alt="Beautiful handmade crochet blanket with intricate patterns"
                  width={800}
                  height={320}
                  className="card overflow-hidden h-80"
                  placeholderType="featured"
                  badge="✨ New Arrival"
                  priority={true}
                />
              </div>

              {/* Small Images */}
              <CrochetImage
                src="/crochet-images/home-decor.jpg"
                alt="Cozy crochet pillows and home decorative items"
                width={400}
                height={144}
                className="card overflow-hidden h-36 border-2 border-golden"
                placeholderType="home"
              />
              
              <CrochetImage
                src="/crochet-images/baby-items.jpg"
                alt="Adorable crochet baby blankets and toys"
                width={400}
                height={144}
                className="card overflow-hidden h-36 border-2 border-golden"
                placeholderType="baby"
              />
            </div>

            {/* Floating elements */}
            <div className="absolute -bottom-4 -right-4 bg-golden rounded-full p-4 border-4 border-white shadow-xl">
              <Star className="h-6 w-6 text-white fill-current" />
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