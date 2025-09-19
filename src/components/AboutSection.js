import { Heart, Award, Truck } from 'lucide-react'

export default function AboutSection() {
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
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Quick and secure delivery to your doorstep. Free shipping on orders above ₹1,000.'
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-cream-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Crochet Items?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Experience the warmth and comfort of handmade crochet items that bring joy to your everyday life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
    </section>
  )
}