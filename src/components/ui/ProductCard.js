'use client';

import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import CrochetImage from '@/components/ui/CrochetImage';

export default function ProductCard({ product, variant = 'default' }) {
  // Determine image source
  const getImageSrc = () => {
    if (!product.images || product.images.length === 0) return null;
    return typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url;
  };

  // Determine placeholder type based on product category/material
  const getPlaceholderType = () => {
    const name = product.name?.toLowerCase() || '';
    const material = product.material?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    
    if (name.includes('baby') || name.includes('infant') || description.includes('baby')) {
      return 'baby';
    }
    if (name.includes('pillow') || name.includes('cushion') || name.includes('home') || description.includes('home')) {
      return 'home';
    }
    if (name.includes('toy') || name.includes('amigurumi') || name.includes('doll') || description.includes('toy')) {
      return 'amigurumi';
    }
    if (name.includes('bag') || name.includes('hat') || name.includes('scarf') || description.includes('accessory')) {
      return 'accessories';
    }
    if (name.includes('blanket') || name.includes('throw') || description.includes('blanket')) {
      return 'blanket';
    }
    return 'default';
  };

  // Get badge text
  const getBadge = () => {
    if (product.createdAt) {
      const createdDate = new Date(product.createdAt);
      const daysDiff = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 7) return '✨ New';
    }
    if (product.stock <= 5 && product.stock > 0) return '🔥 Limited';
    if (product.averageRating >= 4.5) return '⭐ Popular';
    return null;
  };

  // Truncate description
  const getDescription = () => {
    if (!product.description) return 'Beautiful handmade crochet item';
    return product.description.length > 80 
      ? `${product.description.substring(0, 80)}...`
      : product.description;
  };

  const cardVariants = {
    default: 'card group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1',
    compact: 'card group cursor-pointer hover:shadow-lg transition-all duration-200',
    featured: 'card group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-golden/20'
  };

  return (
    <div className={cardVariants[variant]}>
      <div className="relative overflow-hidden rounded-t-lg">
        {/* Product Image with Beautiful Placeholder */}
        <div className="aspect-square relative overflow-hidden">
          <CrochetImage
            src={getImageSrc()}
            alt={product.name || 'Beautiful handmade crochet item'}
            width={400}
            height={400}
            className="h-full w-full"
            placeholderType={getPlaceholderType()}
            badge={getBadge()}
          />
          
          {/* Action buttons overlay */}
          <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button className="bg-white/95 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl group/btn">
              <Heart className="h-4 w-4 text-gray-600 group-hover/btn:text-red-500 transition-colors" />
            </button>
            <Link
              href={`/products/${product.id}`}
              className="bg-golden text-white p-2.5 rounded-full hover:bg-golden-dark transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <ShoppingCart className="h-4 w-4" />
            </Link>
          </div>

          {/* Stock indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              Only {product.stock} left!
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold">
                Out of Stock
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3 bg-white">
          {/* Product Name & Description */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-golden transition-colors">
              {product.name || 'Beautiful Crochet Item'}
            </h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">
              {getDescription()}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.averageRating || 0)
                      ? 'text-golden fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>

          {/* Material and Details */}
          {(product.material || product.color) && (
            <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              {product.material && (
                <span className="font-medium">
                  🧶 {product.material}
                </span>
              )}
              {product.color && (
                <span className="font-medium">
                  🎨 {product.color}
                </span>
              )}
            </div>
          )}

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-golden">
                ₹{product.price || '0'}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <Link
              href={`/products/${product.id}`}
              className="bg-gradient-to-r from-golden to-orange-400 hover:from-golden-dark hover:to-orange-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}