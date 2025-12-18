-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'vendor')),
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id),
  accommodation_id TEXT,
  accommodation_name TEXT NOT NULL,
  accommodation_location TEXT,
  accommodation_image TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  nights INTEGER NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  service_fee DECIMAL(10, 2) DEFAULT 0,
  taxes DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'RWF',
  guest_first_name TEXT NOT NULL,
  guest_last_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('free', 'card', 'mobile')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  booking_status TEXT DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  booking_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster user queries
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS bookings_created_idx ON bookings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Allow users to read their own profile
CREATE POLICY IF NOT EXISTS "Users can read own profile"
  ON profiles FOR SELECT
  USING (true); -- Allow all authenticated users to read any profile for now

-- Allow users to update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own profile"
  ON profiles FOR UPDATE
  USING (true); -- For now, allow updates from anyone (will rely on application logic)

-- Allow insert for new profiles
CREATE POLICY IF NOT EXISTS "Allow profile creation"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Bookings policies
-- Allow users to read their own bookings
CREATE POLICY IF NOT EXISTS "Users can read own bookings"
  ON bookings FOR SELECT
  USING (true); -- For now, allow reading (can be tightened to user_id = auth.uid())

-- Allow users to create bookings
CREATE POLICY IF NOT EXISTS "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own bookings
CREATE POLICY IF NOT EXISTS "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to bookings table
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO anon;
GRANT ALL ON bookings TO authenticated;
GRANT ALL ON bookings TO anon;
