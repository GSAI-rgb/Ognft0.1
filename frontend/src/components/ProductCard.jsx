import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const ProductCard = ({ product, className = "" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={`group cursor-pointer ${className}`} onClick={handleClick}>
      {/* Product Image */}
      <div 
        className="relative aspect-[4/5] bg-gray-900 overflow-hidden mb-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {product.badges.map((badge, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-xs font-semibold tracking-wider uppercase ${
                badge === 'NEW' ? 'bg-white text-black' :
                badge === 'BEST SELLER' ? 'bg-red-600 text-white' :
                badge === 'SALE' ? 'bg-green-600 text-white' :
                'bg-gray-800 text-white'
              }`}
            >
              {badge}
            </span>
          ))}
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