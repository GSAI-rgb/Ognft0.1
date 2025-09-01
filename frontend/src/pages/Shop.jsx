import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { mockProducts } from '../data/mock';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);

  const filteredProducts = useMemo(() => {
    let products = mockProducts;

    // Filter by category
    if (category) {
      products = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by badges
    if (selectedBadges.length > 0) {
      products = products.filter(p => 
        p.badges.some(badge => selectedBadges.includes(badge))
      );
    }

    // Filter by price range
    products = products.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high':
        return products.sort((a, b) => b.price - a.price);
      case 'name':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return products.filter(p => p.badges.includes('NEW')).concat(
          products.filter(p => !p.badges.includes('NEW'))
        );
    }
  }, [category, sortBy, selectedBadges, priceRange]);

  const toggleBadge = (badge) => {
    setSelectedBadges(prev => 
      prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-4">
            {category ? category : 'All Products'}
          </h1>
          <p className="text-gray-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
          >
            <SlidersHorizontal size={20} />
            <span className="text-sm uppercase tracking-wider">Filters</span>
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black border border-gray-600 text-white px-4 py-2 text-sm focus:outline-none focus:border-white"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-900 p-6 mb-8 space-y-6">
            <h3 className="text-lg font-semibold">Filters</h3>
            
            {/* Badge Filters */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-gray-300">Collection</h4>
              <div className="flex flex-wrap gap-2">
                {['NEW', 'BEST SELLER', 'SALE'].map(badge => (
                  <button
                    key={badge}
                    onClick={() => toggleBadge(badge)}
                    className={`px-3 py-1 text-xs font-semibold tracking-wider uppercase border transition-colors ${
                      selectedBadges.includes(badge)
                        ? 'bg-white text-black border-white'
                        : 'border-gray-600 hover:border-white'
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-gray-300">Price Range</h4>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
                <span className="text-sm text-gray-400">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">No products found</h3>
            <p className="text-gray-400 mb-8">Try adjusting your filters or search criteria</p>
            <button
              onClick={() => {
                setSelectedBadges([]);
                setPriceRange([0, 500]);
              }}
              className="text-white hover:text-gray-300 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;