export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          user_type: 'apprentice' | 'employer';
          phone: string | null;
          location: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          user_type: 'apprentice' | 'employer';
          phone?: string | null;
          location: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          user_type?: 'apprentice' | 'employer';
          phone?: string | null;
          location?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      apprentice_profiles: {
        Row: {
          id: string;
          user_id: string;
          skills: string[];
          experience_years: number;
          hourly_rate: number;
          contract_rate: number;
          bio: string;
          portfolio_links: string[];
          availability: 'available' | 'busy' | 'unavailable';
          rating: number;
          total_reviews: number;
          total_jobs: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skills?: string[];
          experience_years?: number;
          hourly_rate?: number;
          contract_rate?: number;
          bio?: string;
          portfolio_links?: string[];
          availability?: 'available' | 'busy' | 'unavailable';
          rating?: number;
          total_reviews?: number;
          total_jobs?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skills?: string[];
          experience_years?: number;
          hourly_rate?: number;
          contract_rate?: number;
          bio?: string;
          portfolio_links?: string[];
          availability?: 'available' | 'busy' | 'unavailable';
          rating?: number;
          total_reviews?: number;
          total_jobs?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          employer_id: string;
          title: string;
          description: string;
          skills_required: string[];
          location: string;
          job_type: 'hourly' | 'contract';
          budget_min: number;
          budget_max: number;
          duration: string | null;
          status: 'open' | 'in_progress' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employer_id: string;
          title: string;
          description: string;
          skills_required?: string[];
          location: string;
          job_type: 'hourly' | 'contract';
          budget_min: number;
          budget_max: number;
          duration?: string | null;
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employer_id?: string;
          title?: string;
          description?: string;
          skills_required?: string[];
          location?: string;
          job_type?: 'hourly' | 'contract';
          budget_min?: number;
          budget_max?: number;
          duration?: string | null;
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          job_id: string;
          apprentice_id: string;
          employer_id: string;
          status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
          message: string | null;
          proposed_rate: number;
          start_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          apprentice_id: string;
          employer_id: string;
          status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
          message?: string | null;
          proposed_rate: number;
          start_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          apprentice_id?: string;
          employer_id?: string;
          status?: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
          message?: string | null;
          proposed_rate?: number;
          start_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Profile = Tables<'profiles'>;
export type ApprenticeProfile = Tables<'apprentice_profiles'>;
export type Job = Tables<'jobs'>;
export type Booking = Tables<'bookings'>;
export type Review = Tables<'reviews'>;

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type ApprenticeProfileInsert = Database['public']['Tables']['apprentice_profiles']['Insert'];
export type ApprenticeProfileUpdate = Database['public']['Tables']['apprentice_profiles']['Update'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
export type JobUpdate = Database['public']['Tables']['jobs']['Update'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
export type BookingUpdate = Database['public']['Tables']['bookings']['Update'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];
