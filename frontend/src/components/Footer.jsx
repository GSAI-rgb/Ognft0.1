import React from 'react';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-20 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* CTA Section */}
        <div className="text-center mb-16">
          <div className="space-y-6">
            <button className="bg-blue-600 text-white px-8 py-4 text-sm uppercase tracking-wider font-semibold hover:bg-blue-700 transition-colors">
              Launch Now
            </button>
            
            <div className="space-y-2">
              <button className="border border-white text-white px-8 py-3 text-sm uppercase tracking-wider font-semibold hover:bg-white hover:text-black transition-colors">
                Unlock template
              </button>
              <p className="text-gray-400 text-sm">Get all access</p>
            </div>
          </div>
        </div>

        {/* Framer Attribution */}
        <div className="text-center border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm">
            Create a free website with Framer, the website builder loved by startups, designers and agencies.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;