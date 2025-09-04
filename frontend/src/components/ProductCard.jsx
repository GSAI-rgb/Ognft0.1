import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { formatPrice } from '../lib/price';
import OptimizedImage from './OptimizedImage';
import VaultModal from './VaultModal';

const ProductCard = ({ product, className = "", priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
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
    // Check if this is a vault product
    if (product.vault_locked) {
      setShowVaultModal(true);
      return;
    }
    navigate(`/product/${product.id}`);
  }, [navigate, product.id, product.vault_locked]);

  return (
    <>
      <div 
        className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${className} ${
          product.vault_locked ? 'relative overflow-hidden' : ''
        }`}
        onClick={handleClick}
        onMouseEnter={() => !isReducedMotion && setIsHovered(true)}
        onMouseLeave={() => !isReducedMotion && setIsHovered(false)}
      >
        {/* Product Image - Clean, no overlays */}
        <div className="aspect-[4/5] overflow-hidden bg-gray-900 mb-4 relative">
          <OptimizedImage
            src={getDisplayImage()}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              product.vault_locked ? 'filter brightness-75 grayscale-[30%]' : ''
            }`}
            priority={priority}
          />
          
          {/* Vault Lock Overlay */}
          {product.vault_locked && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-[var(--color-gold)] text-4xl">🔒</div>
            </div>
          )}
          
          {/* Essential badges - shorter versions */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badges?.includes('VAULT') && (
              <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-[var(--color-gold)] to-yellow-600 text-black">
                VAULT
              </span>
            )}
            {product.badges?.includes('LIMITED') && (
              <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-[var(--color-red)] text-white">
                LIMITED
              </span>
            )}
            {product.badges?.includes('REBEL DROP') && (
              <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-black text-[var(--color-red)] border border-[var(--color-red)]">
                REBEL
              </span>
            )}
            {product.badges?.includes('PREMIUM') && (
              <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gray-800 text-[var(--color-gold)]">
                PREMIUM
              </span>
            )}
            {product.price && product.price < 999 && (
              <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-green-700 text-white">
                &lt;₹999
              </span>
            )}
          </div>

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
          <h3 className={`text-sm font-medium line-clamp-2 group-hover:text-[var(--color-red)] transition-colors ${
            product.vault_locked ? 'text-[var(--color-gold)]' : ''
          }`}>
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-semibold ${
              product.vault_locked ? 'text-[var(--color-gold)]' : ''
            }`}>
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

      {/* Vault Modal */}
      <VaultModal 
        isOpen={showVaultModal}
        onClose={() => setShowVaultModal(false)}
        product={product}
      />
    </>
  );
};

export default memo(ProductCard);