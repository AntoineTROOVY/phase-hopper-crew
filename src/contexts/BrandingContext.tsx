import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCompanyBySlackId, Company } from '@/services/companyService';
import { useUser } from './UserContext';

interface BrandingContextType {
  company: Company | null;
  isLoading: boolean;
  error: Error | null;
  interfaceName: string;
  interfaceLogo: string | null;
  rateAdditionalLanguage: number;
  rateAdditionalFormat: number;
  agencyId: string | null;
}

const defaultBranding = {
  company: null,
  isLoading: false,
  error: null,
  interfaceName: "Keyframe Project Manager",
  interfaceLogo: null,
  rateAdditionalLanguage: 3.0, // Taux par défaut
  rateAdditionalFormat: 1.0,   // Taux par défaut
  agencyId: null
};

const BrandingContext = createContext<BrandingContextType>(defaultBranding);

export const useBranding = () => useContext(BrandingContext);

// Nouvelle fonction utilitaire pour récupérer une agence par son ID depuis Airtable
async function fetchAgencyById(agencyId: string): Promise<{ 
  name: string; 
  logo: string | null;
  rateAdditionalLanguage?: number;
  rateAdditionalFormat?: number;
} | null> {
  const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'pata4KxDhV4JwzJmZ.12a6dbcc38032d0da0514e2fec16fa9e03653292b920775c4d2db56570821d3b';
  const AIRTABLE_BASE_ID = 'appxw8yeMj2p3m4Aa';
  const AGENCIES_TABLE = 'AGENCIES';
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AGENCIES_TABLE}/${agencyId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  });
  const data = await res.json();
  if (data && data.fields) {
    return {
      name: data.fields['Company Name'] || 'Project Manager',
      logo: data.fields['Logo url'] || null,
      rateAdditionalLanguage: typeof data.fields['Rate additionnal language'] === 'number' ? data.fields['Rate additionnal language'] : 3.0,
      rateAdditionalFormat: typeof data.fields['Rate additionnal format'] === 'number' ? data.fields['Rate additionnal format'] : 1.0,
    };
  }
  return null;
}

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [agencyName, setAgencyName] = useState<string>('Project Manager');
  const [agencyLogo, setAgencyLogo] = useState<string | null>(null);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [rateAdditionalLanguage, setRateAdditionalLanguage] = useState<number>(3.0);
  const [rateAdditionalFormat, setRateAdditionalFormat] = useState<number>(1.0);
  const { user, isRestoringUser } = useUser();

  useEffect(() => {
    if (isRestoringUser) {
      console.log('[Branding] Attente de la restauration de l\'utilisateur...');
      return;
    }
    const loadAgencyData = async () => {
      if (!user?.email) {
        console.log('[Branding] Pas d\'utilisateur connecté');
        return;
      }
      // On récupère l'utilisateur dans la table CRM pour avoir l'ID d'agence
      const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'pata4KxDhV4JwzJmZ.12a6dbcc38032d0da0514e2fec16fa9e03653292b920775c4d2db56570821d3b';
      const AIRTABLE_BASE_ID = 'appxw8yeMj2p3m4Aa';
      const CRM_TABLE = 'CRM';
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${CRM_TABLE}?filterByFormula=LOWER({Email})='${encodeURIComponent(user.email.toLowerCase())}'&fields[]=Agency`;
      console.log('[Branding] Requête CRM pour email :', user.email, url);
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      });
      const data = await res.json();
      console.log('[Branding] Réponse CRM complète :', data);
      if (data.records && data.records.length > 0) {
        const agencyIds = data.records[0].fields['Agency'];
        console.log('[Branding] Agency IDs trouvés :', agencyIds);
        if (agencyIds && Array.isArray(agencyIds) && agencyIds.length > 0) {
          console.log('[Branding] On va chercher l\'agence avec l\'ID :', agencyIds[0]);
          setAgencyId(agencyIds[0]);
          const agency = await fetchAgencyById(agencyIds[0]);
          console.log('[Branding] Réponse complète de la requête agence :', agency);
          if (agency) {
            setAgencyName(agency.name);
            setAgencyLogo(agency.logo);
            if (agency.rateAdditionalLanguage !== undefined) {
              setRateAdditionalLanguage(agency.rateAdditionalLanguage);
            }
            if (agency.rateAdditionalFormat !== undefined) {
              setRateAdditionalFormat(agency.rateAdditionalFormat);
            }
            console.log('[Branding] agencyName final :', agency.name, 'agencyLogo final :', agency.logo);
            console.log('[Branding] rateAdditionalLanguage :', agency.rateAdditionalLanguage, 'rateAdditionalFormat :', agency.rateAdditionalFormat);
            return;
          }
        }
      }
      // Si pas d'agence trouvée, fallback
      setAgencyName('Project Manager');
      setAgencyLogo(null);
      setAgencyId(null);
      setRateAdditionalLanguage(3.0);
      setRateAdditionalFormat(1.0);
      console.log('[Branding] Aucune agence trouvée, fallback Project Manager');
    };
    loadAgencyData();
  }, [user, isRestoringUser]);

  return (
    <BrandingContext.Provider value={{ 
      company, 
      isLoading, 
      error, 
      interfaceName: agencyName === 'Project Manager' ? 'Project Manager' : agencyName + ' Project Manager',
      interfaceLogo: agencyLogo,
      rateAdditionalLanguage,
      rateAdditionalFormat,
      agencyId
    }}>
      {children}
    </BrandingContext.Provider>
  );
};
