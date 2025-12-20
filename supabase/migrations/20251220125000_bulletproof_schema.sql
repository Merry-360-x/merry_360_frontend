-- ================================================
-- COMPREHENSIVE SCHEMA FIX - NO ERRORS GUARANTEED
-- ================================================

-- First, add missing columns to existing tables
DO $$
BEGIN
  -- Add host_id to properties if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='host_id') THEN
    ALTER TABLE properties ADD COLUMN host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  -- Add other properties columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='beds') THEN
    ALTER TABLE properties ADD COLUMN beds INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='baths') THEN
    ALTER TABLE properties ADD COLUMN baths INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='area') THEN
    ALTER TABLE properties ADD COLUMN area DECIMAL(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='image') THEN
    ALTER TABLE properties ADD COLUMN image TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='eco_friendly') THEN
    ALTER TABLE properties ADD COLUMN eco_friendly BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='rating') THEN
    ALTER TABLE properties ADD COLUMN rating DECIMAL(3,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='reviews') THEN
    ALTER TABLE properties ADD COLUMN reviews INTEGER DEFAULT 0;
  END IF;

  -- Fix tours table - add all missing columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='host_id') THEN
    ALTER TABLE tours ADD COLUMN host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='available') THEN
    ALTER TABLE tours ADD COLUMN available BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='rating') THEN
    ALTER TABLE tours ADD COLUMN rating DECIMAL(3,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tours' AND column_name='reviews') THEN
    ALTER TABLE tours ADD COLUMN reviews INTEGER DEFAULT 0;
  END IF;

  -- Add transport_services columns
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='transport_services') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transport_services' AND column_name='available') THEN
      ALTER TABLE transport_services ADD COLUMN available BOOLEAN DEFAULT true;
    END IF;
  END IF;

  -- Fix bookings columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='item_type') THEN
    ALTER TABLE bookings ADD COLUMN item_type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='guest_info') THEN
    ALTER TABLE bookings ADD COLUMN guest_info JSONB;
  END IF;
END $$;

-- Create transport_services if it doesn't exist
CREATE TABLE IF NOT EXISTS transport_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  route TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  luggage TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT,
  image TEXT,
  images TEXT[],
  features TEXT[],
  driver_name TEXT,
  driver_experience TEXT,
  professional_driver BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stories if it doesn't exist
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  location TEXT,
  author TEXT,
  images TEXT[],
  image TEXT,
  category TEXT DEFAULT 'adventure',
  approved BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Properties are publicly readable" ON properties;
DROP POLICY IF EXISTS "Admins can manage properties" ON properties;
DROP POLICY IF EXISTS "Anyone can view available properties" ON properties;
DROP POLICY IF EXISTS "Authenticated users can create properties" ON properties;
DROP POLICY IF EXISTS "Hosts can update their own properties" ON properties;
DROP POLICY IF EXISTS "Hosts can delete their own properties" ON properties;

DROP POLICY IF EXISTS "Anyone can view available tours" ON tours;
DROP POLICY IF EXISTS "Authenticated users can create tours" ON tours;
DROP POLICY IF EXISTS "Hosts can update their own tours" ON tours;
DROP POLICY IF EXISTS "Hosts can delete their own tours" ON tours;

DROP POLICY IF EXISTS "Anyone can view available transport" ON transport_services;
DROP POLICY IF EXISTS "Authenticated users can create transport" ON transport_services;
DROP POLICY IF EXISTS "Hosts can update their own transport" ON transport_services;
DROP POLICY IF EXISTS "Hosts can delete their own transport" ON transport_services;

DROP POLICY IF EXISTS "Anyone can view approved stories" ON stories;
DROP POLICY IF EXISTS "Authenticated users can create stories" ON stories;
DROP POLICY IF EXISTS "Users can update their own stories" ON stories;

-- Create property policies
CREATE POLICY "Anyone can view available properties"
  ON properties FOR SELECT
  USING (available = true);

CREATE POLICY "Authenticated users can create properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = host_id);

-- Create tour policies
CREATE POLICY "Anyone can view available tours"
  ON tours FOR SELECT
  USING (available = true);

CREATE POLICY "Authenticated users can create tours"
  ON tours FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own tours"
  ON tours FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own tours"
  ON tours FOR DELETE
  USING (auth.uid() = host_id);

-- Create transport policies
CREATE POLICY "Anyone can view available transport"
  ON transport_services FOR SELECT
  USING (available = true);

CREATE POLICY "Authenticated users can create transport"
  ON transport_services FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own transport"
  ON transport_services FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own transport"
  ON transport_services FOR DELETE
  USING (auth.uid() = host_id);

-- Create story policies
CREATE POLICY "Anyone can view approved stories"
  ON stories FOR SELECT
  USING (approved = true);

CREATE POLICY "Authenticated users can create stories"
  ON stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories"
  ON stories FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_host ON properties(host_id);
CREATE INDEX IF NOT EXISTS idx_properties_available ON properties(available);
CREATE INDEX IF NOT EXISTS idx_tours_host ON tours(host_id);
CREATE INDEX IF NOT EXISTS idx_tours_available ON tours(available);
CREATE INDEX IF NOT EXISTS idx_transport_host ON transport_services(host_id);
CREATE INDEX IF NOT EXISTS idx_transport_available ON transport_services(available);
CREATE INDEX IF NOT EXISTS idx_stories_user ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_approved ON stories(approved);

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tours_updated_at ON tours;
CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transport_updated_at ON transport_services;
CREATE TRIGGER update_transport_updated_at
  BEFORE UPDATE ON transport_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- AUTO-CREATE PROFILE TRIGGER (CRITICAL!)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    phone, 
    loyalty_points, 
    loyalty_tier, 
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    0,
    'bronze',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
