
import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';

const AppFooter: React.FC = () => {
  const { interfaceName, interfaceLogo } = useBranding();
  
  return (
    <footer className="bg-white border-t py-4">
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm text-gray-500">
        {interfaceLogo && (
          <img 
            src={interfaceLogo} 
            alt={interfaceName} 
            className="h-8 w-auto object-contain" 
            onError={(e) => {
              console.error('Error loading interface logo:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div>{interfaceName} © {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
};

export default AppFooter;
