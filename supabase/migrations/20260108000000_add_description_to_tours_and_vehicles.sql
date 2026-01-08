-- Add description column to tours and vehicles tables
-- This fixes the error: "Could not find the 'description' column of 'tours' in the schema cache"

-- Add description to tours table
ALTER TABLE public.tours
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add description to vehicles table
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.tours.description IS 'Detailed description of the tour experience';
COMMENT ON COLUMN public.vehicles.description IS 'Detailed description of the transport service';
