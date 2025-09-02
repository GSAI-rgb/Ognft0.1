import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../data/mock';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    // Set initial tab based on URL
    if (category) return category;
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    return filter || 'all';
  });

  // Tab configuration matching the original exactly
  const tabs = [
    { id: 'all', label: 'ALL', filter: null },
    { id: 'tops', label: 'TOPS', filter: 'Tops' },
    { id: 'bottoms', label: 'BOTTOMS', filter: 'Bottoms' },
    { id: 'outerwear', label: 'OUTERWEAR', filter: 'Outerwear' },
    { id: 'accessories', label: 'ACCESSORIES', filter: 'Accessories' },
    { id: 'new-arrivals', label: 'NEW ARRIVALS', filter: 'NEW' },
    { id: 'best-sellers', label: 'BEST SELLERS', filter: 'BEST SELLER' },
    { id: 'sale', label: 'SALE', filter: 'SALE' }
  ];

  const filteredProducts = useMemo(() => {
    let products = mockProducts;

    // Filter based on active tab
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    if (activeTabConfig && activeTabConfig.filter) {
      if (['NEW ARRIVALS', 'BEST SELLERS', 'SALE'].includes(activeTabConfig.label)) {
        // Filter by badge
        const badgeMap = {
          'NEW ARRIVALS': 'NEW',
          'BEST SELLERS': 'BEST SELLER',
          'SALE': 'SALE'
        };
        products = products.filter(p => 
          p.badges.includes(badgeMap[activeTabConfig.label])
        );
      } else {
        // Filter by category
        products = products.filter(p => 
          p.category.toLowerCase() === activeTabConfig.filter.toLowerCase()
        );
      }
    }

    return products;
  }, [activeTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Update URL without page refresh using replace instead of navigate
    const newUrl = getUrlForTab(tabId);
    window.history.replaceState(null, '', newUrl);
  };

  const getUrlForTab = (tabId) => {
    if (tabId === 'all') {
      return '/shop';
    } else if (['tops', 'bottoms', 'outerwear', 'accessories'].includes(tabId)) {
      return `/shop/category/${tabId}`;
    } else {
      return `/shop?filter=${tabId}`;
    }
  };

  // Get current page title
  const getCurrentTitle = () => {
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    return activeTabConfig ? activeTabConfig.label : 'ALL PRODUCTS';
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-6xl lg:text-8xl font-bold uppercase tracking-wider leading-none">
            {getCurrentTitle()}
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 md:gap-8 border-b border-gray-800 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`text-sm md:text-base font-medium uppercase tracking-wider transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-[var(--color-text)] border-b-2 border-[var(--color-text)] pb-2'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">No products found</h3>
            <p className="text-gray-400 mb-8">No products available in this category</p>
            <button
              onClick={() => handleTabClick('all')}
              className="text-[var(--color-text)] hover:text-gray-300 underline"
            >
              View all products
            </button>
          </div>
        )}

        {/* Newsletter Section - Replacing the Framer promotion */}
        <div className="border-t border-gray-800 pt-16 mt-16">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
              Stay Updated
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Be the first to know about new arrivals, exclusive collections, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-[var(--color-bg)] border border-gray-600 px-4 py-3 focus:outline-none focus:border-white transition-colors"
              />
              <button className="bg-[var(--color-accent)] text-[var(--color-bg)] px-8 py-3 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="border-t border-gray-800 pt-16 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Free Shipping</h3>
              <p className="text-gray-400 text-sm">
                Complimentary shipping on all orders worldwide
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Easy Returns</h3>
              <p className="text-gray-400 text-sm">
                30-day return policy for unworn items
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Premium Quality</h3>
              <p className="text-gray-400 text-sm">
                Crafted with attention to detail and built to last
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;