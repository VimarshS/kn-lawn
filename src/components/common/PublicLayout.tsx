import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useSettingsContext } from '../../context/SettingsContext';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { status, reload } = useSettingsContext();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  // The whole site depends on the venue's details, so wait for them before showing pages.
  if (status !== 'ready') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5EF] text-[#292D29] px-6">
        {status === 'loading' ? (
          <p className="text-sm text-stone-500">Loading…</p>
        ) : (
          <div className="text-center space-y-4 max-w-sm">
            <p className="text-sm">
              We could not load the website right now. Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={reload}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#183D32] hover:bg-[#102820]"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#292D29]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};