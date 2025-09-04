import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { filterByPriceRange } from '../lib/price';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Rail from '../components/Rail';

const Home = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[var(--color-red)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-bold uppercase tracking-wider">Loading Arsenal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold uppercase tracking-wider text-red-400">Arsenal Temporarily Offline</p>
          <p className="text-gray-400 mt-2">Try again in a moment</p>
        </div>
      </div>
    );
  }

  // Filter products for different rails - SIMPLE
  const affordableProducts = filterByPriceRange(products, 999);
  const rebelCore = products.filter(p => p.badges && (p.badges.includes('REBEL DROP') || p.badges.includes('FAN ARSENAL')));
  const vaultProducts = products.filter(p => p.badges && p.badges.includes('PREMIUM'));

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      
      {/* Hero Section - SIMPLE & WORKING */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-7xl lg:text-9xl font-black uppercase tracking-wider leading-tight mb-8 font-headline">
            EVERY FAN<br />
            <span className="text-[var(--color-red)]">IS A SOLDIER.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Premium OG merchandise. Built for rebels.
          </p>
          <p className="text-[var(--color-gold)] font-bold text-lg">
            ARM UP. (ఆయుధాలు తీసుకో)
          </p>
        </div>
      </section>
      
      {/* Rails System - CONVERSION OPTIMIZED */}
      <div id="rebellion-core">
        <Rail 
          title="Under ₹999 — No Fan Left Behind" 
          products={affordableProducts}
          showViewAll={true}
          viewAllLink="/shop?filter=under-999"
        />
      </div>
      
      <Rail 
        title="Rebellion Core — For True PSPK Fans" 
        products={rebelCore.length > 0 ? rebelCore : products.slice(0, 8)}
        showViewAll={true}
        viewAllLink="/shop?filter=rebellion-core"
      />
      
      {exclusiveProducts.length > 0 && (
        <Rail 
          title="Elite Access — Unlock Your Status" 
          products={exclusiveProducts}
          showViewAll={true}
          viewAllLink="/shop?filter=exclusive"
        />
      )}
      
      {/* Collections Section - CLEAR & SIMPLE */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-wider font-headline mb-4">
              Shop Collections
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Organized collections for easy shopping
            </p>
            <div className="w-20 h-1 bg-[var(--color-red)] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <a 
              href="/shop?filter=teeshirts" 
              className="group bg-gray-900 hover:bg-red-900 transition-all p-6 text-center"
            >
              <h3 className="text-2xl font-bold mb-2">REBEL TEES</h3>
              <p className="text-gray-400">T-shirts for rebels</p>
            </a>
            
            <a 
              href="/shop?filter=hoodies" 
              className="group bg-gray-900 hover:bg-red-900 transition-all p-6 text-center"
            >
              <h3 className="text-2xl font-bold mb-2">HOODIES</h3>
              <p className="text-gray-400">Premium hoodies</p>
            </a>
            
            <a 
              href="/shop?filter=accessories" 
              className="group bg-gray-900 hover:bg-red-900 transition-all p-6 text-center"
            >
              <h3 className="text-2xl font-bold mb-2">ACCESSORIES</h3>
              <p className="text-gray-400">Caps, slides, gear</p>
            </a>
          </div>
        </div>
      </section>

      {/* Community Modal */}
      <PSPKCommunityModal
        isOpen={communityModalOpen}
        onClose={() => setCommunityModalOpen(false)}
        onConsent={handleCommunityConsent}
      />

      <Footer />
    </div>
  );
};

export default Home;