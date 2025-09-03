'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The user data that will be set upon successful login
const authenticatedUser: User = { id: 'user-boss', name: 'GBSA Admin', role: 'Boss' };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On initial load, check if a user session exists in sessionStorage
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('gbsa-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // This is where the simple, hard-coded authentication check happens
    if (username === 'gbsaadmin' && password === 'gbsa@admin85879') {
      setUser(authenticatedUser);
      // We use sessionStorage to keep the user logged in during the browser session
      sessionStorage.setItem('gbsa-user', JSON.stringify(authenticatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('gbsa-user');
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};