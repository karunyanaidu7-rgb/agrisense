import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, ShieldAlert, Cpu, BarChart3, Database } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  // If user is already logged in, redirect them directly to their dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Landing Navbar */}
      <header className="glass-navbar sticky top-0 z-50 w-full px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 text-forest-700 font-bold text-xl">
            <Leaf className="h-6 w-6 text-forest-600 fill-forest-50" />
            <span>AgriAdvise</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-forest-600 transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-forest-600 text-white hover:bg-forest-700 transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-50 text-forest-700 border border-forest-100 mb-6">
              <Cpu className="h-3.5 w-3.5" />
              <span>Next-Gen Agricultural Intelligence</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              AI-Powered <span className="text-forest-600">Crop Advisory</span> for Smarter Farming
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-500 leading-relaxed">
              Input your local soil, water, climate, and farming goals to receive customized, evidence-based crop recommendations powered by Google Gemini. Enhance yields, optimize resources, and minimize agricultural risks.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-xl text-md font-semibold py-3.5 px-6 bg-forest-600 text-white hover:bg-forest-700 shadow-md shadow-forest-100 transition"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="rounded-xl text-md font-semibold py-3.5 px-6 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract leafy/nature design decoration */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none hidden lg:block">
          <svg className="h-full w-full object-cover" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50 0 C 70 30, 90 40, 100 100 L 100 0 Z" fill="#4c9066" />
          </svg>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Precision Cultivation Decisions
            </h2>
            <p className="mt-4 text-slate-500">
              AgriAdvise combines cutting-edge AI models with fundamental agronomy principles to support your agricultural decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <div className="h-12 w-12 bg-forest-100 text-forest-600 rounded-xl flex items-center justify-center mb-6">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Multi-Factor Analysis</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Evaluates soil pH, water availability, region-specific climate parameters, irrigation systems, and crop rotations.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <div className="h-12 w-12 bg-earth-100 text-earth-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Explainable Recommendations</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every recommended crop features a suitability score (0-100%), detailed compatibility insights, and a list of specific farming risks.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Risk Warnings & Guides</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Identifies pests, weather issues, cultivation difficulties, and suggests expert verification resources to preserve farm safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory Disclaimer section */}
      <section className="bg-slate-50 py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Important Advisory Disclaimer</h4>
              <p className="mt-1.5 text-xs text-amber-800 leading-relaxed">
                AgriAdvise is an artificial intelligence-powered advisory system designed for general guidance. Recommendation metrics are generated by Gemini models and do not guarantee crop yields, financial returns, or disease resistance. Always verify advisor plans with local extension officers, agronomists, or regulatory agencies before purchasing seeds or fertilizers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AgriAdvise AI Agricultural Systems. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-500 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-500 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
