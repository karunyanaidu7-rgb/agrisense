import React, { useState } from 'react';
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui';
import { LayoutDashboard, PlusCircle, History, User as UserIcon, LogOut, Menu, X, Leaf } from 'lucide-react';

// ==========================================
// 1. Protected Route Guard
// ==========================================
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-500 font-medium">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but save the current location they tried to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ==========================================
// 2. Application Layout Wrapper
// ==========================================
export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Advisory', href: '/advisory/new', icon: PlusCircle },
    { name: 'History', href: '/history', icon: History },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar Header */}
      <header className="glass-navbar sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-forest-700 font-bold text-xl">
            <Leaf className="h-6 w-6 text-forest-600 fill-forest-50" />
            <span>AgriAdvise</span>
          </Link>

          {/* User profile indicator (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-slate-600 font-medium">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-red-600 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Burger menu trigger (Mobile) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-forest-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-forest-600 text-white shadow-md shadow-forest-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border border-slate-100 rounded-2xl p-4 space-y-1 shadow-md mb-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-forest-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <hr className="border-slate-100 my-2" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-transparent">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AgriAdvise AI Agricultural Systems. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-500 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-500 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-500 cursor-pointer">Agronomist Disclaimer</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
