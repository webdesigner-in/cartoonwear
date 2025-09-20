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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            ✨ Why Choose Our Crochet Items?
          </h2>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto font-semibold leading-relaxed">
            Experience the warmth and comfort of handmade crochet items that bring joy to your everyday life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-warm-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-warm-50 group-hover:border-2 group-hover:border-golden transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <feature.icon className="h-10 w-10 text-golden" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-lg text-gray-700 font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}