import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Collections = () => {
  const { t } = useI18n();

  // OG Collections - Shopify integrated with metafields
  const collections = [
    {
      handle: 'rebellion-core',
      title: 'Rebellion Core',
      description: 'Rebellion Core — essentials for every soldier.',
      image: 'https://framerusercontent.com/images/8gqTSINX7hptd4ZpZhFcjP9JvhE.jpg',
      productCount: 12,
      rank: 'Common'
    },
    {
      handle: 'vault-exclusive',
      title: 'Vault Exclusive',
      description: 'Vault Exclusive — only for collectors, only for legends.',
      image: 'https://framerusercontent.com/images/Bqu1YbtLNP6KpNMpw9Wnp1oQOJA.jpg',
      productCount: 6,
      rank: 'Vault',
      isLocked: true
    },
    {
      handle: 'captain-series',
      title: 'Captain Series',
      description: 'Captain Series — lead from the front (ముందుండి నడిపించు).',
      image: 'https://framerusercontent.com/images/aHmupIkpNbiTWcrio0jHVxTg4OU.png',
      productCount: 8,
      rank: 'Captain'
    },
    {
      handle: 'first-day-first-show',
      title: 'First Day First Show',
      description: 'First Day First Show — theater-grade merch for opening day warriors.',
      image: 'https://framerusercontent.com/images/QnjPU1zOWtNjPZtBPpgHzKv8E.jpg',
      productCount: 15,
      rank: 'Rebel'
    }
  ];

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 'Vault':
        return 'bg-[var(--color-gold)] text-black';
      case 'Captain':
        return 'bg-[var(--color-red)] text-white';
      case 'Rebel':
        return 'bg-white text-black';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-6xl lg:text-8xl font-bold uppercase tracking-wider leading-none mb-6">
            {t('navigation.collections')}
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-3xl">
            Curated drops for different ranks. Find your tribe, find your gear.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.handle}
              to={`/collections/${collection.handle}`}
              className="group relative overflow-hidden bg-[var(--color-steel)] hover:bg-opacity-80 transition-all duration-300"
            >
              {/* Collection Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300" />
                
                {/* Lock overlay for Vault */}
                {collection.isLocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🔒</div>
                      <p className="text-[var(--color-gold)] font-bold uppercase tracking-wider">
                        {t('home.vault.locked_message')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Collection Info */}
              <div className="p-6">
                {/* Rank Badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${getRankBadgeColor(collection.rank)}`}>
                    {t(`ranks.${collection.rank.toLowerCase()}`)}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3 group-hover:text-[var(--color-red)] transition-colors">
                  {collection.title}
                </h2>

                {/* Description */}
                <p className="text-[var(--color-text-muted)] mb-4 leading-relaxed">
                  {collection.description}
                </p>

                {/* Product Count & Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {collection.productCount} products
                  </span>
                  <ArrowRight 
                    size={20} 
                    className="text-[var(--color-red)] group-hover:translate-x-2 transition-transform" 
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA with OG Footer Line */}
        <div className="mt-20 text-center border-t border-[var(--color-steel)] pt-16">
          <h2 className="text-3xl font-bold mb-6">Can't Find Your Rank?</h2>
          <p className="text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto">
            Every purchase builds your tribe status. Start your journey and unlock exclusive collections.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-[var(--color-red)] text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-opacity-90 transition-colors mb-8"
          >
            <span>Start Shopping</span>
            <ArrowRight size={20} />
          </Link>
          
          {/* OG Footer Line */}
          <div className="text-center">
            <p className="text-[var(--color-text-muted)] text-lg">
              Every product is a weapon. Every fan is a soldier
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

export default Collections;