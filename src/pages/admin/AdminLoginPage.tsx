import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email.trim(), password);
      setIsLoading(false);
      if (res.success) {
        toast.success('Welcome back, Proprietor!');
        navigate(from, { replace: true });
      } else {
        setErrorMsg(res.error || 'Authentication failed.');
      }
    }, 400);
  };

  const fillDemoCredentials = () => {
    setEmail('admin@knlawn.com');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#102820] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img
          src="/src/assets/images/hero_wedding_lawn_1792477779485.jpg"
          alt="Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-[#C6A66B]/30 overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-[#183D32] p-8 text-center text-white border-b border-[#C6A66B]/30">
          <div className="w-12 h-12 rounded-full border border-[#C6A66B] bg-[#102820] text-[#DFC493] flex items-center justify-center font-display text-xl font-bold mx-auto mb-3">
            KN
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#F8F5EF]">
            K.N. Lawn Management
          </h1>
          <p className="text-xs text-white/75 mt-1">
            Owner & Administration Workspace
          </p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@knlawn.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#102820] bg-gradient-to-r from-[#C6A66B] to-[#DFC493] hover:from-[#DFC493] hover:to-[#C6A66B] shadow transition-all duration-200 disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Reviewer / Demo Credentials Helper */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Prototype Demo Credentials:</span>
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-semibold text-[#183D32] hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="font-mono text-[11px] text-stone-700 bg-white p-2 rounded border border-stone-200 space-y-0.5">
              <div>Email: <strong>admin@knlawn.com</strong></div>
              <div>Pass: <strong>admin123</strong></div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-[#183D32]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
