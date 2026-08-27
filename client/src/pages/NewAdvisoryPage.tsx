import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Button, Input, Select, Textarea, Card } from '../components/ui';
import { MapPin, TestTube2, Sun, Droplets, HeartHandshake, ShieldAlert } from 'lucide-react';

export const NewAdvisoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<any>({});

  // Controlled form state
  const [formData, setFormData] = useState({
    farmName: '',
    country: '',
    state: '',
    district: '',
    soilType: 'loamy',
    soilPH: '',
    landArea: '',
    landUnit: 'acres',
    season: '',
    averageTemperature: '',
    rainfall: 'moderate',
    waterAvailability: 'moderate',
    irrigationMethod: 'drip',
    previousCrop: '',
    farmingGoal: 'profit',
    preferredCropCategory: 'vegetables',
    additionalObservations: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear validation error when editing field
    if (validationErrors[id]) {
      setValidationErrors((prev: any) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    // Client-side validations
    const errors: any = {};
    if (!formData.farmName.trim()) errors.farmName = 'Farm Name is required';
    if (!formData.country.trim()) errors.country = 'Country is required';
    if (!formData.state.trim()) errors.state = 'State/Region is required';
    if (!formData.district.trim()) errors.district = 'District/City is required';
    if (!formData.season.trim()) errors.season = 'Season is required';
    
    const landNum = parseFloat(formData.landArea);
    if (isNaN(landNum) || landNum <= 0) {
      errors.landArea = 'Land area must be a positive number';
    }

    if (formData.soilPH !== '') {
      const phNum = parseFloat(formData.soilPH);
      if (isNaN(phNum) || phNum < 0 || phNum > 14) {
        errors.soilPH = 'pH must be between 0 and 14';
      }
    }

    if (formData.averageTemperature !== '') {
      const tempNum = parseFloat(formData.averageTemperature);
      if (isNaN(tempNum) || tempNum < -20 || tempNum > 60) {
        errors.averageTemperature = 'Temperature must be between -20 and 60 °C';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // Prepare payload converting inputs to numbers/nulls where required
      const payload = {
        ...formData,
        landArea: parseFloat(formData.landArea),
        soilPH: formData.soilPH !== '' ? parseFloat(formData.soilPH) : null,
        averageTemperature: formData.averageTemperature !== '' ? parseFloat(formData.averageTemperature) : null,
        previousCrop: formData.previousCrop.trim() || null,
        additionalObservations: formData.additionalObservations.trim() || null,
      };

      const res = await api.createAdvisory(payload);
      if (res.success && res.data) {
        navigate(`/advisory/${res.data.id}`);
      } else {
        setError(res.message || 'API rejected request. Please check inputs.');
      }
    } catch (err: any) {
      console.error('Error creating advisory:', err);
      setError(err.message || 'Unable to generate agricultural advisory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const soilTypeOptions = [
    { value: 'alluvial', label: 'Alluvial Soil' },
    { value: 'black', label: 'Black Cotton Soil' },
    { value: 'red', label: 'Red Soil' },
    { value: 'laterite', label: 'Laterite Soil' },
    { value: 'sandy', label: 'Sandy Soil' },
    { value: 'loamy', label: 'Loamy Soil' },
    { value: 'clay', label: 'Clayey Soil' },
    { value: 'silty', label: 'Silty Soil' },
    { value: 'other', label: 'Other / Mixed Soil' },
  ];

  const landUnitOptions = [
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' },
  ];

  const rainfallOptions = [
    { value: 'low', label: 'Low Rainfall' },
    { value: 'moderate', label: 'Moderate Rainfall' },
    { value: 'high', label: 'High Rainfall' },
    { value: 'unknown', label: 'Unknown Rainfall Pattern' },
  ];

  const waterOptions = [
    { value: 'low', label: 'Low Water availability' },
    { value: 'moderate', label: 'Moderate availability' },
    { value: 'high', label: 'High/Abundant availability' },
    { value: 'rainfed', label: 'Rainfed only' },
    { value: 'unknown', label: 'Unknown / Uncertain' },
  ];

  const irrigationOptions = [
    { value: 'drip', label: 'Drip Irrigation' },
    { value: 'sprinkler', label: 'Sprinkler System' },
    { value: 'flood', label: 'Flood Irrigation' },
    { value: 'canal', label: 'Canal Supply' },
    { value: 'borewell', label: 'Borewell / Tube well' },
    { value: 'rainfed', label: 'Rainfed (No artificial irrigation)' },
    { value: 'mixed', label: 'Mixed Irrigation' },
    { value: 'none', label: 'None (Dryland)' },
    { value: 'unknown', label: 'Unknown' },
  ];

  const farmingGoalOptions = [
    { value: 'profit', label: 'Maximize Economic Profit' },
    { value: 'food', label: 'Food Security / Self Consumption' },
    { value: 'low-water', label: 'Water conservation' },
    { value: 'short-duration', label: 'Short Growing Cycles' },
    { value: 'soil-improvement', label: 'Soil Health Improvement' },
    { value: 'crop-rotation', label: 'Crop Rotation Cycle' },
    { value: 'mixed', label: 'Mixed Farming Goals' },
    { value: 'other', label: 'Other Farming Goals' },
  ];

  const cropCategoryOptions = [
    { value: 'cereals', label: 'Cereals (Rice, Wheat, Maize, etc.)' },
    { value: 'pulses', label: 'Pulses (Lentils, Beans, Chickpeas, etc.)' },
    { value: 'oilseeds', label: 'Oilseeds (Mustard, Groundnut, Soy, etc.)' },
    { value: 'vegetables', label: 'Vegetables (Tomato, Onion, Leafy greens)' },
    { value: 'fruits', label: 'Fruits (Mango, Banana, Citrus)' },
    { value: 'spices', label: 'Spices (Chili, Turmeric, Ginger)' },
    { value: 'commercial crops', label: 'Commercial Crops (Cotton, Sugarcane)' },
    { value: 'fiber crops', label: 'Fiber Crops (Jute, Hemp)' },
    { value: 'fodder crops', label: 'Fodder Crops (Alfalfa, Clover)' },
    { value: 'plantation crops', label: 'Plantation Crops (Coffee, Tea, Coconut)' },
    { value: 'other', label: 'Other Crop Category' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900">Generate Crop Advisory</h1>
        <p className="text-sm text-slate-500">Provide details about your farm environment to receive AI crop suitabilities.</p>
      </div>

      {error && (
        <Card className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex gap-2">
          <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
          <div className="text-sm">{error}</div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: LOCATION */}
        <Card className="p-6 bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="h-5 w-5 text-forest-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Location Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="farmName"
              label="Farm / Plot Name"
              placeholder="e.g. North Fields Lot B"
              value={formData.farmName}
              onChange={handleChange}
              error={validationErrors.farmName}
              required
            />
            <Input
              id="country"
              label="Country"
              placeholder="e.g. India"
              value={formData.country}
              onChange={handleChange}
              error={validationErrors.country}
              required
            />
            <Input
              id="state"
              label="State / Province"
              placeholder="e.g. Telangana"
              value={formData.state}
              onChange={handleChange}
              error={validationErrors.state}
              required
            />
            <Input
              id="district"
              label="District / City"
              placeholder="e.g. Medak"
              value={formData.district}
              onChange={handleChange}
              error={validationErrors.district}
              required
            />
          </div>
        </Card>

        {/* SECTION 2: SOIL & LAND */}
        <Card className="p-6 bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <TestTube2 className="h-5 w-5 text-forest-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Soil & Land Parameters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="soilType"
              label="Primary Soil Type"
              options={soilTypeOptions}
              value={formData.soilType}
              onChange={handleChange}
            />
            <Input
              id="soilPH"
              type="number"
              step="0.1"
              label="Soil pH"
              placeholder="e.g. 6.5 (0-14, leave blank if unknown)"
              value={formData.soilPH}
              onChange={handleChange}
              error={validationErrors.soilPH}
            />
            <Input
              id="landArea"
              type="number"
              step="0.01"
              label="Land Area Size"
              placeholder="e.g. 2.5"
              value={formData.landArea}
              onChange={handleChange}
              error={validationErrors.landArea}
              required
            />
            <Select
              id="landUnit"
              label="Area Measurement Unit"
              options={landUnitOptions}
              value={formData.landUnit}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* SECTION 3: CLIMATE */}
        <Card className="p-6 bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sun className="h-5 w-5 text-forest-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Climate & Season Parameters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              id="season"
              label="Farming Season"
              placeholder="e.g. Kharif / Autumn"
              value={formData.season}
              onChange={handleChange}
              error={validationErrors.season}
              required
            />
            <Input
              id="averageTemperature"
              type="number"
              step="0.5"
              label="Average Temperature (°C)"
              placeholder="e.g. 28.5 (Optional)"
              value={formData.averageTemperature}
              onChange={handleChange}
              error={validationErrors.averageTemperature}
            />
            <Select
              id="rainfall"
              label="Expected Rainfall"
              options={rainfallOptions}
              value={formData.rainfall}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* SECTION 4: WATER & IRRIGATION */}
        <Card className="p-6 bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Droplets className="h-5 w-5 text-forest-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Water Security</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="waterAvailability"
              label="Water Resource Availability"
              options={waterOptions}
              value={formData.waterAvailability}
              onChange={handleChange}
            />
            <Select
              id="irrigationMethod"
              label="Primary Irrigation Method"
              options={irrigationOptions}
              value={formData.irrigationMethod}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* SECTION 5: CROP PREFERENCES & GOALS */}
        <Card className="p-6 bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HeartHandshake className="h-5 w-5 text-forest-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Farming Goals & Preferences</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="previousCrop"
              label="Previously Cultivated Crop"
              placeholder="e.g. Groundnut / Rice (Optional)"
              value={formData.previousCrop}
              onChange={handleChange}
            />
            <Select
              id="farmingGoal"
              label="Primary Farming Objective"
              options={farmingGoalOptions}
              value={formData.farmingGoal}
              onChange={handleChange}
            />
            <Select
              id="preferredCropCategory"
              label="Preferred Crop Category"
              options={cropCategoryOptions}
              value={formData.preferredCropCategory}
              onChange={handleChange}
              className="sm:col-span-2"
            />
            <Textarea
              id="additionalObservations"
              label="Additional Observations / Constraints"
              placeholder="Write any extra observations, details about slope, market proximity, pest history, or specific fertilizers..."
              rows={4}
              value={formData.additionalObservations}
              onChange={handleChange}
              error={validationErrors.additionalObservations}
              className="sm:col-span-2"
            />
          </div>
        </Card>

        {/* SUBMIT BUTTON */}
        <div className="text-right">
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto font-semibold px-8 py-3 text-white rounded-xl"
            loading={loading}
          >
            Generate AI Advisory Recommendations
          </Button>
        </div>
      </form>
    </div>
  );
};
