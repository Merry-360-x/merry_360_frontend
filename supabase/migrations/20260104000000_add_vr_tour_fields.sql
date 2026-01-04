-- Add VR/3D tour fields to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS vr_tour_url TEXT,
ADD COLUMN IF NOT EXISTS vr_tour_type TEXT CHECK (vr_tour_type IN ('matterport', 'google_tour', 'youtube_360', 'custom', NULL)),
ADD COLUMN IF NOT EXISTS vr_tour_enabled BOOLEAN DEFAULT false;

-- Add VR tour fields to listings table (if it exists for backward compatibility)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'listings') THEN
    ALTER TABLE public.listings 
    ADD COLUMN IF NOT EXISTS vr_tour_url TEXT,
    ADD COLUMN IF NOT EXISTS vr_tour_type TEXT CHECK (vr_tour_type IN ('matterport', 'google_tour', 'youtube_360', 'custom', NULL)),
    ADD COLUMN IF NOT EXISTS vr_tour_enabled BOOLEAN DEFAULT false;
  END IF;
END $$;

COMMENT ON COLUMN public.properties.vr_tour_url IS 'URL to the virtual reality/3D tour (Matterport, Google Tour, YouTube 360, etc.)';
COMMENT ON COLUMN public.properties.vr_tour_type IS 'Type of VR tour platform: matterport, google_tour, youtube_360, or custom';
COMMENT ON COLUMN public.properties.vr_tour_enabled IS 'Whether the VR tour feature is enabled for this property';
