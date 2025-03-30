
import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';

const AppFooter: React.FC = () => {
  const { interfaceName } = useBranding();
  
  return (
    <footer className="bg-white border-t py-4">
      <div className="container mx-auto text-center text-sm text-gray-500">
        {interfaceName} © {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default AppFooter;
