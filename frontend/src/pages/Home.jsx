import React from 'react';
import { useTheme } from '../hooks/useTheme';
import Header from '../components/Header';
import OGHeroSection from '../components/OG/OGHeroSection';
import RebelDrops from '../components/OG/RebelDrops';
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
    <div className="min-h-screen bg-black text-white">
      <div className="py-20 px-6 text-center">
        <h1 className="text-6xl font-bold mb-4 text-red-500">OG STORE - TESTING</h1>
        <p className="text-xl mb-8">React is working! Components loading...</p>
        <div className="bg-red-500 p-4 rounded">
          <p>If you see this, the basic React app is functional</p>
        </div>
      </div>
    </div>
  );
};

export default Home;