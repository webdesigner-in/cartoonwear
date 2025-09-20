'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, Sparkles } from 'lucide-react';

export default function CrochetImage({ 
  src, 
  alt, 
  width = 400, 
  height = 300, 
  className = '', 
  placeholderType = 'default',
  badge = null,
  priority = false 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const placeholderIcons = {
    default: '🧶',
    home: '🏠',
    baby: '👶',
    amigurumi: '🐻',
    accessories: '👜',
    blanket: '🛌',
    featured: '✨'
  };

  const placeholderTexts = {
    default: 'Beautiful Crochet',
    home: 'Home Decor',
    baby: 'Baby Items',
    amigurumi: 'Amigurumi',
    accessories: 'Accessories',
    blanket: 'Cozy Blankets',
    featured: 'Featured Item'
  };

  const PlaceholderContent = () => (
    <div className="relative h-full w-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col items-center justify-center p-6">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F59E0B' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='45' cy='15' r='2'/%3E%3Ccircle cx='15' cy='45' r='2'/%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Icon */}
      <div className="relative z-10 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-golden to-orange-400 rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <span className="text-2xl">{placeholderIcons[placeholderType]}</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Heart className="h-4 w-4 text-golden" />
          <Sparkles className="h-4 w-4 text-golden" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center relative z-10">
        <p className="font-semibold text-gray-700 text-sm mb-1">
          {placeholderTexts[placeholderType]}
        </p>
        <p className="text-xs text-gray-500">
          Handmade with Love
        </p>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-3 right-3 w-6 h-6 bg-golden/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-3 left-3 w-4 h-4 bg-orange-300/20 rounded-full animate-pulse delay-1000"></div>
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image */}
      {src && !imageError ? (
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            priority={priority}
          />
          {!imageLoaded && <PlaceholderContent />}
        </div>
      ) : (
        <PlaceholderContent />
      )}

      {/* Badge Overlay */}
      {badge && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-golden to-orange-400 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg z-10">
          {badge}
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm font-semibold drop-shadow-lg">
            {alt}
          </p>
        </div>
      </div>
    </div>
  );
}