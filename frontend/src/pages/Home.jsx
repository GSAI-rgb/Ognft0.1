import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { filterByPriceRange } from '../lib/price';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Rail from '../components/Rail';
import PSPKCommunityModal from '../components/PSPKCommunityModal';

const Home = () => {
  const { products, loading, error } = useProducts();
  const [communityModalOpen, setCommunityModalOpen] = useState(false);

  const handleCommunityConsent = (consented) => {
    if (consented) {
      // Handle community consent logic here
      console.log('User consented to community');
    }
    setCommunityModalOpen(false);
  };

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
      
      {/* Rails System - SIMPLE */}
      <Rail 
        title="Under ₹999 — For Every Rebel" 
        products={affordableProducts}
        showViewAll={true}
        viewAllLink="/shop?filter=under-999"
      />
      
      <Rail 
        title="Rebellion Core — Essential Gear" 
        products={rebelCore.length > 0 ? rebelCore : products.slice(0, 8)}
        showViewAll={true}
        viewAllLink="/shop?filter=rebellion-core"
      />
      
      <Rail 
        title="Premium Collection" 
        products={vaultProducts.length > 0 ? vaultProducts : products.filter(p => p.price >= 2000)}
        showViewAll={true}
        viewAllLink="/shop?filter=premium"
      />

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