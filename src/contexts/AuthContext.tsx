// src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (password: string) => {
    // In a real app, verify the password with your backend
    const isAuthenticated = password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (isAuthenticated) {
      setIsAdmin(true);
      // Store in localStorage to persist the session
      localStorage.setItem('isAdmin', 'true');
    }
    return isAuthenticated;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  // Check localStorage on initial load
  useEffect(() => {
    const stored = localStorage.getItem('isAdmin');
    if (stored === 'true') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
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