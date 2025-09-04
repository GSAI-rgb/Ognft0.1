import React from 'react';
import { X, Lock, Star, Shield } from 'lucide-react';

const VaultModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-[var(--color-gold)] rounded-lg max-w-md w-full mx-4 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Lock Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--color-gold)] to-yellow-600 rounded-full mb-4">
            <Lock size={32} className="text-black" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-[var(--color-gold)]">
            VAULT LOCKED
          </h2>
        </div>

        {/* Product Info */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-white mb-2">
            {product.name}
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            {product.description}
          </p>
          
          {/* Price */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-[var(--color-gold)]">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Unlock Requirement */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield size={16} className="text-[var(--color-red)]" />
              <span className="text-sm font-medium text-gray-300">
                UNLOCK REQUIREMENT
              </span>
            </div>
            <p className="text-[var(--color-red)] font-bold text-sm">
              {product.unlock_requirement}
            </p>
          </div>

          {/* Exclusive Features */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-center space-x-2 text-[var(--color-gold)]">
              <Star size={14} />
              <span className="text-xs uppercase tracking-wider">Ultra-Limited Edition</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-[var(--color-gold)]">
              <Star size={14} />
              <span className="text-xs uppercase tracking-wider">Exclusive OG Design</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-[var(--color-gold)]">
              <Star size={14} />
              <span className="text-xs uppercase tracking-wider">Vault Certificate Included</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            className="w-full bg-gradient-to-r from-[var(--color-gold)] to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-[var(--color-gold)] transition-all duration-300 uppercase tracking-wider"
            onClick={() => {
              // Handle unlock logic here
              alert('Unlock feature coming soon! Stay tuned, rebel.');
            }}
          >
            🔑 UNLOCK ACCESS
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors uppercase tracking-wider"
          >
            Back to Arsenal
          </button>
        </div>

        {/* Bottom Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Vault exclusives are earned, not bought. Prove your dedication to the OG legacy.
        </p>
      </div>
    </div>
  );
};

export default VaultModal;