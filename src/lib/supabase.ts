import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database operations
export const db = {
    async saveUserPreferences(preferences: any) {
    const { data, error } = await supabase
      .from('user_preferences')
      .insert([preferences])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

    async getListings(filters?: any) {
    try {
      console.log('Fetching listings from Supabase...');

      // First, let's check if we can connect to Supabase
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase environment variables');
        throw new Error('Supabase configuration missing');
      }

      let query = supabase.from('listings').select('*');

      if (filters?.minRent) query = query.gte('rent', filters.minRent);
      if (filters?.maxRent) query = query.lte('rent', filters.maxRent);
      if (filters?.housingType && filters.housingType.length > 0) query = query.in('type', filters.housingType);
      if (filters?.petFriendly !== undefined) query = query.eq('petFriendly', filters.petFriendly);
      if (filters?.furnished !== undefined) query = query.eq('furnished', filters.furnished);
      if (filters?.source && filters.source !== 'all') query = query.eq('source', filters.source);

      const { data, error } = await query.order('scraped_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} listings from Supabase`);
      return data || [];
    } catch (error) {
      console.error('Error in getListings:', error);
      throw error;
    }
  },

    async saveMatchResults(userId: string, results: any[]) {
    const { data, error } = await supabase
      .from('match_results')
      .insert([{ user_id: userId, results, created_at: new Date() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};