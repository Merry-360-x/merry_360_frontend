-- Add images and main_image columns to vehicles table
-- This fixes the error: "Could not find the 'images' column of 'vehicles' in the schema cache"

-- Add main_image column to vehicles table
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS main_image TEXT;

-- Add images column to vehicles table (as JSONB to match tours table)
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS images JSONB;

-- Add comments for documentation
COMMENT ON COLUMN public.vehicles.main_image IS 'Primary image URL for the vehicle';
COMMENT ON COLUMN public.vehicles.images IS 'Array of image URLs for the vehicle (stored as JSONB)';
