import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Lock, Clock, Star, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { formatPrice } from '../lib/price';
import OptimizedImage from './OptimizedImage';
import WaitlistModal from './WaitlistModal';

const ProductCard = ({ product, className = "", priority = false, showCountdown = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const navigate = useNavigate();
  const { isReducedMotion } = useTheme();

  // Check if product is locked/exclusive
  const isLocked = product.badges?.includes('PREDATOR DROP') || product.badges?.includes('VAULT');
  const isOutOfStock = false; // You can implement stock checking
  const isExclusive = product.badges?.includes('LIMITED') || product.badges?.includes('EXCLUSIVE');

  const totalStock = typeof product.stock === 'object' 
    ? Object.values(product.stock || {}).reduce((sum, qty) => sum + (qty || 0), 0)
    : product.stock || 0;
  
  const isLowStock = totalStock <= 12;

  // Get display image - prioritize hover image on hover, otherwise use featured_image or first image
  const getDisplayImage = () => {
    if (isHovered && product.images && product.images.length > 1) {
      return product.images[1]; // Show second image on hover
    }
    return product.featured_image || product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image';
  };

  // Handle click - navigate to product page using simple ID
  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (isOutOfStock) {
      setWaitlistOpen(true);
    } else {
      // Use product ID for navigation
      navigate(`/product/${product.id}`);
    }
  }, [navigate, product.id, isOutOfStock]);

  // Countdown timer for exclusive drops
  const getCountdownDisplay = () => {
    if (!showCountdown || !product.drop_end) return null;
    
    const endTime = new Date(product.drop_end);
    const now = new Date();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return "DROPPED";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}D ${hours}H`;
  };

  return (
    <div 
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
      onClick={handleClick}
      onMouseEnter={() => !isReducedMotion && setIsHovered(true)}
      onMouseLeave={() => !isReducedMotion && setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="aspect-[4/5] overflow-hidden bg-gray-900 mb-4 relative">
        <OptimizedImage
          src={getDisplayImage()}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          priority={priority}
        />
        
        {/* Lock Overlay for Exclusive Products */}
        {isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-center">
              <Lock size={32} className="text-[var(--color-gold)] mx-auto mb-2" />
              <p className="text-[var(--color-gold)] font-bold text-sm">
                PSPK ELITE ACCESS
              </p>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badges?.slice(0, 2).map((badge, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs font-black tracking-wider uppercase ${
                badge === 'UNDER ₹999' 
                  ? 'bg-green-600 text-white'
                  : badge === 'MULTI-COLOR'
                  ? 'bg-purple-600 text-white'
                  : badge === 'PREMIUM' || badge === 'VAULT'
                  ? 'bg-[var(--color-gold)] text-black'
                  : badge === 'PREDATOR DROP'
                  ? 'bg-red-900 text-[var(--color-gold)]'
                  : 'bg-[var(--color-red)] text-white'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Countdown Timer for Exclusive Drops */}
        {showCountdown && getCountdownDisplay() && (
          <div className="absolute top-4 right-4 bg-[var(--color-red)] text-white px-3 py-1 text-xs font-bold flex items-center gap-1">
            <Clock size={12} />
            {getCountdownDisplay()}
          </div>
        )}

        {/* Color Swatches for Multi-Color Products */}
        {product.colors && product.colors.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border border-white/50 ${
                  color.toLowerCase() === 'black' ? 'bg-black' :
                  color.toLowerCase() === 'white' ? 'bg-white' :
                  color.toLowerCase() === 'blue' ? 'bg-blue-600' :
                  color.toLowerCase() === 'red' ? 'bg-red-600' :
                  color.toLowerCase() === 'green' ? 'bg-green-600' :
                  color.toLowerCase() === 'grey' || color.toLowerCase() === 'gray' ? 'bg-gray-500' :
                  color.toLowerCase() === 'navy' ? 'bg-blue-900' :
                  color.toLowerCase() === 'purple' ? 'bg-purple-600' :
                  color.toLowerCase() === 'brown' ? 'bg-amber-800' :
                  'bg-gray-400'
                }`}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <div className="w-3 h-3 rounded-full border border-white/50 bg-gray-700 flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">+{product.colors.length - 4}</span>
              </div>
            )}
          </div>
        )}

        {/* PSPK Fan Exclusive Badge */}
        {isExclusive && (
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[var(--color-red)] to-[var(--color-gold)] text-white px-2 py-1 text-xs font-bold flex items-center gap-1">
            <Star size={10} fill="currentColor" />
            PSPK
          </div>
        )}

        {/* Quick Action Button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-red)] text-white px-4 py-2 rounded-sm font-bold text-sm flex items-center gap-2">
            {isLocked ? <Lock size={14} /> : <ArrowUpRight size={14} />}
            {isLocked ? 'UNLOCK' : 'VIEW'}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-[var(--color-red)] transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
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
          
          {/* PSPK Rating Stars */}
          {isExclusive && (
            <div className="flex text-[var(--color-gold)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
          )}
        </div>
        
        {/* Stock indicator */}
        {isLowStock && !isOutOfStock && (
          <p className="text-xs text-[var(--color-gold)] font-medium flex items-center gap-1">
            <Zap size={10} />
            Only {totalStock} left - Popular with PSPK fans!
          </p>
        )}
        
        {isOutOfStock && (
          <p className="text-xs text-red-400 font-medium">
            Out of Stock - Join Waitlist
          </p>
        )}
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        productName={product.name}
      />
    </div>
  );
};

export default memo(ProductCard);