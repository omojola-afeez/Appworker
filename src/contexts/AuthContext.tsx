import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types/database.types';
import { profileService } from '../services/profile.service';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  signUp: (email: string, password: string, userData: { full_name: string; user_type: 'apprentice' | 'employer'; phone: string; location: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshProfile = async () => {
    if (user) {
      try {
        const profileData = await profileService.getProfile(user.id);
        setProfile(profileData);
      } catch (err) {
        console.error('Error refreshing profile:', err);
      }
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          const profileData = await profileService.getProfile(currentUser.id);
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize auth'));
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    if (!isSupabaseConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const profileData = await profileService.getProfile(currentUser.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData: { full_name: string; user_type: 'apprentice' | 'employer'; phone: string; location: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from signup');

    try {
      await profileService.createProfile({
        id: data.user.id,
        email: email,
        full_name: userData.full_name,
        user_type: userData.user_type,
        phone: userData.phone,
        location: userData.location,
      });

      if (userData.user_type === 'apprentice') {
        await profileService.createApprenticeProfile(data.user.id);
      }
    } catch (profileError) {
      console.error('Profile creation error:', profileError);
      throw profileError;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
