-- Add location coordinates for map display
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add location coordinates to listings table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'listings') THEN
    ALTER TABLE public.listings 
    ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
    ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
  END IF;
END $$;

-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties (latitude, longitude);

COMMENT ON COLUMN public.properties.latitude IS 'Latitude coordinate for map display (-90 to 90)';
COMMENT ON COLUMN public.properties.longitude IS 'Longitude coordinate for map display (-180 to 180)';
