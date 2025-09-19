import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Heart, Award, Users, Clock } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-300 mb-6">
             <span className="text-accent">About The Kroshet Nani</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Welcome to our world of handmade crochet artistry, where every stitch tells a story of passion, 
            creativity, and dedication to the timeless craft of crochet.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-300">Our Story</h2>
            <p className="text-gray-300 leading-relaxed font-medium">
              The Kroshet Nani began as a small passion project in a cozy corner of our home. What started 
              as a hobby of creating beautiful crochet items for family and friends has blossomed into a 
              thriving business dedicated to bringing handmade warmth to homes across India.
            </p>
            <p className="text-gray-300 leading-relaxed font-medium">
              Every piece we create is infused with love, care, and attention to detail. We believe that 
              handmade items carry a special energy and warmth that mass-produced goods simply cannot match. 
              Our mission is to preserve and celebrate the traditional art of crochet while making it 
              accessible and relevant for modern homes.
            </p>
            <p className="text-gray-300 leading-relaxed font-medium">
              From delicate baby blankets that welcome new life to cozy home décor items that transform 
              living spaces, each creation represents hours of careful craftsmanship and genuine care for 
              our customers' happiness.
            </p>
          </div>
          
          <div className="relative">
            <div className="card overflow-hidden h-96 bg-gradient-to-br from-cream-100 to-cream-200">
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-8xl mb-4">🧶</div>
                  <p className="text-sm">Crafting with Love</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-accent/10 backdrop-blur-sm rounded-full p-3 border border-accent/20">
              <Award className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-300 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Handmade with Love</h3>
              <p className="text-gray-300 text-sm font-medium">
                Every stitch is placed with care and attention, ensuring each piece carries the warmth of human touch.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Premium Quality</h3>
              <p className="text-gray-300 text-sm font-medium">
                We use only the finest materials and maintain strict quality standards in every creation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Customer First</h3>
              <p className="text-gray-300 text-sm font-medium">
                Your satisfaction is our priority. We work closely with customers to create pieces that bring joy.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Timeless Craft</h3>
              <p className="text-gray-300 text-sm font-medium">
                We honor traditional crochet techniques while adapting to contemporary styles and needs.
              </p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-gradient-to-br from-cream-50 to-warm-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-cream-300">
                <span className="text-2xl font-bold text-accent">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design & Planning</h3>
              <p className="text-gray-900 text-sm font-medium">
                Each piece starts with careful planning, selecting patterns, colors, and materials that will create the perfect finished product.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-cream-300">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Handcrafting</h3>
              <p className="text-gray-900 text-sm font-medium">
                Our skilled artisans carefully crochet each piece by hand, taking time to ensure every stitch is perfect and the quality meets our standards.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-cream-300">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Check & Delivery</h3>
              <p className="text-gray-900 text-sm font-medium">
                Before shipping, each item undergoes thorough quality checks and is carefully packaged to reach you in perfect condition.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-300 mb-4">Ready to Bring Handmade Warmth to Your Home?</h2>
          <p className="text-gray-300 mb-6 font-medium">
            Explore our collection or get in touch to discuss custom orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="btn btn-primary text-lg px-8 py-3"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="btn btn-secondary text-lg px-8 py-3"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}