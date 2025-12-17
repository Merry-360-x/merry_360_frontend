-- Add missing columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS loyalty_tier text DEFAULT 'bronze';

-- Update existing profiles to have loyalty points
UPDATE public.profiles 
SET loyalty_points = 0, loyalty_tier = 'bronze'
WHERE loyalty_points IS NULL;

-- Show result
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
