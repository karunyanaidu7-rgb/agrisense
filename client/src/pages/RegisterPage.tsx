import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { Leaf } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already authenticated, redirect
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        // If email verification is enabled on Supabase, the user session might be null.
        // We'll show a message instructing them.
        if (data.session) {
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          setSuccess('Account created! Please check your email inbox for a confirmation link.');
        }
      }
    } catch (err: any) {
      setError('Failed to create account. Please try again.');
      console.error('Sign up exception:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4">
      <Link to="/" className="flex items-center gap-2 text-forest-700 font-bold text-2xl mb-8">
        <Leaf className="h-8 w-8 text-forest-600 fill-forest-50" />
        <span>AgriAdvise</span>
      </Link>

      <div className="w-full max-w-md">
        <Card className="shadow-lg border-slate-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Get Started</h2>
            <p className="mt-1.5 text-sm text-slate-500">Create an account for personalized crop advisory</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-3 text-sm mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="e.g. farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Register
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest-600 hover:text-forest-700">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
