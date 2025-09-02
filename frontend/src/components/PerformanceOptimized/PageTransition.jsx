import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const PageTransition = ({ children }) => {
  const { isReducedMotion } = useTheme();

  // Simplified - no page flashing, just smooth content transitions
  return (
    <div className="min-h-screen">
      <div 
        className={`${
          isReducedMotion 
            ? '' 
            : 'transition-all duration-200 ease-out'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;