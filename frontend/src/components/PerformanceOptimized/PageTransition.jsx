import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const { isReducedMotion } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (isReducedMotion) {
      setDisplayLocation(location);
      return;
    }

    if (location !== displayLocation) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 120); // 120ms transition as specified

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation, isReducedMotion]);

  if (isReducedMotion) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Page content */}
      <div 
        className={`transition-opacity duration-[120ms] ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
      
      {/* Flash overlay for route transitions */}
      <div 
        className={`fixed inset-0 bg-black z-[9999] pointer-events-none transition-opacity duration-[120ms] ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default PageTransition;