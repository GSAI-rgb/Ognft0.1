import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import SearchModal from './SearchModal';
import CartSidebar from './CartSidebar';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const { isReducedMotion, currentTheme } = useTheme();
  const { t } = useI18n();
  const { itemCount } = useCart();

  const isOGTheme = currentTheme === 'og';

  return (
    <div className="relative">
      {/* Dynamic Banner */}
      <div className="bg-[var(--color-accent)] text-[var(--color-bg)] text-center py-2 text-sm font-medium tracking-wider">
        {isOGTheme ? (
          t('site.tagline', 'DROP DETONATES SOON — GEAR UP REBELS')
        ) : (
          'FREE STANDARD SHIPPING ON ALL ORDERS'
        )}
      </div>
      
      {/* Main Header */}
      <header className="bg-[var(--color-bg)] text-[var(--color-text)] px-6 py-4 border-b border-[var(--color-steel)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-3xl font-black font-headline tracking-wider text-[var(--color-red)] hover:text-white transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(193,18,31,0.8)]"
            >
              OG
            </Link>
          </div>

          {/* Desktop Navigation - FIXED TO MATCH SHOP */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <Link 
                to="/shop" 
                className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
              >
                ARMORY
              </Link>
              {/* Dropdown Menu - UPDATED */}
              <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--color-bg)] border border-[var(--color-steel)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link to="/shop" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    All Arsenal
                  </Link>
                  <Link to="/shop?filter=teeshirts" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    Rebel Tees
                  </Link>
                  <Link to="/shop?filter=hoodies" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    Predator Hoodies
                  </Link>
                  <Link to="/shop?filter=shirts" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    Formal Arsenal
                  </Link>
                  <Link to="/shop?filter=posters" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    War Posters
                  </Link>
                  <Link to="/shop?filter=accessories" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    Gear & Accessories
                  </Link>
                </div>
              </div>
            </div>
            
            {isOGTheme && (
              <Link 
                to="/shop?filter=vault" 
                className="text-[var(--color-gold)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
              >
                VAULT
              </Link>
            )}
            
            <Link 
              to="/about" 
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
            >
              ABOUT
            </Link>
            
            <Link 
              to="/contact" 
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
            >
              CONTACT
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 hover:bg-[var(--color-panel)] rounded-full transition-colors duration-[var(--transition-base)] ${
                isReducedMotion ? 'transition-none' : ''
              }`}
              title={t('navigation.search')}
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className={`p-2 hover:bg-[var(--color-panel)] rounded-full transition-colors duration-[var(--transition-base)] ${
                isReducedMotion ? 'transition-none' : ''
              }`}
            >
              <User size={20} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`p-2 hover:bg-[var(--color-panel)] rounded-full transition-colors duration-[var(--transition-base)] relative ${
                isReducedMotion ? 'transition-none' : ''
              }`}
            >
              <ShoppingBag size={20} />
              {/* Cart Badge */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-[var(--color-bg)] text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
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

        {/* Mobile Menu - UPDATED */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/shop" 
                className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ARMORY
              </Link>
              <Link 
                to="/shop?filter=vault" 
                className="text-[var(--color-gold)] hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                VAULT
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
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

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Header;