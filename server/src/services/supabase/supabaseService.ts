import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env';

/**
 * Creates a Supabase client authenticated as a specific user using their Bearer JWT token.
 * This ensures all queries run under the user's identity and respect RLS policies.
 */
export const createSupabaseClientForUser = (accessToken: string) => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};

/**
 * Global admin/service client if needed for operations bypassing RLS (use with caution).
 * But we should prefer user-scoped clients to preserve security.
 */
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
