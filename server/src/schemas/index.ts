import { z } from 'zod';

export const allowedSoilTypes = [
  'alluvial',
  'black',
  'red',
  'laterite',
  'sandy',
  'loamy',
  'clay',
  'silty',
  'other',
] as const;

export const allowedLandUnits = ['acres', 'hectares'] as const;

export const allowedRainfall = ['low', 'moderate', 'high', 'unknown'] as const;

export const allowedWaterAvailability = ['low', 'moderate', 'high', 'rainfed', 'unknown'] as const;

export const allowedIrrigationMethods = [
  'drip',
  'sprinkler',
  'flood',
  'canal',
  'borewell',
  'rainfed',
  'mixed',
  'none',
  'unknown',
] as const;

export const allowedFarmingGoals = [
  'food',
  'profit',
  'low-water',
  'short-duration',
  'soil-improvement',
  'crop-rotation',
  'mixed',
  'other',
] as const;

export const allowedCropCategories = [
  'cereals',
  'pulses',
  'oilseeds',
  'vegetables',
  'fruits',
  'spices',
  'commercial crops',
  'fiber crops',
  'fodder crops',
  'plantation crops',
  'other',
] as const;

export const allowedSuitabilityLevels = ['excellent', 'good', 'moderate', 'low', 'unsuitable'] as const;

export const allowedWaterRequirements = ['low', 'moderate', 'high', 'unknown'] as const;

export const allowedConfidences = ['high', 'medium', 'low'] as const;

// 1. Zod Schema for incoming Agricultural form inputs
export const AdvisoryRequestSchema = z.object({
  farmName: z.string().min(1, 'Farm Name is required').max(100, 'Farm Name cannot exceed 100 characters'),
  country: z.string().min(1, 'Country is required').max(100, 'Country cannot exceed 100 characters'),
  state: z.string().min(1, 'State/Region is required').max(100, 'State/Region cannot exceed 100 characters'),
  district: z.string().min(1, 'District/City is required').max(100, 'District/City cannot exceed 100 characters'),
  soilType: z.enum(allowedSoilTypes, {
    errorMap: () => ({ message: 'Invalid soil type selected' }),
  }),
  soilPH: z
    .union([z.number().min(0).max(14), z.null(), z.undefined()])
    .optional(),
  landArea: z.number().positive('Land area must be greater than 0'),
  landUnit: z.enum(allowedLandUnits, {
    errorMap: () => ({ message: 'Invalid land unit selected' }),
  }),
  season: z.string().min(1, 'Season is required').max(50),
  averageTemperature: z
    .number()
    .min(-20, 'Temperature is too low')
    .max(60, 'Temperature is too high')
    .optional()
    .nullable(),
  rainfall: z.enum(allowedRainfall, {
    errorMap: () => ({ message: 'Invalid rainfall option selected' }),
  }),
  waterAvailability: z.enum(allowedWaterAvailability, {
    errorMap: () => ({ message: 'Invalid water availability selected' }),
  }),
  irrigationMethod: z.enum(allowedIrrigationMethods, {
    errorMap: () => ({ message: 'Invalid irrigation method selected' }),
  }),
  previousCrop: z.string().max(100).optional().nullable(),
  farmingGoal: z.enum(allowedFarmingGoals, {
    errorMap: () => ({ message: 'Invalid farming goal selected' }),
  }),
  preferredCropCategory: z.enum(allowedCropCategories, {
    errorMap: () => ({ message: 'Invalid preferred crop category selected' }),
  }),
  additionalObservations: z
    .string()
    .max(2000, 'Additional observations must not exceed 2000 characters')
    .optional()
    .nullable(),
});

// 2. Zod Schema for Gemini AI structured JSON output validation
export const CropRecommendationSchema = z.object({
  cropName: z.string().min(1, 'Recommended crop name must not be empty'),
  suitabilityScore: z.number().min(0).max(100),
  suitabilityLevel: z.enum(allowedSuitabilityLevels),
  whyRecommended: z.array(z.string()),
  soilSuitability: z.object({
    assessment: z.string(),
    pHCompatibility: z.string(),
  }),
  climateSuitability: z.object({
    assessment: z.string(),
    temperatureCompatibility: z.string(),
    rainfallCompatibility: z.string(),
  }),
  waterRequirement: z.enum(allowedWaterRequirements),
  irrigationGuidance: z.string(),
  estimatedGrowingDuration: z.string(),
  cultivationGuidance: z.array(z.string()),
  fertilizerGuidance: z.array(z.string()),
  pestAndDiseaseRisks: z.array(z.string()),
  majorRisks: z.array(z.string()),
  sustainabilityNotes: z.array(z.string()),
  confidence: z.enum(allowedConfidences),
});

export const AIResponseSchema = z.object({
  summary: z.string(),
  overallAssessment: z.string(),
  recommendedCrops: z.array(CropRecommendationSchema).min(1, 'At least one crop recommendation is required'),
  generalRecommendations: z.array(z.string()),
  informationGaps: z.array(z.string()),
  professionalVerificationNeeded: z.array(z.string()),
  disclaimer: z.string(),
});

export type AdvisoryRequest = z.infer<typeof AdvisoryRequestSchema>;
export type AIResponse = z.infer<typeof AIResponseSchema>;
