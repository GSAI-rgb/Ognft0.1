import React from 'react';
import ProductCard from './ProductCard';

const Rail = ({ title, products, showViewAll = false, viewAllLink = "" }) => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Rail Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-wider font-headline mb-4">
              {title}
            </h2>
            <div className="w-20 h-1 bg-[var(--color-red)]"></div>
          </div>
          {showViewAll && (
            <a 
              href={viewAllLink}
              className="group flex items-center gap-2 text-[var(--color-gold)] hover:text-white transition-colors"
            >
              <span className="text-lg font-bold uppercase tracking-wider">View All</span>
              <div className="w-8 h-8 border-2 border-[var(--color-gold)] group-hover:border-white rounded-full flex items-center justify-center transition-colors">
                <span className="text-sm">→</span>
              </div>
            </a>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              priority={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rail;