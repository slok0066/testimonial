import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
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

/**
 * A custom error class that extends Supabase's AuthError to represent a timeout.
 * This is necessary to create a valid AuthError instance for our custom timeout logic.
 */
class TimeoutAuthError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutAuthError';
    this.status = 408; // HTTP 408 Request Timeout
  }
}

// Helper function to poll for session after OAuth. This is useful for popup-based
// OAuth flows. For redirects, the onAuthStateChange listener is the primary
// mechanism for session updates.
const pollForSession = async (timeout = 15000, interval = 500): Promise<Session | null> => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return session;
    }
    // Wait for the specified interval before polling again
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  // If the loop completes without finding a session, it has timed out.
  console.warn("Polling for session timed out.");
  return null;
};

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : '',
          scopes: 'email profile openid',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (oauthError) {
        return { data: { user: null, session: null }, error: oauthError };
      }

      const session = await pollForSession();

      if (!session) {
        return { 
          data: { user: null, session: null }, 
          error: new TimeoutAuthError('Timed out waiting for user session.') 
        };
      }
      
      return {
        data: {
          user: session.user,
          session,
        },
        error: null
      };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return { data: { user: null, session: null }, error: error as AuthError };
    }
  }, []);

  const signInWithEmail = useCallback(async ({ email, password }: UserCredentials): Promise<{ data: { session: Session | null; user: User | null; }; error: AuthError | null }> => {
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
  }, []);

  const signUp = useCallback(async ({ email, password, username }: UserCredentials) => {
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
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(() => ({
    session,
    user,
    loading,
    signOut,
    signInWithGoogle,
    signInWithEmail,
    signUp,
  }), [session, user, loading, signOut, signInWithGoogle, signInWithEmail, signUp]);

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
