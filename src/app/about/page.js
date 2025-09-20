import { Heart, Award, Users, Clock } from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: Heart,
      title: 'Handmade with Love',
      description: 'Every item is carefully crafted by hand with attention to detail and passion for the craft.'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We use only the finest materials to ensure your crochet items last for years to come.'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Supporting local artisans and building a community of crochet enthusiasts.'
    },
    {
      icon: Clock,
      title: 'Timeless Designs',
      description: 'Classic patterns that never go out of style, perfect for any home or occasion.'
    }
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About The Kroshet Nani
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We are passionate about creating beautiful, handmade crochet items that bring warmth, 
            comfort, and joy to your everyday life. Each piece tells a story of craftsmanship, 
            creativity, and love.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The Kroshet Nani began as a small passion project, born from a love of traditional 
                crochet techniques passed down through generations. What started as creating items 
                for family and friends has grown into a dedicated business focused on bringing 
                handmade beauty to homes everywhere.
              </p>
              <p>
                Our name "Kroshet Nani" pays homage to the grandmothers and mothers who taught us 
                these timeless skills. We believe in preserving these traditional crafts while 
                adapting them for modern lifestyles.
              </p>
              <p>
                Every item in our collection is carefully selected or custom-made to ensure the 
                highest quality and attention to detail. We work directly with skilled artisans 
                who share our passion for creating beautiful, functional pieces.
              </p>
            </div>
          </div>
          <div className="aspect-square bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-8xl mb-4">🧶</div>
              <p className="text-lg font-medium">Handmade with Love</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Our Crochet Items?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-lg shadow-sm border border-cream-300 p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-700">
                We never compromise on quality. Every item undergoes careful inspection 
                to ensure it meets our high standards.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-700">
                We use eco-friendly materials and sustainable practices to minimize 
                our environmental impact.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Care</h3>
              <p className="text-gray-700">
                Your satisfaction is our priority. We provide excellent customer service 
                and support throughout your journey with us.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-accent/10 to-cream-100 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience Handmade Beauty?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Explore our collection and discover the perfect crochet items for your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/products" className="btn btn-primary text-lg px-8 py-3">
              Shop Now
            </a>
            <a href="/contact" className="btn btn-secondary text-lg px-8 py-3">
              Contact Us
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}