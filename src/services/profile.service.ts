import { supabase } from '../lib/supabase';
import { Profile, ApprenticeProfile, ProfileInsert, ApprenticeProfileUpdate } from '../types/database.types';

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async getApprenticeProfile(userId: string): Promise<ApprenticeProfile | null> {
    const { data, error } = await supabase
      .from('apprentice_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching apprentice profile:', error);
      return null;
    }
    return data;
  },

  async updateApprenticeProfile(userId: string, updates: ApprenticeProfileUpdate) {
    const { data, error } = await supabase
      .from('apprentice_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createProfile(profile: ProfileInsert) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createApprenticeProfile(userId: string) {
    const { data, error } = await supabase
      .from('apprentice_profiles')
      .insert({ user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
