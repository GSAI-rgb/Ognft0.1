import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

const ArsenalCategories = () => {
  const { t } = useI18n();

  // Weapon rails - OG themed categories
  const arsenalCategories = [
    {
      name: "Hoodies",
      weaponType: "SHIELDS",
      image: "https://framerusercontent.com/images/xloOTP7Fud71cpPDcKyE3yzb8MI.png",
      description: "Armor for the cold battles"
    },
    {
      name: "Tees", 
      weaponType: "DECLARATIONS",
      image: "https://framerusercontent.com/images/ppyeHGRd7XFQvhAX6jV2ZLwatI.png",
      description: "War cries worn on the chest"
    },
    {
      name: "Chains",
      weaponType: "RANKS",
      image: "https://framerusercontent.com/images/F4vmhR5vRnh3IP2YlzKDJ1YXY.png", 
      description: "Marks of the tribe elite"
    },
    {
      name: "Accessories",
      weaponType: "TOOLS",
      image: "https://framerusercontent.com/images/v14DO0SPxGXBia6SbmVmgtFHE.png",
      description: "Complete your arsenal"
    }
  ];

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Categories Grid - Same layout as AXM Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {arsenalCategories.map((category, index) => (
            <Link
              key={index}
              to={`/shop/category/${category.name.toLowerCase()}`}
              className="relative group cursor-pointer"
            >
              <div className="relative aspect-[4/5] bg-[var(--color-steel)] overflow-hidden border border-[var(--color-steel)] hover:border-[var(--color-red)] transition-colors">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                
                {/* Overlay with red glow effect */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300" />
                
                {/* Blood red stencil overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-red)] via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  {/* Weapon Type Badge */}
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-[var(--color-red)] text-white text-xs font-bold uppercase tracking-wider">
                      {category.weaponType}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold font-headline uppercase tracking-wider mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-[var(--color-text)] hover:text-[var(--color-gold)] transition-colors group-hover:text-[var(--color-gold)]">
                    <span className="text-sm uppercase tracking-wider font-medium">Equip Now</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArsenalCategories;