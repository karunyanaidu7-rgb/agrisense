import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Card, Button, Badge, LoadingSpinner } from '../components/ui';
import { Plus, ChevronRight, FileSpreadsheet, MapPin, Thermometer, ShieldAlert, Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.listAdvisories();
      if (res.success && res.data) {
        setAdvisories(res.data);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard advisories:', err);
      setError(err.message || 'Failed to retrieve dashboard records. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const getTopCrop = (advisory: any) => {
    const crops = advisory?.aiResponse?.recommendedCrops;
    if (crops && crops.length > 0) {
      return crops[0];
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Statistics calculation
  const totalCount = advisories.length;
  
  // Find top categories
  const categories = advisories.map(a => a.preferredCropCategory);
  const topCategory = categories.length > 0 
    ? categories.sort((a, b) => categories.filter(v => v === a).length - categories.filter(v => v === b).length).pop()
    : 'None';

  const lastFarm = advisories.length > 0 ? advisories[0].farmName : 'No farms yet';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-forest-750 to-forest-900 text-white rounded-3xl p-8 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            Farmer Dashboard <Sparkles className="h-6 w-6 text-amber-300 fill-amber-300" />
          </h1>
          <p className="mt-1.5 text-sm text-forest-100 max-w-xl">
            Analyze your soil type, rainfall, and climate parameters using generative artificial intelligence to select optimized crops.
          </p>
        </div>
        <Link to="/advisory/new">
          <Button variant="secondary" className="flex items-center gap-2 px-6 py-3 font-semibold text-white">
            <Plus className="h-5 w-5" />
            <span>New Advisory</span>
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex gap-2">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <div>
            <h4 className="font-semibold">Unable to reach application API</h4>
            <p className="mt-0.5 text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 border-slate-100 shadow-sm p-6 bg-white">
          <div className="p-3 bg-forest-50 text-forest-600 rounded-xl">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Advisories</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{totalCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-slate-100 shadow-sm p-6 bg-white">
          <div className="p-3 bg-earth-50 text-earth-600 rounded-xl">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Farm Analyzed</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5 truncate max-w-[180px]" title={lastFarm}>
              {lastFarm}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-slate-100 shadow-sm p-6 bg-white">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Thermometer className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Preference</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5 capitalize">{topCategory}</p>
          </div>
        </Card>
      </div>

      {/* Recent Advisories & Form CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent advisories List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Advisories</h2>

          {advisories.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-slate-200">
              <div className="h-16 w-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                <FileSpreadsheet className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-slate-700">No advisories generated</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm">
                Get started by filling out the agricultural advisory form with details about your farm soil and climate.
              </p>
              <Link to="/advisory/new" className="mt-6">
                <Button variant="primary">Generate First Advisory</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {advisories.slice(0, 5).map((adv) => {
                const topCrop = getTopCrop(adv);
                return (
                  <Card
                    key={adv.id}
                    className="hover:border-forest-200 transition-all group p-5 bg-white border border-slate-100"
                    onClick={() => navigate(`/advisory/${adv.id}`)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800 group-hover:text-forest-700 transition">
                            {adv.farmName}
                          </h3>
                          <Badge variant="neutral" className="capitalize text-[10px]">
                            {adv.preferredCropCategory}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{adv.district}, {adv.state}, {adv.country}</span>
                        </p>
                        {topCrop && (
                          <div className="pt-2 flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Top Crop:</span>
                            <span className="text-xs font-semibold text-slate-700">{topCrop.cropName}</span>
                            <Badge variant="emerald" className="text-[10px]">
                              Score {topCrop.suitabilityScore}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-center shrink-0">
                        <span className="text-xs text-slate-400">
                          {new Date(adv.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-forest-600 transition transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                );
              })}

              {advisories.length > 5 && (
                <div className="text-center pt-2">
                  <Link to="/history" className="text-sm font-semibold text-forest-600 hover:text-forest-700 transition">
                    View Full Advisory History →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Informative Side Panel */}
        <div className="space-y-6">
          <Card className="bg-forest-50 border-forest-100 p-6">
            <h3 className="font-bold text-forest-900 mb-2">How AgriAdvise Works</h3>
            <ol className="space-y-3.5 text-xs text-forest-800 list-decimal list-inside pl-1 mt-4">
              <li>
                <span className="font-semibold text-forest-900">Define Conditions:</span> Provide details of location, soil pH, irrigation type, and land area.
              </li>
              <li>
                <span className="font-semibold text-forest-900">AI Suitability Scan:</span> Gemini validates parameters against crop databases and regional climates.
              </li>
              <li>
                <span className="font-semibold text-forest-900">Explainable Cultivation:</span> Review 3 to 5 crop suitability levels, fertilizer requirements, and risks.
              </li>
              <li>
                <span className="font-semibold text-forest-900">Agronomist Review:</span> Double check generated advice with agricultural officers before deployment.
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
};
