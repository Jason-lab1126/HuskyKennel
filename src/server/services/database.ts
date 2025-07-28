import { createClient } from '@supabase/supabase-js';
import { HousingListing, UserPreferences, ChatMessage, LogEntry } from '../types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class DatabaseService {
  // Housing Listings
  async addListing(listing: HousingListing): Promise<HousingListing> {
    const { data, error } = await supabase
      .from('housing_listings')
      .insert([listing])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getListings(filters?: any): Promise<HousingListing[]> {
    let query = supabase.from('housing_listings').select('*');

    if (filters?.minRent) query = query.gte('rent', filters.minRent);
    if (filters?.maxRent) query = query.lte('rent', filters.maxRent);
    if (filters?.housingType) query = query.in('type', filters.housingType);
    if (filters?.petFriendly !== undefined) query = query.eq('petFriendly', filters.petFriendly);
    if (filters?.neighborhoods) query = query.in('neighborhood', filters.neighborhoods);

    const { data, error } = await query.order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getListingById(id: string): Promise<HousingListing | null> {
    const { data, error } = await supabase
      .from('housing_listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // User Preferences
  async savePreferences(preferences: UserPreferences): Promise<UserPreferences> {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert([preferences], { onConflict: 'userId' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Chat Messages
  async saveChatMessage(message: ChatMessage): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getChatHistory(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('userId', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Logs
  async addLog(log: LogEntry): Promise<LogEntry> {
    const { data, error } = await supabase
      .from('logs')
      .insert([log])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Storage
  async uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('housing-images')
      .upload(fileName, file, {
        contentType,
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('housing-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  // Batch operations
  async addListingsBatch(listings: HousingListing[]): Promise<HousingListing[]> {
    const { data, error } = await supabase
      .from('housing_listings')
      .insert(listings)
      .select();

    if (error) throw error;
    return data || [];
  }
}

export const db = new DatabaseService();