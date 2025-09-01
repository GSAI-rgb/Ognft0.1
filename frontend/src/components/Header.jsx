import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Shipping Banner */}
      <div className="bg-white text-black text-center py-2 text-sm font-medium tracking-wider">
        FREE STANDARD SHIPPING ON ALL ORDERS
      </div>
      
      {/* Main Header */}
      <header className="bg-black text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-wider hover:text-gray-300 transition-colors">
              AXM
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <Link to="/shop" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
                SHOP
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-black border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link to="/shop" className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors">
                    All Products
                  </Link>
                  <Link to="/shop/category/tops" className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors">
                    Tops
                  </Link>
                  <Link to="/shop/category/bottoms" className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors">
                    Bottoms
                  </Link>
                  <Link to="/shop/category/outerwear" className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors">
                    Outerwear
                  </Link>
                  <Link to="/shop/category/accessories" className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors">
                    Accessories
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/about" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
              ABOUT
            </Link>
            <Link to="/journal" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
              JOURNAL
            </Link>
            <Link to="/contact" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
              CONTACT
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <Search size={20} />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <User size={20} />
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors relative"
            >
              <ShoppingBag size={20} />
              {/* Cart Badge */}
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                2
              </span>
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-800 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/shop" 
                className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                SHOP
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
              </Link>
              <Link 
                to="/journal" 
                className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                JOURNAL
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT
              </Link>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;