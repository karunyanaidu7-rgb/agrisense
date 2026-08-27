import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Card, Badge, LoadingSpinner } from '../components/ui';
import { Search, MapPin, Calendar, Trash2, ChevronRight, Leaf, Eye } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [filteredAdvisories, setFilteredAdvisories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Deletion tracking
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, categoryFilter, advisories]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.listAdvisories();
      if (res.success && res.data) {
        setAdvisories(res.data);
      }
    } catch (err: any) {
      console.error('Error fetching advisories list:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let list = [...advisories];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.farmName.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q) ||
          a.state.toLowerCase().includes(q) ||
          a.district.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      list = list.filter((a) => a.preferredCropCategory.toLowerCase() === categoryFilter.toLowerCase());
    }

    setFilteredAdvisories(list);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid navigating to details page
    try {
      const res = await api.deleteAdvisory(id);
      if (res.success) {
        setAdvisories((prev) => prev.filter((a) => a.id !== id));
        setDeletingId(null);
      }
    } catch (err) {
      console.error('Failed to delete advisory:', err);
      alert('Failed to delete advisory. Please try again.');
    }
  };

  const getTopCrop = (advisory: any) => {
    const crops = advisory?.aiResponse?.recommendedCrops;
    if (crops && crops.length > 0) {
      return crops[0];
    }
    return null;
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'cereals', label: 'Cereals' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'oilseeds', label: 'Oilseeds' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'spices', label: 'Spices' },
    { value: 'commercial crops', label: 'Commercial Crops' },
    { value: 'fiber crops', label: 'Fiber Crops' },
    { value: 'fodder crops', label: 'Fodder Crops' },
    { value: 'plantation crops', label: 'Plantation Crops' },
    { value: 'other', label: 'Other' },
  ];

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900">Advisory History</h1>
        <p className="text-sm text-slate-500">Access, search, filter, and manage your previously generated advisories.</p>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 bg-white border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search farm name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
          />
        </div>
        <div className="w-full sm:w-60">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Advisory list */}
      {filteredAdvisories.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-slate-200 bg-white">
          <Leaf className="h-10 w-10 text-slate-300 mb-4 animate-pulse" />
          <h3 className="font-bold text-slate-700">No matching advisories</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm">
            Try adjusting your search criteria, selecting another crop category, or create a new advisory request.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAdvisories.map((adv) => {
            const topCrop = getTopCrop(adv);
            const isConfirmingDelete = deletingId === adv.id;

            return (
              <Card
                key={adv.id}
                className="hover:border-forest-200 transition-all group bg-white border border-slate-100 p-5 cursor-pointer"
                onClick={() => navigate(`/advisory/${adv.id}`)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-forest-700 transition">
                        {adv.farmName}
                      </h3>
                      <Badge variant="forest" className="capitalize text-[10px] px-2 py-0.5">
                        {adv.preferredCropCategory}
                      </Badge>
                      <span className="text-slate-400 text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(adv.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-1 truncate" title={`${adv.district}, ${adv.state}, ${adv.country}`}>
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{adv.district}, {adv.state}, {adv.country}</span>
                    </p>

                    {topCrop && (
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-500">Top Crop:</span>
                        <span className="text-xs font-semibold text-slate-800">{topCrop.cropName}</span>
                        <Badge variant="emerald" className="text-[10px]">
                          Score {topCrop.suitabilityScore}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-medium">({topCrop.suitabilityLevel} suitability)</span>
                      </div>
                    )}
                  </div>

                  {/* Actions column */}
                  <div className="flex items-center gap-4 self-center shrink-0">
                    {/* Inline Delete Guard */}
                    {!isConfirmingDelete ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(adv.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 transition hover:bg-red-50 rounded-lg"
                        title="Delete Advisory"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-red-50 rounded-lg p-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleDelete(adv.id, e)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-2 py-1 bg-white text-slate-700 border border-slate-200 rounded text-[10px] font-bold hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-xs text-forest-600 font-semibold group-hover:text-forest-700 transition">
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                      <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition duration-150" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
