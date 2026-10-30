import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser } from '../types';
import { api, ApiError } from '../services/api';

interface AuthContextValue {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  /** True until the server has told us whether this browser is logged in. */
  isCheckingSession: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // When the website loads, ask the server whether this browser is already logged in.
  useEffect(() => {
    let ignore = false; // set on cleanup, so a late answer is ignored
    api
      .get<{ user: AdminUser }>('/auth/me')
      .then((data) => {
        if (!ignore) setAdminUser(data.user);
      })
      .catch(() => {
        // Any failure, including "401: not logged in", simply means: not logged in.
        if (!ignore) setAdminUser(null);
      })
      .finally(() => {
        if (!ignore) setIsCheckingSession(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.post<{ user: AdminUser }>('/auth/login', { email, password });
      setAdminUser(data.user);
      return { success: true };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Login failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if the request fails, forget the user in this browser.
    }
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        isCheckingSession,
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