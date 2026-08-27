import { Request, Response, NextFunction } from 'express';
import { User, SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClientForUser } from '../services/supabase/supabaseService';

export interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
  supabase?: SupabaseClient;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      });
    }

    const token = authHeader.split(' ')[1];
    const supabaseClient = createSupabaseClientForUser(token);
    
    // Verify token validity by fetching user details from Supabase Auth
    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authorization token',
      });
    }

    req.user = user;
    req.token = token;
    req.supabase = supabaseClient;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed due to internal error',
    });
  }
};
