
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
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (session && session.user) {
          // Small delay to prevent deadlock
          setTimeout(async () => {
            try {
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
                
                console.log('User profile loaded:', userData);
                setCurrentUser(userData);
                setIsAuthenticated(true);
              } else {
                console.error('Error fetching user profile:', error);
                // Try to create profile if it doesn't exist
                if (error?.code === 'PGRST116') {
                  console.log('Profile not found, creating...');
                  const { data: newProfile, error: createError } = await supabase
                    .from('usuarios')
                    .insert({
                      id: session.user.id,
                      nome: session.user.email?.split('@')[0] || 'Usuário',
                      email: session.user.email || '',
                      role: 'alimentador',
                      empresa_id: '550e8400-e29b-41d4-a716-446655440000'
                    })
                    .select()
                    .single();
                    
                  if (newProfile && !createError) {
                    const userData: User = {
                      id: newProfile.id,
                      email: newProfile.email,
                      name: newProfile.nome,
                      role: newProfile.role as UserRole,
                      companyId: newProfile.empresa_id || ""
                    };
                    
                    setCurrentUser(userData);
                    setIsAuthenticated(true);
                  } else {
                    console.error('Error creating profile:', createError);
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                  }
                } else {
                  setCurrentUser(null);
                  setIsAuthenticated(false);
                }
              }
            } catch (error) {
              console.error('Error in auth state change:', error);
              setCurrentUser(null);
              setIsAuthenticated(false);
            }
          }, 100);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      
      if (session && session.user) {
        setTimeout(async () => {
          try {
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
          } catch (error) {
            console.error('Error loading initial session:', error);
          }
          
          setIsLoading(false);
        }, 100);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error('Erro ao realizar login: ' + error.message);
        return false;
      }

      console.log('Login successful for:', email);
      toast.success('Login realizado com sucesso');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao realizar login');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    try {
      console.log('Attempting registration for:', email);
      
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
        toast.error('Erro ao realizar cadastro: ' + error.message);
        return false;
      }

      console.log('Registration successful for:', email);
      toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erro ao realizar cadastro');
      return false;
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.success('Logout realizado com sucesso');
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
