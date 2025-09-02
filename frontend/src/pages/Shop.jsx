import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFilteredProducts } from '../hooks/useProducts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const { category } = useParams();
  const [activeTab, setActiveTab] = useState(() => {
    // Set initial tab based on URL
    if (category) return category;
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    return filter || 'all';
  });

  // Update active tab when URL changes
  useEffect(() => {
    if (category) {
      setActiveTab(category);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter');
      setActiveTab(filter || 'all');
    }
  }, [category]);

  // OG Armory tab configuration
  const tabs = [
    { id: 'all', label: 'ARMORY', filter: null },
    { id: 'tops', label: 'REBEL TEES', filter: 'Tops' },
    { id: 'bottoms', label: 'GROUND ZERO PANTS', filter: 'Bottoms' },
    { id: 'outerwear', label: 'KATANA HOODIES', filter: 'Outerwear' },
    { id: 'accessories', label: 'CHAINS, BANDS, POSTERS', filter: 'Accessories' },
    { id: 'new-arrivals', label: 'REBEL DROP', filter: 'NEW' },
    { id: 'best-sellers', label: 'FAN ARSENAL', filter: 'BEST SELLER' },
    { id: 'sale', label: 'BLOOD PRICE', filter: 'SALE' }
  ];

  // Get filtered products using the new hook
  const getFilterForTab = () => {
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    if (!activeTabConfig) return null;
    
    if (['new-arrivals', 'best-sellers', 'sale'].includes(activeTab)) {
      return activeTab;
    }
    return null;
  };

  const getCategoryForTab = () => {
    if (['tops', 'bottoms', 'outerwear', 'accessories'].includes(activeTab)) {
      return activeTab;
    }
    return 'all';
  };

  const { products: filteredProducts, loading, error } = useFilteredProducts(
    getCategoryForTab(),
    getFilterForTab()
  );

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

  // Get current page title with OG subtitle
  const getCurrentTitle = () => {
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    return activeTabConfig ? activeTabConfig.label : 'ARMORY';
  };
  
  const getCurrentSubtitle = () => {
    if (activeTab === 'all') {
      return 'Browse the arsenal. Every piece forged for the OG tribe.';
    }
    return 'Curated drops for the battlefield.';
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-6xl lg:text-8xl font-bold font-headline uppercase tracking-wider leading-none mb-4">
            {getCurrentTitle()}
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-3xl">
            {getCurrentSubtitle()}
          </p>
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

        {/* Restock Alerts - OG Theme */}
        <div className="border-t border-[var(--color-steel)] pt-16 mt-16">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold font-headline uppercase tracking-wider">
              Join Restock Alerts
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Be the first rebel to know about drops, restocks, and exclusive vault access.
            </p>
            <p className="text-[var(--color-gold)] font-medium">
              Never miss a battle. Never miss a drop (ఎప్పుడూ యుద్ధాన్ని కోల్పోవద్దు).
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-[var(--color-bg)] border border-[var(--color-steel)] px-4 py-3 focus:outline-none focus:border-[var(--color-red)] focus:shadow-[0_0_10px_rgba(193,18,31,0.3)] transition-all"
              />
              <button className="bg-[var(--color-red)] text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-opacity-90 hover:shadow-[0_0_15px_rgba(193,18,31,0.6)] transition-all">
                ARM UP
              </button>
            </div>
          </div>
        </div>

        {/* OG Guarantees */}
        <div className="border-t border-[var(--color-steel)] pt-16 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-[var(--color-gold)]">Battle-Ready Shipping</h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                Worldwide delivery for the global tribe
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-[var(--color-gold)]">Warrior Returns</h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                30-day return policy — no questions asked
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-[var(--color-gold)]">Theater-Grade Quality</h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                Premium cotton, battle-tested durability
              </p>
            </div>
          </div>
          
          {/* Bottom tribal line */}
          <div className="text-center mt-12">
            <p className="text-[var(--color-text-muted)] text-lg">
              Every product is a weapon. Every fan is a soldier.
            </p>
            <p className="text-[var(--color-red)] font-bold mt-2 tracking-wide">
              (ప్రతి అభిమాని ఒక సైనికుడు)
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;