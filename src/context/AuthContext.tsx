import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { dataService } from '../services/dataService';

interface AuthContextValue {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() =>
    dataService.getCurrentAdminUser()
  );

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setAdminUser(dataService.getCurrentAdminUser());
    });
    return unsubscribe;
  }, []);

  const login = (email: string, pass: string) => {
    const res = dataService.loginAdmin(email, pass);
    if (res.success && res.user) {
      setAdminUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const logout = () => {
    dataService.logoutAdmin();
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
