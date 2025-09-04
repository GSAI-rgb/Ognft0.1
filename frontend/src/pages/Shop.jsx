import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFilteredProducts } from '../hooks/useProducts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const { category } = useParams();
  const [activeTab, setActiveTab] = useState(() => {
    if (category) return category;
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    return filter || 'all';
  });

  useEffect(() => {
    if (category) {
      setActiveTab(category);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter');
      setActiveTab(filter || 'all');
    }
  }, [category]);

  // WORKING TABS - UPDATED WITH VAULT
  const tabs = [
    { id: 'all', label: 'ALL ARSENAL', filter: null },
    { id: 'vault', label: 'VAULT', filter: 'Vault' },
    { id: 'teeshirts', label: 'REBEL TEES', filter: 'Teeshirt' },
    { id: 'hoodies', label: 'HOODIES', filter: 'Hoodies' },
    { id: 'shirts', label: 'SHIRTS', filter: 'Full Shirts' },
    { id: 'sweatshirts', label: 'SWEATSHIRTS', filter: 'Sweatshirts' },
    { id: 'posters', label: 'POSTERS', filter: 'Posters' },
    { id: 'accessories', label: 'ACCESSORIES', filter: 'Accessories' }
  ];

  const getCategoryForTab = () => {
    if (activeTab === 'teeshirts') return 'Teeshirt';
    if (activeTab === 'hoodies') return 'Hoodies';
    if (activeTab === 'posters') return 'Posters';
    if (activeTab === 'sweatshirts') return 'Sweatshirts';
    if (activeTab === 'shirts') return 'Full Shirts';
    if (activeTab === 'accessories') return 'Accessories';
    return null;
  };

  const { products: filteredProducts, loading, error } = useFilteredProducts(
    getCategoryForTab(),
    null
  );

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const newUrl = tabId === 'all' ? '/shop' : `/shop?filter=${tabId}`;
    window.history.replaceState(null, '', newUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[var(--color-red)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-bold uppercase tracking-wider">Loading Arsenal...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-6xl lg:text-8xl font-black font-headline uppercase tracking-wider leading-none mb-4">
            ARMORY
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-3xl">
            Browse the arsenal. Every piece forged for rebels.
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">No Products Found</h3>
            <button
              onClick={() => handleTabClick('all')}
              className="text-[var(--color-text)] hover:text-gray-300 underline"
            >
              View all arsenal
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;