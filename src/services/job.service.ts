import { supabase } from '../lib/supabase';
import { Job, JobInsert, JobUpdate, Booking, BookingInsert } from '../types/database.types';

export const jobService = {
  async getOpenJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles!jobs_employer_id_fkey(full_name, location)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getEmployerJobs(employerId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createJob(job: JobInsert) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateJob(jobId: string, updates: JobUpdate) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteJob(jobId: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
  },

  async createBooking(booking: BookingInsert) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getApprenticeBookings(apprenticeId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        job:jobs!bookings_job_id_fkey(title, description, location, job_type),
        employer:profiles!bookings_employer_id_fkey(full_name, phone)
      `)
      .eq('apprentice_id', apprenticeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getJobBookings(jobId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        apprentice:profiles!bookings_apprentice_id_fkey(full_name, location, phone),
        apprentice_profile:apprentice_profiles!bookings_apprentice_id_fkey(rating, experience_years, skills, hourly_rate, total_jobs, bio)
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
