import HeroSection from '@/components/HeroSection'
import FeaturedProducts from '@/components/FeaturedProducts'
import AboutSection from '@/components/AboutSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-cream-50">
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
    </div>
  );
}
