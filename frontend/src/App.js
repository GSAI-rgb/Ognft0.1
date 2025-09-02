import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Providers
import { ThemeProvider } from './hooks/useTheme';
import { CartProvider } from './context/CartContext';

// Performance Components
import PageTransition from './components/PerformanceOptimized/PageTransition';

// Import Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import About from './pages/About';
import Journal from './pages/Journal';
import Contact from './pages/Contact';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="App">
          <BrowserRouter>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/category/:category" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/journal/:id" element={<Journal />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </PageTransition>
          </BrowserRouter>
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;