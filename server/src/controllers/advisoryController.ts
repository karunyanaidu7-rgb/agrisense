import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AdvisoryRequestSchema } from '../schemas';
import { generateCropAdvisory } from '../services/gemini/geminiService';

// Helper to convert database snake_case row to API camelCase object
const mapRowToAdvisory = (row: any) => {
  return {
    id: row.id,
    userId: row.user_id,
    farmName: row.farm_name,
    country: row.country,
    state: row.state,
    district: row.district,
    soilType: row.soil_type,
    soilPH: row.soil_ph ? parseFloat(row.soil_ph) : null,
    landArea: row.land_area ? parseFloat(row.land_area) : null,
    landUnit: row.land_unit,
    season: row.season,
    averageTemperature: row.average_temperature ? parseFloat(row.average_temperature) : null,
    rainfall: row.rainfall,
    waterAvailability: row.water_availability,
    irrigationMethod: row.irrigation_method,
    previousCrop: row.previous_crop,
    farmingGoal: row.farming_goal,
    preferredCropCategory: row.preferred_crop_category,
    additionalObservations: row.additional_observations,
    aiResponse: row.ai_response,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Create a new agricultural advisory.
 * 1. Validate request body with Zod
 * 2. Invoke Gemini AI Service
 * 3. Save the result into the Supabase database using the user's client context
 */
export const createAdvisory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.supabase || !req.user) {
      return res.status(500).json({
        success: false,
        message: 'Database connection or session context missing',
      });
    }

    const validation = AdvisoryRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: validation.error.format(),
      });
    }

    const reqBody = validation.data;

    // Call Gemini to generate crop advisory
    const aiResponse = await generateCropAdvisory(reqBody);

    // Save to Supabase using user-scoped client so RLS insert check is satisfied
    const { data: row, error: dbError } = await req.supabase
      .from('advisories')
      .insert({
        user_id: req.user.id,
        farm_name: reqBody.farmName,
        country: reqBody.country,
        state: reqBody.state,
        district: reqBody.district,
        soil_type: reqBody.soilType,
        soil_ph: reqBody.soilPH,
        land_area: reqBody.landArea,
        land_unit: reqBody.landUnit,
        season: reqBody.season,
        average_temperature: reqBody.averageTemperature,
        rainfall: reqBody.rainfall,
        water_availability: reqBody.waterAvailability,
        irrigation_method: reqBody.irrigationMethod,
        previous_crop: reqBody.previousCrop,
        farming_goal: reqBody.farmingGoal,
        preferred_crop_category: reqBody.preferredCropCategory,
        additional_observations: reqBody.additionalObservations,
        ai_response: aiResponse,
      })
      .select()
      .single();

    if (dbError || !row) {
      console.error('Database insertion error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Unable to save advisory. Database operation failed.',
      });
    }

    res.status(201).json({
      success: true,
      data: mapRowToAdvisory(row),
    });
  } catch (error: any) {
    console.error('Create advisory error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Unable to generate agricultural advisory. Please try again.',
    });
  }
};

/**
 * Get all advisories for the authenticated user (sorted newest first).
 */
export const getAdvisories = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.supabase) {
      return res.status(500).json({
        success: false,
        message: 'Database connection context missing',
      });
    }

    const { data: rows, error } = await req.supabase
      .from('advisories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch advisories error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve advisories.',
      });
    }

    const advisories = (rows || []).map(mapRowToAdvisory);

    res.json({
      success: true,
      data: advisories,
    });
  } catch (error) {
    console.error('Get advisories list error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred.',
    });
  }
};

/**
 * Get an advisory by ID.
 * Returns 404 if it does not exist or doesn't belong to the user.
 */
export const getAdvisoryById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.supabase) {
      return res.status(500).json({
        success: false,
        message: 'Database connection context missing',
      });
    }

    const { data: row, error } = await req.supabase
      .from('advisories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !row) {
      // 404 to avoid leaking information about IDs belonging to other users
      return res.status(404).json({
        success: false,
        message: 'Advisory not found',
      });
    }

    res.json({
      success: true,
      data: mapRowToAdvisory(row),
    });
  } catch (error) {
    console.error('Get advisory by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred.',
    });
  }
};

/**
 * Delete an advisory by ID.
 */
export const deleteAdvisory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.supabase) {
      return res.status(500).json({
        success: false,
        message: 'Database connection context missing',
      });
    }

    // Attempt to delete. RLS policy guarantees only rows where user_id matches will be deleted.
    // However, to ensure correct feedback, we should verify row existence first.
    const { data: exists, error: findError } = await req.supabase
      .from('advisories')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (findError || !exists) {
      return res.status(404).json({
        success: false,
        message: 'Advisory not found',
      });
    }

    const { error: deleteError } = await req.supabase
      .from('advisories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete advisory error:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete advisory.',
      });
    }

    res.json({
      success: true,
      message: 'Advisory deleted successfully',
    });
  } catch (error) {
    console.error('Delete advisory endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred.',
    });
  }
};
