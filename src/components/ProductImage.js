"use client";

import { useState } from 'react';

export default function ProductImage({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
  showLoading = true 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (e) => {
    console.log('Image failed to load:', e.target.src);
    setIsLoading(false);
    if (!hasError) {
      setHasError(true);
      e.target.src = fallbackSrc;
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {isLoading && showLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Error state */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center text-gray-500">
          <div className="text-4xl mb-2">🧶</div>
          <p className="text-xs text-center px-2">Image unavailable</p>
        </div>
      )}
    </div>
  );
}