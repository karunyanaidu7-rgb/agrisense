import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/ui';
import { User, Mail, Calendar, LogOut, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900">User Profile</h1>
        <p className="text-sm text-slate-500">Manage your farm advisor user account credentials and security settings.</p>
      </div>

      <Card className="p-6 bg-white border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="h-16 w-16 bg-forest-50 border border-forest-100 text-forest-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
            {user?.email?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Active Account</h3>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-slate-400 flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email Address
            </span>
            <span className="font-semibold text-slate-700">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-slate-400 flex items-center gap-2">
              <User className="h-4 w-4" /> Account ID
            </span>
            <span className="font-mono text-xs text-slate-500">{user?.id}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-slate-400 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Created Date
            </span>
            <span className="font-semibold text-slate-700">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Status
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-250">
              Verified Authenticated
            </span>
          </div>
        </div>

        <hr className="border-slate-100" />

        <div className="pt-2 text-right">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-semibold"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout from Session</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
