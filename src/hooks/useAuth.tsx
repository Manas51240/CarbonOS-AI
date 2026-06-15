'use client';

/**
 * CarbonOS AI - Authentication Hook
 * Manages user profile session state and credentials.
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { FirebaseService } from '@/services/firebase';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to authentication changes (dual-mode)
    const unsubscribe = FirebaseService.auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    try {
      const profile = await FirebaseService.auth.signIn(email);
      setUser(profile);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, displayName: string) => {
    setLoading(true);
    try {
      const profile = await FirebaseService.auth.signUp(email, displayName);
      setUser(profile);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await FirebaseService.auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    const updated = await FirebaseService.auth.getCurrentUser();
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshProfile }}>
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
