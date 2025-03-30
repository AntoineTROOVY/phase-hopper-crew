
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCompanyBySlackId, Company } from '@/services/companyService';

interface BrandingContextType {
  company: Company | null;
  isLoading: boolean;
  error: Error | null;
  interfaceName: string;
  interfaceLogo: string | null;
}

const defaultBranding = {
  company: null,
  isLoading: false,
  error: null,
  interfaceName: "Keyframe Project Manager",
  interfaceLogo: null
};

const BrandingContext = createContext<BrandingContextType>(defaultBranding);

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadCompanyData = async () => {
      const slackId = searchParams.get('slack-id');
      
      if (!slackId) {
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const companyData = await fetchCompanyBySlackId(slackId);
        setCompany(companyData);
      } catch (err) {
        console.error("Failed to load company data:", err);
        setError(err instanceof Error ? err : new Error('Unknown error loading company data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCompanyData();
  }, [searchParams]);
  
  // Determine the interface name and logo based on company data
  const interfaceName = company?.["Interface name"] || defaultBranding.interfaceName;
  const interfaceLogo = company?.["Interface logo url"] || null;
  
  return (
    <BrandingContext.Provider value={{ 
      company, 
      isLoading, 
      error, 
      interfaceName, 
      interfaceLogo 
    }}>
      {children}
    </BrandingContext.Provider>
  );
};
