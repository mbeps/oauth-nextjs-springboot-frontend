'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { checkAuthStatus, type AuthStatus, type User } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const status = await checkAuthStatus();
      setAuthenticated(status.authenticated);
      setUser(status.user || null);
    } catch (error) {
      console.error('Auth refresh failed:', error);
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, authenticated, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}