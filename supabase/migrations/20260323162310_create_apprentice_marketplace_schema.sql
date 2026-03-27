/*
  # Create Apprentice Marketplace Schema

  ## Overview
  This migration sets up the complete database schema for a marketplace connecting apprentices 
  with contractors and private users in Nigeria.

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `user_type` (text) - Either 'apprentice' or 'employer'
  - `phone` (text) - Contact phone number
  - `location` (text) - Location in Nigeria
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `apprentice_profiles`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to profiles
  - `skills` (text array) - List of skills
  - `experience_years` (integer) - Years of experience
  - `hourly_rate` (numeric) - Hourly rate in Naira
  - `contract_rate` (numeric) - Contract/project rate in Naira
  - `bio` (text) - Professional biography
  - `portfolio_links` (text array) - Links to previous work
  - `availability` (text) - Availability status
  - `rating` (numeric) - Average rating (0-5)
  - `total_reviews` (integer) - Total number of reviews
  - `total_jobs` (integer) - Total completed jobs
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `jobs`
  - `id` (uuid, primary key)
  - `employer_id` (uuid, foreign key) - Links to profiles
  - `title` (text) - Job title
  - `description` (text) - Job description
  - `skills_required` (text array) - Required skills
  - `location` (text) - Job location
  - `job_type` (text) - 'hourly' or 'contract'
  - `budget_min` (numeric) - Minimum budget in Naira
  - `budget_max` (numeric) - Maximum budget in Naira
  - `duration` (text) - Expected duration
  - `status` (text) - 'open', 'in_progress', 'completed', 'cancelled'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `bookings`
  - `id` (uuid, primary key)
  - `job_id` (uuid, foreign key) - Links to jobs
  - `apprentice_id` (uuid, foreign key) - Links to profiles
  - `employer_id` (uuid, foreign key) - Links to profiles
  - `status` (text) - 'pending', 'accepted', 'rejected', 'completed', 'cancelled'
  - `message` (text) - Proposal message from apprentice
  - `proposed_rate` (numeric) - Proposed rate
  - `start_date` (date) - Proposed start date
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `reviews`
  - `id` (uuid, primary key)
  - `booking_id` (uuid, foreign key) - Links to bookings
  - `reviewer_id` (uuid, foreign key) - Who wrote the review
  - `reviewee_id` (uuid, foreign key) - Who is being reviewed
  - `rating` (integer) - Rating 1-5
  - `comment` (text) - Review text
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can read their own profiles
  - Users can update their own profiles
  - Apprentices can manage their apprentice profiles
  - Employers can create and manage jobs
  - Anyone can view public apprentice profiles and open jobs
  - Users can create bookings and view their own bookings
  - Users involved in a booking can create reviews
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('apprentice', 'employer')),
  phone text,
  location text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create apprentice_profiles table
CREATE TABLE IF NOT EXISTS apprentice_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skills text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  hourly_rate numeric(10,2) DEFAULT 0,
  contract_rate numeric(10,2) DEFAULT 0,
  bio text DEFAULT '',
  portfolio_links text[] DEFAULT '{}',
  availability text DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
  rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  total_jobs integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE apprentice_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view apprentice profiles"
  ON apprentice_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Apprentices can insert their own profile"
  ON apprentice_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_id
      AND profiles.id = auth.uid()
      AND profiles.user_type = 'apprentice'
    )
  );

CREATE POLICY "Apprentices can update their own profile"
  ON apprentice_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_id
      AND profiles.id = auth.uid()
    )
  );

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  skills_required text[] DEFAULT '{}',
  location text NOT NULL,
  job_type text NOT NULL CHECK (job_type IN ('hourly', 'contract')),
  budget_min numeric(10,2) NOT NULL,
  budget_max numeric(10,2) NOT NULL,
  duration text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'open' OR employer_id = auth.uid());

CREATE POLICY "Employers can create jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = employer_id
      AND profiles.id = auth.uid()
      AND profiles.user_type = 'employer'
    )
  );

CREATE POLICY "Employers can update their own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers can delete their own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (employer_id = auth.uid());

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  apprentice_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  employer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  message text,
  proposed_rate numeric(10,2) NOT NULL,
  start_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (apprentice_id = auth.uid() OR employer_id = auth.uid());

CREATE POLICY "Apprentices can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    apprentice_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'apprentice'
    )
  );

CREATE POLICY "Involved users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (apprentice_id = auth.uid() OR employer_id = auth.uid())
  WITH CHECK (apprentice_id = auth.uid() OR employer_id = auth.uid());

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for their bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND (bookings.apprentice_id = auth.uid() OR bookings.employer_id = auth.uid())
      AND bookings.status = 'completed'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_apprentice_profiles_user_id ON apprentice_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_apprentice_profiles_rating ON apprentice_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_bookings_apprentice_id ON bookings(apprentice_id);
CREATE INDEX IF NOT EXISTS idx_bookings_employer_id ON bookings(employer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_job_id ON bookings(job_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apprentice_profiles_updated_at BEFORE UPDATE ON apprentice_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();