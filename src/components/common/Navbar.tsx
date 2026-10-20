import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CalendarCheck, Phone, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Events & Gallery', path: '/events' },
    { label: 'Availability', path: '/availability' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#102820]/95 backdrop-blur-md border-b border-[#C6A66B]/25 text-[#F8F5EF] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (4-5 Nav Links) — Zone 3 (1 Action) */}
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 group whitespace-nowrap shrink-0 text-decoration-none"
          >
            <div className="w-10 h-10 rounded-full border border-[#C6A66B]/60 flex items-center justify-center bg-[#183D32] text-[#C6A66B] font-display text-xl font-bold tracking-tight shadow-sm group-hover:border-[#C6A66B] transition-colors">
              KN
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-wide text-[#F8F5EF] group-hover:text-[#DFC493] transition-colors">
                K.N. Lawn
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#C6A66B] font-sans -mt-1">
                Wedding & Events Venue
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 tracking-wide ${
                    active
                      ? 'text-[#DFC493] font-semibold'
                      : 'text-[#F8F5EF]/80 hover:text-[#DFC493]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C6A66B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Quick Connect */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#DFC493] border border-[#C6A66B]/40 rounded hover:bg-[#183D32] transition-colors"
                title="Go to Admin Dashboard"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            <Link
              to="/enquire"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider text-[#102820] bg-gradient-to-r from-[#C6A66B] to-[#DFC493] hover:from-[#DFC493] hover:to-[#C6A66B] shadow-sm hover:shadow transition-all duration-200 whitespace-nowrap shrink-0"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Enquire Now</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/enquire"
              className="sm:hidden px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider text-[#102820] bg-[#C6A66B]"
            >
              Enquire
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#F8F5EF] hover:bg-[#183D32] focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#183D32] border-b border-[#C6A66B]/30 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#102820] text-[#DFC493] font-semibold'
                    : 'text-[#F8F5EF]/80 hover:bg-[#102820] hover:text-[#F8F5EF]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#C6A66B]/20 flex flex-col gap-2">
            <Link
              to="/enquire"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-md text-sm font-semibold uppercase tracking-wider text-[#102820] bg-gradient-to-r from-[#C6A66B] to-[#DFC493]"
            >
              Check Availability & Enquire
            </Link>

            <a
              href="tel:+919450023456"
              className="flex items-center justify-center gap-2 w-full py-2 text-sm text-[#F8F5EF]/80 hover:text-white"
            >
              <Phone className="w-4 h-4 text-[#C6A66B]" />
              <span>Call Owner: +91 94500 23456</span>
            </a>

            <div className="pt-2 text-center">
              <Link
                to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-[#C6A66B] hover:underline"
              >
                {isAuthenticated ? 'Admin Dashboard' : 'Owner Portal Sign In'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
