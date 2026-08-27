import { supabase } from '../lib/supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Utility helper to fetch auth headers containing the active user's JWT.
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  return headers;
}

/**
 * Handle HTTP response status and throw formatted error messages.
 */
async function handleResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }
  
  return data;
}

export const api = {
  /**
   * Health Check check endpoint
   */
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(res);
  },

  /**
   * Submit farm agricultural attributes to generate AI crop recommendations.
   */
  async createAdvisory(payload: any) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/advisories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  /**
   * Retrieve list of advisories created by the user.
   */
  async listAdvisories() {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/advisories`, {
      method: 'GET',
      headers,
    });
    return handleResponse(res);
  },

  /**
   * Retrieve details of a specific advisory.
   */
  async getAdvisory(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/advisories/${id}`, {
      method: 'GET',
      headers,
    });
    return handleResponse(res);
  },

  /**
   * Delete an advisory record.
   */
  async deleteAdvisory(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/advisories/${id}`, {
      method: 'DELETE',
      headers,
    });
    return handleResponse(res);
  },
};
