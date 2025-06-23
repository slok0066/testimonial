import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User, Provider, AuthResponse, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ data: { session: Session | null; user: User | null; }; error: AuthError | null }>;
  signInWithEmail: (credentials: UserCredentials) => Promise<{ data: { session: Session | null; user: User | null; }; error: AuthError | null }>;
  signUp: (credentials: UserCredentials) => Promise<{ data: { session: Session | null; user: User | null; }; error: AuthError | null }>;
}

interface UserCredentials {
  email: string;
  password?: string;
  username?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Sign in with Supabase OAuth directly
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirect directly to /dashboard after Google login, as requested by user
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '',
          scopes: 'email profile openid',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;

      // Wait for the auth state to update
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              clearInterval(interval);
              resolve(session);
            }
          });
        }, 100);
      });

      // Return the session data
      const { data: { session } } = await supabase.auth.getSession();
      return { 
        data: { 
          user: session?.user ?? null, 
          session: session ?? null 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async ({ email, password }: UserCredentials): Promise<{ data: { session: Session | null; user: User | null; }; error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { 
        data: { 
          user: data.user ?? null, 
          session: data.session ?? null 
        }, 
        error 
      };
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUp = async ({ email, password, username }: UserCredentials) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      return { 
        data: { 
          user: data.user ?? null, 
          session: data.session ?? null 
        }, 
        error 
      };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    session,
    user,
    loading,
    signOut,
    signInWithGoogle,
    signInWithEmail,
    signUp,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
