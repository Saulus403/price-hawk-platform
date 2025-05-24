
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        
        if (session && session.user) {
          // Get user profile from usuarios table
          const { data: profile, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile && !error) {
            const userData: User = {
              id: profile.id,
              email: profile.email,
              name: profile.nome,
              role: profile.role as UserRole,
              companyId: profile.empresa_id || ""
            };
            
            setCurrentUser(userData);
            setIsAuthenticated(true);
          } else {
            console.error('Error fetching user profile:', error);
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session && session.user) {
        // Get user profile from usuarios table
        const { data: profile, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile && !error) {
          const userData: User = {
            id: profile.id,
            email: profile.email,
            name: profile.nome,
            role: profile.role as UserRole,
            companyId: profile.empresa_id || ""
          };
          
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error(error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao realizar login');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        console.error('Registration error:', error.message);
        toast.error(error.message);
        return false;
      }

      toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erro ao realizar cadastro');
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
