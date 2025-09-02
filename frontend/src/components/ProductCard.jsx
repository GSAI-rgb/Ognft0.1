import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import LazyImage from './PerformanceOptimized/LazyImage';
import { useTheme } from '../hooks/useTheme';

const ProductCard = ({ product, className = "", priority = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { isReducedMotion } = useTheme();

  const handleMouseEnter = () => {
    if (product.images.length > 1 && !isReducedMotion) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    if (!isReducedMotion) {
      setCurrentImageIndex(0);
    }
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={`group cursor-pointer will-change-transform ${className}`} onClick={handleClick}>
      {/* Product Image */}
      <div 
        className="relative mb-4 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-[4/5] bg-gray-900 overflow-hidden">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isReducedMotion ? '' : 'group-hover:scale-105'
            }`}
            loading={priority ? 'eager' : 'lazy'}
          />
        </div>
        
        {/* OG Theme Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {product.badges.map((badge, index) => {
            // Transform badge labels to OG theme
            let displayBadge = badge;
            let badgeClass = '';
            
            if (badge === 'NEW') {
              displayBadge = 'REBEL DROP';
              badgeClass = 'bg-[var(--color-red)] text-white shadow-[0_0_10px_rgba(193,18,31,0.5)]';
            } else if (badge === 'BEST SELLER') {
              displayBadge = 'FAN ARSENAL';
              badgeClass = 'bg-[var(--color-red)] text-white border border-[var(--color-gold)] shadow-[0_0_10px_rgba(201,151,0,0.3)]';
            } else if (badge === 'SALE') {
              displayBadge = 'BLOOD PRICE';
              badgeClass = 'bg-[var(--color-gold)] text-black shadow-[0_0_10px_rgba(201,151,0,0.5)]';
            } else {
              badgeClass = 'bg-[var(--color-steel)] text-white';
            }
            
            return (
              <span
                key={index}
                className={`px-3 py-1 text-xs font-bold tracking-wider uppercase ${badgeClass}`}
              >
                {displayBadge}
              </span>
            );
          })}
        </div>

        {/* Arrow Icon on Hover */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white text-black p-2 rounded-full">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="text-white">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="text-lg font-medium mb-2 group-hover:text-gray-300 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;