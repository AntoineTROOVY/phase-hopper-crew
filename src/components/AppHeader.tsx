import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBranding } from '@/contexts/BrandingContext';
import { ArrowLeft, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/supabaseClient';

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

  // Utilisation du contexte utilisateur
  const { user } = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container mx-auto py-4 flex items-center justify-between">
        <div className="flex items-center">
          {interfaceLogo && (
            <div className="mr-8 -ml-4">
              <img 
                src={interfaceLogo} 
                alt={interfaceName} 
                className="h-16 w-auto object-contain" 
                onError={(e) => {
                  console.error('Error loading interface logo:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="flex items-center gap-4">
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
        {/* Affichage à droite : prénom + photo ou bouton Se connecter */}
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 py-1 hover:bg-gray-100 rounded">
            <div className="flex items-center gap-2">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profil" 
                        className="h-8 w-8 rounded-full object-cover border" 
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-gray-500" />
                      </div>
              )}
              <span className="font-semibold text-gray-700">{user.firstName}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href="/Login" style={{ color: '#f59e42', fontWeight: 'bold' }}>Se connecter</a>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
