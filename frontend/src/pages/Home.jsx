import React from 'react';
import { useTheme } from '../hooks/useTheme';
import Header from '../components/Header';
import OGHeroSection from '../components/OG/OGHeroSection';
import RebelDrops from '../components/OG/RebelDrops';
import FeaturedTees from '../components/OG/FeaturedTees';
import FanArsenal from '../components/OG/FanArsenal';
import ArsenalCategories from '../components/OG/ArsenalCategories';
import FanArmyWall from '../components/OG/FanArmyWall';
import FromFirestorm from '../components/OG/FromFirestorm';
// Fallback to original components for non-OG theme
import HeroSection from '../components/HeroSection';
import NewArrivals from '../components/NewArrivals';
import BestSellers from '../components/BestSellers';
import Categories from '../components/Categories';
import Collections from '../components/Collections';
import Performance from '../components/Performance';
import InstagramFeed from '../components/InstagramFeed';
import Journal from '../components/Journal';
import Footer from '../components/Footer';

const Home = () => {
  // OG theme is permanent - no theme checking needed

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      
      {/* Simplified OG Hero */}
      <div className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-7xl lg:text-9xl font-bold uppercase tracking-wider leading-tight mb-8">
            OG ISN'T MERCH.<br />
            <span className="text-red-500">IT'S A CALLSIGN.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Cinematic drops. Theater-grade prints. Built for the tribe.
          </p>
        </div>
      </div>
      
      <RebelDrops />
      <FeaturedTees />
      <FanArsenal />
      <ArsenalCategories />
      <Footer />
    </div>
  );
};

export default Home;