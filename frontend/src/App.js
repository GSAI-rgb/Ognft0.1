import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import NewArrivals from './components/NewArrivals';
import BestSellers from './components/BestSellers';
import Categories from './components/Categories';
import Collections from './components/Collections';
import Performance from './components/Performance';
import InstagramFeed from './components/InstagramFeed';
import Journal from './components/Journal';
import Footer from './components/Footer';

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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;