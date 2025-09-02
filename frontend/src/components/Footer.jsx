import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';

const Footer = () => {
  const { currentTheme } = useTheme();
  const { t } = useI18n();
  const isOGTheme = currentTheme === 'og';

  return (
    <footer className="bg-[var(--color-bg)] text-[var(--color-text)] py-20 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-wider">
              {isOGTheme ? 'OG' : 'AXM'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isOGTheme 
                ? t('footer.official') 
                : 'Premium streetwear designed for the modern individual. Crafted with attention to detail and built to last.'
              }
            </p>
            {isOGTheme && (
              <p className="text-[var(--color-red)] text-sm font-bold tracking-wide">
                {t('footer.tagline')}
              </p>
            )}
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold uppercase tracking-wider">Shop</h4>
            <div className="space-y-2">
              <Link to="/shop/category/tops" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Tops
              </Link>
              <Link to="/shop/category/bottoms" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Bottoms
              </Link>
              <Link to="/shop/category/outerwear" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Outerwear
              </Link>
              <Link to="/shop/category/accessories" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Accessories
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold uppercase tracking-wider">Company</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors text-sm">
                About Us
              </Link>
              <Link to="/journal" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Journal
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact
              </Link>
              <a href="#careers" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Careers
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold uppercase tracking-wider">Support</h4>
            <div className="space-y-2">
              <a href="#size-guide" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Size Guide
              </a>
              <a href="#shipping" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Shipping Info
              </a>
              <a href="#returns" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Returns
              </a>
              <a href="#faq" className="block text-gray-400 hover:text-white transition-colors text-sm">
                FAQ
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-gray-400 text-sm">
              © 2024 AXM. All rights reserved.
            </p>
            <div className="flex space-x-6 text-xs">
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          
          <div className="text-gray-400 text-sm">
            Built with precision and care
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;