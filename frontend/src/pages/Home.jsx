import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { filterByPriceRange } from '../lib/price';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Rail from '../components/Rail';
import MoodChips from '../components/MoodChips';
import ExclusiveCountdown from '../components/ExclusiveCountdown';
import PSPKCommunityModal from '../components/PSPKCommunityModal';

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

  // Filter products for different rails
  const affordableProducts = filterByPriceRange(products, 999);
  const bestSellers = products.filter(p => p.badges && p.badges.includes('BEST SELLER'));
  const rebelCore = products.filter(p => p.badges && (p.badges.includes('REBEL DROP') || p.badges.includes('FAN ARSENAL')));
  const vaultProducts = products.filter(p => p.badges && p.badges.includes('PREMIUM'));

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-7xl lg:text-9xl font-black uppercase tracking-wider leading-tight mb-8 font-headline">
            EVERY FAN<br />
            <span className="text-[var(--color-red)]">IS A SOLDIER.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Armory zero-scene edition. Premium drops before the trailer. Built for rebels.
          </p>
          <p className="text-[var(--color-gold)] font-bold text-lg">
            ARM UP. (ఆయుధాలు తీసుకో)
          </p>
        </div>
      </section>
      
      {/* Rails System */}
      <Rail 
        title="Under ₹999 — For Every Rebel" 
        products={affordableProducts}
        showViewAll={true}
        viewAllLink="/shop?filter=affordable"
      />
      
      <Rail 
        title="Rebellion Core — Bestsellers" 
        products={rebelCore.length > 0 ? rebelCore : products.slice(0, 8)}
        showViewAll={true}
        viewAllLink="/shop?filter=bestsellers"
      />
      
      <Rail 
        title="Vault Exclusives — Numbered. Never Reprinted." 
        products={vaultProducts.length > 0 ? vaultProducts : products.filter(p => p.price >= 2000)}
        showViewAll={true}
        viewAllLink="/shop?filter=vault"
      />
      
      {/* Mood Selection */}
      <MoodChips />

      <Footer />
    </div>
  );
};

export default Home;