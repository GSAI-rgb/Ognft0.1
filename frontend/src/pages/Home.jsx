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
  const { currentTheme } = useTheme();
  const isOGTheme = currentTheme === 'og';

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      
      {/* Conditional rendering based on theme while preserving layout */}
      {isOGTheme ? (
        <>
          <OGHeroSection />
          <RebelDrops />
          <FanArsenal />
          <ArsenalCategories />
          <FanArmyWall />
          <FromFirestorm />
          <Footer />
        </>
      ) : (
        <>
          <HeroSection />
          <NewArrivals />
          <BestSellers />
          <Categories />
          <Collections />
          <Performance />
          <InstagramFeed />
          <Journal />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;