import React from 'react';
import Header from '../components/Header';
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
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <HeroSection />
      <NewArrivals />
      <BestSellers />
      <Categories />
      <Collections />
      <Performance />
      <InstagramFeed />
      <Journal />
      <Footer />
    </div>
  );
};

export default Home;