-- Create properties table for host features
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  property_type TEXT,
  location TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Rwanda',
  price_per_night DECIMAL(10, 2) NOT NULL,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 2,
  amenities TEXT[],
  images TEXT[],
  main_image TEXT,
  available BOOLEAN DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for host queries
CREATE INDEX IF NOT EXISTS idx_properties_host_id ON public.properties(host_id);
CREATE INDEX IF NOT EXISTS idx_properties_available ON public.properties(available);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Anyone can view available properties" 
  ON public.properties FOR SELECT 
  USING (available = true);

CREATE POLICY "Hosts can view their own properties" 
  ON public.properties FOR SELECT 
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can create properties" 
  ON public.properties FOR INSERT 
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own properties" 
  ON public.properties FOR UPDATE 
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own properties" 
  ON public.properties FOR DELETE 
  USING (auth.uid() = host_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER set_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_properties_updated_at();

-- Grant permissions
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;
