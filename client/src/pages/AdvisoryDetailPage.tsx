import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Card, Badge, Button, LoadingSpinner } from '../components/ui';
import {
  MapPin,
  Calendar,
  Layers,
  Thermometer,
  Droplets,
  Sprout,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Info,
  Wrench,
  Leaf,
  Trash2,
} from 'lucide-react';

export const AdvisoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [advisory, setAdvisory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAdvisory();
    }
  }, [id]);

  const fetchAdvisory = async () => {
    setLoading(true);
    try {
      const res = await api.getAdvisory(id!);
      if (res.success && res.data) {
        setAdvisory(res.data);
      } else {
        setError('Advisory not found');
      }
    } catch (err: any) {
      console.error('Error fetching advisory:', err);
      setError(err.message || 'Failed to load advisory details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      const res = await api.deleteAdvisory(id);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to delete advisory:', err);
      alert('Failed to delete advisory. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="text-center py-12 max-w-md mx-auto space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Detail Load Failed</h2>
        <p className="text-sm text-slate-500">{error || 'Unable to retrieve this advisory record.'}</p>
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const { aiResponse } = advisory;

  const getSuitabilityColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'excellent':
        return 'emerald';
      case 'good':
        return 'forest';
      case 'moderate':
        return 'yellow';
      case 'low':
        return 'earth';
      default:
        return 'red';
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-forest-600 bg-forest-50 border-forest-200';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-8">
      {/* Header section with back navigation and delete actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        {!deleteConfirm ? (
          <Button
            variant="outline"
            className="flex items-center gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => setDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Advisory</span>
          </Button>
        ) : (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg p-2">
            <span className="text-xs text-red-700 font-semibold px-2">Are you sure?</span>
            <Button
              variant="danger"
              size="sm"
              className="py-1 px-3 text-xs"
              loading={deleteLoading}
              onClick={handleDelete}
            >
              Confirm
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="py-1 px-3 text-xs bg-white text-slate-700"
              onClick={() => setDeleteConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Main Advisory Title Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="forest" className="capitalize px-3 py-1 font-semibold text-xs">
              {advisory.preferredCropCategory} preferred
            </Badge>
            <span className="text-xs text-slate-400">
              Generated {new Date(advisory.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{advisory.farmName}</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{advisory.district}, {advisory.state}, {advisory.country}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 rounded-2xl p-4 md:p-6 shrink-0 border border-slate-100">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Season</span>
            <span className="text-sm font-bold text-slate-700 capitalize mt-1 block flex justify-center items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-forest-500" /> {advisory.season}
            </span>
          </div>
          <div className="text-center border-l border-slate-200 pl-4">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Soil</span>
            <span className="text-sm font-bold text-slate-700 capitalize mt-1 block flex justify-center items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-earth-500" /> {advisory.soilType}
            </span>
          </div>
          <div className="text-center border-l border-slate-200 pl-4">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">pH</span>
            <span className="text-sm font-bold text-slate-700 mt-1 block">
              {advisory.soilPH !== null ? advisory.soilPH : 'Unknown'}
            </span>
          </div>
          <div className="text-center border-l border-slate-200 pl-4">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Land Size</span>
            <span className="text-sm font-bold text-slate-700 mt-1 block capitalize">
              {advisory.landArea} {advisory.landUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Overview assessment & AI generated summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">AI Assessment Summary</h2>
          <Card className="p-6 bg-white border-slate-100 shadow-sm space-y-4">
            <div className="flex gap-3">
              <Info className="h-6 w-6 text-forest-600 shrink-0 mt-0.5" />
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed text-sm">{aiResponse.summary}</p>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Overall Soil & Climate Compatibility</h4>
                  <p className="text-slate-800 font-medium text-sm">{aiResponse.overallAssessment}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Environmental conditions input overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Environmental Input</h2>
          <Card className="p-5 bg-white border-slate-100 shadow-sm space-y-3.5 text-sm">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <span className="text-slate-400 flex items-center gap-1.5"><Thermometer className="h-4 w-4" /> Avg Temperature</span>
              <span className="font-bold text-slate-700">{advisory.averageTemperature ? `${advisory.averageTemperature} °C` : 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <span className="text-slate-400 flex items-center gap-1.5"><Droplets className="h-4 w-4" /> Rainfall level</span>
              <span className="font-bold text-slate-700 capitalize">{advisory.rainfall}</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <span className="text-slate-400 flex items-center gap-1.5"><Droplets className="h-4 w-4" /> Water Availability</span>
              <span className="font-bold text-slate-700 capitalize">{advisory.waterAvailability}</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <span className="text-slate-400 flex items-center gap-1.5"><Wrench className="h-4 w-4" /> Irrigation Method</span>
              <span className="font-bold text-slate-700 capitalize">{advisory.irrigationMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5"><Leaf className="h-4 w-4" /> Previous Crop</span>
              <span className="font-bold text-slate-700 capitalize">{advisory.previousCrop || 'None'}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* RECOMMENDED CROPS DETAILS */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Recommended Crops</h2>

        <div className="space-y-8">
          {aiResponse.recommendedCrops.map((crop: any, index: number) => {
            const suitColor = getSuitabilityColor(crop.suitabilityLevel);
            return (
              <Card key={crop.cropName} className="p-6 sm:p-8 bg-white border border-slate-100 shadow-md rounded-3xl space-y-6 relative overflow-hidden">
                {/* Visual rank decorator */}
                <div className="absolute right-0 top-0 h-16 w-16 bg-forest-50 flex items-center justify-center rounded-bl-3xl border-l border-b border-slate-100 font-bold text-forest-700 text-lg">
                  #{index + 1}
                </div>

                {/* Crop header: Name, suitability indicators */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="h-14 w-14 rounded-2xl bg-forest-50 text-forest-600 flex items-center justify-center shrink-0 border border-forest-100">
                    <Leaf className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{crop.cropName}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant={suitColor} className="capitalize text-xs font-semibold px-2.5 py-0.5">
                        {crop.suitabilityLevel} Suitability
                      </Badge>
                      <Badge variant="neutral" className="text-[10px] capitalize">
                        Confidence: {crop.confidence}
                      </Badge>
                    </div>
                  </div>

                  {/* Suitability score circle */}
                  <div className="sm:ml-auto flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Suitability Score</span>
                    <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center font-extrabold text-sm ${getScoreColorClass(crop.suitabilityScore)}`}>
                      {crop.suitabilityScore}%
                    </div>
                  </div>
                </div>

                {/* Suitability details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  {/* Column 1: Core details */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">Why Recommended</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                        {crop.whyRecommended.map((r: string, idx: number) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">Soil Compatibility</h4>
                      <p className="text-slate-700 text-xs font-medium">{crop.soilSuitability.assessment}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">pH: {crop.soilSuitability.pHCompatibility}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">Climate Compatibility</h4>
                      <p className="text-slate-700 text-xs font-medium">{crop.climateSuitability.assessment}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">Temp: {crop.climateSuitability.temperatureCompatibility}</p>
                      <p className="text-slate-500 text-[10px]">Rain: {crop.climateSuitability.rainfallCompatibility}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">Estimated Growing Duration</h4>
                      <p className="text-slate-700 text-xs font-bold">{crop.estimatedGrowingDuration}</p>
                    </div>
                  </div>

                  {/* Column 2: Cultivation & Guidance */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                        <Sprout className="h-4 w-4 text-forest-600" /> Cultivation Guidance
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs leading-relaxed">
                        {crop.cultivationGuidance.map((g: string, idx: number) => (
                          <li key={idx}>{g}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                        <Wrench className="h-4 w-4 text-forest-600" /> Fertilizer & Irrigation
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Irrigation Requirement</span>
                          <span className="text-xs text-slate-600 leading-relaxed font-semibold capitalize flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-blue-500" /> {crop.waterRequirement} requirement — <span className="font-medium text-slate-500">{crop.irrigationGuidance}</span>
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fertilizer Considerations</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px] mt-1 pl-1">
                            {crop.fertilizerGuidance.map((f: string, idx: number) => (
                              <li key={idx}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Risks & Sustainability */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" /> Pest & Disease Warnings
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                        {crop.pestAndDiseaseRisks.map((p: string, idx: number) => (
                          <li key={idx} className="text-red-700 font-medium">{p}</li>
                        ))}
                      </ul>
                    </div>
                    {crop.majorRisks && crop.majorRisks.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                          <ShieldCheck className="h-4 w-4 text-amber-500" /> Environmental Risks
                        </h4>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-xs">
                          {crop.majorRisks.map((r: string, idx: number) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                        <Leaf className="h-4 w-4 text-forest-600" /> Sustainability & Rotation
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                        {crop.sustainabilityNotes.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ADDITIONAL GUIDANCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* General recommendations */}
        {aiResponse.generalRecommendations && aiResponse.generalRecommendations.length > 0 && (
          <Card className="p-6 bg-white border-slate-100 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Sprout className="h-5 w-5 text-forest-600" /> General Agricultural Advice
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-sm">
              {aiResponse.generalRecommendations.map((r: string, idx: number) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Gaps and professional verification needed */}
        <Card className="p-6 bg-white border-slate-100 shadow-sm space-y-4">
          {aiResponse.informationGaps && aiResponse.informationGaps.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Identified Information Gaps
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                {aiResponse.informationGaps.map((g: string, idx: number) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          )}

          {aiResponse.professionalVerificationNeeded && aiResponse.professionalVerificationNeeded.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-forest-600" /> Required Professional Verification
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                {aiResponse.professionalVerificationNeeded.map((v: string, idx: number) => (
                  <li key={idx}>{v}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      {/* SYSTEM DISCLAIMER */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 flex items-start gap-4">
        <ShieldCheck className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900">Crop Advisor Legal Disclaimer</h4>
          <p className="mt-1.5 text-xs text-amber-800 leading-relaxed">
            {aiResponse.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
