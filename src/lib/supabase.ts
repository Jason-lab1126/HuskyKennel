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
    let query = supabase.from('housing_listings').select('*');
    
    if (filters?.minRent) query = query.gte('rent', filters.minRent);
    if (filters?.maxRent) query = query.lte('rent', filters.maxRent);
    if (filters?.housingType) query = query.in('type', filters.housingType);
    if (filters?.petFriendly !== undefined) query = query.eq('petFriendly', filters.petFriendly);
    
    const { data, error } = await query.order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data || [];
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