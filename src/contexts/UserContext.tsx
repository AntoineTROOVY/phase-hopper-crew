import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase, getCRMUserByEmail } from '@/integrations/supabase/supabaseClient';

interface User {
  firstName: string;
  email: string;
  profilePicture: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isRestoringUser: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isRestoringUser: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoringUser, setIsRestoringUser] = useState(true);

  // Effet pour restaurer l'utilisateur connecté au chargement
  useEffect(() => {
    const restoreUser = async () => {
      setIsRestoringUser(true);
      console.log('[UserContext] Début restauration utilisateur');
      const { data, error } = await supabase.auth.getUser();
      console.log('[UserContext] Résultat supabase.auth.getUser() :', data, error);
      const supaUser = data?.user;
      if (supaUser && supaUser.email) {
        const crmUser = await getCRMUserByEmail(supaUser.email);
        console.log('[UserContext] Résultat getCRMUserByEmail :', crmUser);
        if (crmUser) {
          setUser({
            firstName: crmUser.firstName || '',
            email: crmUser.email || '',
            profilePicture: crmUser.profilePicture || null,
          });
        }
      } else {
        setUser(null);
      }
      setIsRestoringUser(false);
      console.log('[UserContext] Fin restauration utilisateur');
    };
    restoreUser();

    // Écoute les changements de session Supabase
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      restoreUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isRestoringUser }}>
      {children}
    </UserContext.Provider>
  );
}; 