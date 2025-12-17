-- Fix RLS policies for profiles (allow authenticated users to manage their own)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Add missing columns to bookings for compatibility
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS check_in timestamp,
ADD COLUMN IF NOT EXISTS check_out timestamp,
ADD COLUMN IF NOT EXISTS property_id uuid,
ADD COLUMN IF NOT EXISTS guest_name text,
ADD COLUMN IF NOT EXISTS guest_email text,
ADD COLUMN IF NOT EXISTS guest_phone text,
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';

-- Show results
SELECT 'Profiles RLS updated' as status;
SELECT 'Bookings columns added' as status;
