import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Only create client if we have real credentials
export const supabase = (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder'))
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);

// Database operations
export const db = {
  async saveUserPreferences(preferences: any) {
    if (!supabase) {
      console.warn('Supabase not configured. Please update your .env file with actual Supabase credentials.');
      return Promise.resolve({ id: 'mock-id', ...preferences });
    }
    
    const { data, error } = await supabase
      .from('user_preferences')
      .insert([preferences])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getListings(filters?: any) {
    if (!supabase) {
      console.warn('Supabase not configured. Returning mock data.');
      return Promise.resolve([]);
    }
    
    let query = supabase.from('listings').select('*');

    if (filters?.minRent) query = query.gte('rent', filters.minRent);
    if (filters?.maxRent) query = query.lte('rent', filters.maxRent);
    if (filters?.housingType && filters.housingType.length > 0) query = query.in('type', filters.housingType);
    if (filters?.petFriendly !== undefined) query = query.eq('petFriendly', filters.petFriendly);
    if (filters?.furnished !== undefined) query = query.eq('furnished', filters.furnished);
    if (filters?.source && filters.source !== 'all') query = query.eq('source', filters.source);

    const { data, error } = await query.order('scraped_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async saveMatchResults(userId: string, results: any[]) {
    if (!supabase) {
      console.warn('Supabase not configured. Please update your .env file with actual Supabase credentials.');
      return Promise.resolve({ id: 'mock-id', user_id: userId, results, created_at: new Date() });
    }
    
    const { data, error } = await supabase
      .from('match_results')
      .insert([{ user_id: userId, results, created_at: new Date() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};