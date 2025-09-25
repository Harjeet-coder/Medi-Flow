import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'Admin' | 'Doctor' | 'Staff';

interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthorized: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, role: UserRole): boolean => {
    // Mock authentication - in real app, this would call an API
    if (password === 'admin123' || password === 'demo') {
      setUser({ username, role });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthorized = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthorized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};