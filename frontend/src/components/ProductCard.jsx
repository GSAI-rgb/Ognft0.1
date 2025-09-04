import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { formatPrice } from '../lib/price';
import OptimizedImage from './OptimizedImage';
import WaitlistModal from './WaitlistModal';

const ProductCard = ({ product, className = "", priority = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const navigate = useNavigate();
  const { isReducedMotion } = useTheme();

  // Mock check for out of stock (in real app, this would come from product data)
  const isOutOfStock = false; // Set to true to test waitlist functionality

  const totalStock = typeof product.stock === 'object' 
    ? Object.values(product.stock || {}).reduce((sum, qty) => sum + (qty || 0), 0)
    : product.stock || 0;
  
  const isLowStock = totalStock <= 12;

  const handleMouseEnter = useCallback(() => {
    if (product.images && product.images.length > 1 && !isReducedMotion) {
      const nextIndex = product.category === 'Teeshirt' ? 1 : (currentImageIndex + 1) % product.images.length;
      setCurrentImageIndex(nextIndex);
    }
  }, [product.images, product.category, isReducedMotion, currentImageIndex]);

  const handleMouseLeave = useCallback(() => {
    if (!isReducedMotion) {
      setCurrentImageIndex(0);
    }
  }, [isReducedMotion]);

  const handleClick = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  return (
    <div className={`group cursor-pointer will-change-transform ${className}`} onClick={handleClick}>
      {/* Product Image */}
      <div 
        className="relative mb-4 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-[4/5] bg-gray-900 overflow-hidden">
          <OptimizedImage
            src={product.images[currentImageIndex]}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isReducedMotion ? '' : 'group-hover:scale-105'
            }`}
            loading={priority ? 'eager' : 'lazy'}
          />
        </div>
        
        {/* OG Theme Badges - Smaller and better positioned */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[70%]">
          {product.badges.slice(0, 2).map((badge, index) => {
            // Transform badge labels to OG theme
            let displayBadge = badge;
            let badgeClass = '';
            
            if (badge === 'NEW') {
              displayBadge = 'REBEL';
              badgeClass = 'bg-[var(--color-red)] text-white shadow-[0_0_8px_rgba(193,18,31,0.6)]';
            } else if (badge === 'BEST SELLER') {
              displayBadge = 'ARSENAL';
              badgeClass = 'bg-[var(--color-red)] text-white border border-[var(--color-gold)] shadow-[0_0_8px_rgba(201,151,0,0.4)]';
            } else if (badge === 'SALE') {
              displayBadge = 'BLOOD';
              badgeClass = 'bg-[var(--color-gold)] text-black shadow-[0_0_8px_rgba(201,151,0,0.6)]';
            } else {
              badgeClass = 'bg-[var(--color-steel)] text-white';
            }
            
            return (
              <span
                key={index}
                className={`px-2 py-1 text-[10px] font-black tracking-wider uppercase ${badgeClass} backdrop-blur-sm`}
              >
                {displayBadge}
              </span>
            );
          })}
        </div>

        {/* Arrow Icon on Hover - OG Theme */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[var(--color-red)] text-white p-2 rounded-full shadow-[0_0_15px_rgba(193,18,31,0.6)]">
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

export default memo(ProductCard);