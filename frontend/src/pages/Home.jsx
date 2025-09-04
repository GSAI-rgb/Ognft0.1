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

  // Filter products for different rails - CONVERSION FOCUSED
  const affordableProducts = filterByPriceRange(products, 999);
  const exclusiveProducts = products.filter(p => p.badges && (p.badges.includes('PREDATOR DROP') || p.badges.includes('VAULT')));
  const rebelCore = products.filter(p => p.badges && (p.badges.includes('REBEL DROP') || p.badges.includes('FAN ARSENAL')));
  const vaultProducts = products.filter(p => p.badges && p.badges.includes('PREMIUM'));

  // Personalized greeting based on user profile
  const getPersonalizedGreeting = () => {
    if (!userProfile) return "EVERY FAN IS A SOLDIER.";
    
    switch (userProfile.fanLevel) {
      case 'tribal':
        return `WELCOME BACK, TRIBAL WARRIOR ${userProfile.name?.toUpperCase() || 'SOLDIER'}!`;
      case 'superfan':
        return `${userProfile.name?.toUpperCase() || 'SUPER FAN'}, YOUR ARSENAL AWAITS!`;
      case 'dedicated':
        return `READY FOR BATTLE, ${userProfile.name?.toUpperCase() || 'DEDICATED FAN'}?`;
      default:
        return `ARM UP, ${userProfile.name?.toUpperCase() || 'REBEL'}!`;
    }
  };

  const getPersonalizedSubtext = () => {
    if (!userProfile) return "Armory zero-scene edition. Premium drops before the trailer. Built for rebels.";
    
    return `Your personalized PSPK experience. ${userProfile.interests?.length || 0} interests tracked. Elite access activated.`;
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      
      {/* Hero Section - CONVERSION FOCUSED */}
      <section className="bg-black text-white py-20 px-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-yellow-900/20 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-7xl lg:text-9xl font-black uppercase tracking-wider leading-tight mb-8 font-headline">
            {getPersonalizedGreeting().split(' ').map((word, index) => (
              <span 
                key={index}
                className={word.includes('PSPK') || word.includes('WARRIOR') || word.includes('TRIBAL') ? 'text-[var(--color-red)]' : ''}
              >
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {getPersonalizedSubtext()}
          </p>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={() => document.getElementById('rebellion-core')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[var(--color-red)] text-white px-8 py-4 font-black uppercase tracking-wider hover:bg-opacity-90 transition-all hover:shadow-[0_0_30px_rgba(193,18,31,0.6)] text-lg"
            >
              ENTER ARMORY
            </button>
            
            {!userProfile && (
              <button
                onClick={() => setCommunityModalOpen(true)}
                className="border-2 border-[var(--color-gold)] text-[var(--color-gold)] px-8 py-4 font-black uppercase tracking-wider hover:bg-[var(--color-gold)] hover:text-black transition-all text-lg"
              >
                JOIN PSPK TRIBE
              </button>
            )}
          </div>
          
          <p className="text-[var(--color-gold)] font-bold text-lg">
            ARM UP. (ఆయుధాలు తీసుకో)
          </p>
        </div>
      </section>

      {/* Exclusive Countdown Section */}
      {exclusiveProducts.length > 0 && (
        <section className="py-16 px-6 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <ExclusiveCountdown
              endTime="2024-12-31T23:59:59Z"
              title="PSPK BIRTHDAY SPECIAL"
              subtitle="Exclusive drops for true fans only"
              onComplete={() => console.log('Countdown completed!')}
            />
          </div>
        </section>
      )}
      
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