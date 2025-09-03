'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
// FIX: Removed unused 'UserRole' import
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock user for demonstration purposes
const mockBossUser: User = { id: 'user-boss', name: 'Frank Smit', role: 'Boss' };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // FIX: Removed unused 'setUser' and 'setIsLoading' variables.
  const [user] = useState<User | null>(mockBossUser);
  const [isLoading] = useState(false); // Set to false since we have a default user

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
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