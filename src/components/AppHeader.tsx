
import React from 'react';
import { Link } from 'react-router-dom';
import { useBranding } from '@/contexts/BrandingContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  subtitle, 
  showBackButton = false 
}) => {
  const { interfaceLogo, interfaceName } = useBranding();
  const [searchParams] = useSearchParams();
  const slackId = searchParams.get('slack-id');
  
  // Create the back link with the SlackID parameter preserved
  const backLink = `/${slackId ? `?slack-id=${slackId}` : ''}`;
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container mx-auto py-4">
        <div className="flex items-center">
          {interfaceLogo && (
            <div className="mr-auto">
              <img 
                src={interfaceLogo} 
                alt={interfaceName} 
                className="h-12 w-auto object-contain mr-4" 
                onError={(e) => {
                  console.error('Error loading interface logo:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button variant="ghost" size="icon" asChild>
                <Link to={backLink}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
