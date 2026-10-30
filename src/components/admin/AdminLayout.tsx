import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isCheckingSession } = useAuth();
  const location = useLocation();

  // Wait for the server's answer, or a page refresh would bounce you to the login page.
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-stone-500">
        Checking your session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-100/60 font-sans text-stone-900">
      <AdminSidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
