import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <h1 className="text-2xl font-bold tracking-wider">AXM</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
                SHOP
              </button>
            </div>
            <a href="#about" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
              ABOUT
            </a>
            <a href="#journal" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
              JOURNAL
            </a>
            <a href="#contact" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
              CONTACT
            </a>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <User size={20} />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ShoppingBag size={20} />
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
              <a href="#shop" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
                SHOP
              </a>
              <a href="#about" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
                ABOUT
              </a>
              <a href="#journal" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
                JOURNAL
              </a>
              <a href="#contact" className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium">
                CONTACT
              </a>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;