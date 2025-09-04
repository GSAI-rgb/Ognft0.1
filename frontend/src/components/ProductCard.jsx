import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { formatPrice } from '../lib/price';
import OptimizedImage from './OptimizedImage';

const ProductCard = ({ product, className = "", priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { isReducedMotion } = useTheme();

  // Get display image - back by default, front on hover
  const getDisplayImage = () => {
    // For products with multiple images: first image = back (default), second image = front (hover)
    if (product.images && product.images.length > 1) {
      if (isHovered) {
        return product.images[1]; // Front image on hover
      }
      return product.images[0]; // Back image as default
    }
    
    // For single image products
    return product.featured_image || product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image';
  };

  const handleClick = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  return (
    <div 
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
      onClick={handleClick}
      onMouseEnter={() => !isReducedMotion && setIsHovered(true)}
      onMouseLeave={() => !isReducedMotion && setIsHovered(false)}
    >
      {/* Product Image - Clean, no overlays */}
      <div className="aspect-[4/5] overflow-hidden bg-gray-900 mb-4 relative">
        <OptimizedImage
          src={getDisplayImage()}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500"
          priority={priority}
        />
        
        {/* Only essential badges */}
        {product.badges?.includes('LIMITED') && (
          <div className="absolute top-4 left-4">
            <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-[var(--color-red)] text-white">
              LIMITED
            </span>
          </div>
        )}

        {/* Color swatches for multi-color products */}
        {product.colors && product.colors.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-1">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border border-white/50 ${
                  color.toLowerCase() === 'black' ? 'bg-black' :
                  color.toLowerCase() === 'white' ? 'bg-white' :
                  color.toLowerCase() === 'blue' ? 'bg-blue-600' :
                  color.toLowerCase() === 'red' ? 'bg-red-600' :
                  color.toLowerCase() === 'grey' || color.toLowerCase() === 'gray' ? 'bg-gray-500' :
                  'bg-gray-400'
                }`}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info - Clean */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-[var(--color-red)] transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);