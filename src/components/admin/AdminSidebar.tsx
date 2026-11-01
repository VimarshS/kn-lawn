import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Image,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logout } = useAuth();
  const toast = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Events & Gallery', path: '/admin/events', icon: Image },
    { label: 'Availability Calendar', path: '/admin/availability', icon: CalendarDays },
    { label: 'Booking Enquiries', path: '/admin/enquiries', icon: Inbox },
    { label: 'Lawn Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out of admin workspace.');
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#102820] text-white p-4 flex items-center justify-between border-b border-[#C6A66B]/30 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#DFC493]" />
          <span className="font-display font-bold text-base text-[#F8F5EF]">K.N. Lawn Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-white hover:bg-white/10"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#102820] text-stone-200 border-r border-[#C6A66B]/30 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#183D32] border border-[#C6A66B] flex items-center justify-center text-[#DFC493] font-display font-bold">
                KN
              </div>
              <div>
                <div className="font-display font-bold text-lg text-white leading-none">
                  K.N. Lawn
                </div>
                <div className="text-[10px] text-[#DFC493] tracking-widest uppercase mt-1">
                  Management Portal
                </div>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1.5">
            {links.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[#183D32] text-[#DFC493] font-semibold border-l-2 border-[#C6A66B]'
                      : 'text-stone-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#DFC493]' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom user & exit */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-stone-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#DFC493]" />
              <span>View Live Website</span>
            </span>
          </Link>

          <div className="px-3.5 py-2 rounded-lg bg-black/20 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">
                {adminUser?.name}
              </div>
              <div className="text-[10px] text-stone-400">
                {adminUser?.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-stone-400 hover:text-red-400 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
};
