-- ================================================
-- MERRY360X DATABASE SETUP - COMPLETE SCHEMA
-- Run this in Supabase SQL Editor
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. PROPERTIES TABLE (Accommodations)
-- ================================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  beds INTEGER DEFAULT 1,
  baths INTEGER DEFAULT 1,
  area DECIMAL(10,2),
  image TEXT,
  images TEXT[],
  amenities TEXT[],
  eco_friendly BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view available properties" ON properties;
CREATE POLICY "Anyone can view available properties"
  ON properties FOR SELECT
  USING (available = true);

DROP POLICY IF EXISTS "Authenticated users can create properties" ON properties;
CREATE POLICY "Authenticated users can create properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Hosts can update their own properties" ON properties;
CREATE POLICY "Hosts can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Hosts can delete their own properties" ON properties;
CREATE POLICY "Hosts can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = host_id);

-- ================================================
-- 2. TOURS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  difficulty TEXT,
  price DECIMAL(10,2) NOT NULL,
  group_size INTEGER DEFAULT 8,
  image TEXT,
  images TEXT[],
  inclusions TEXT[],
  itinerary TEXT,
  available BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for tours
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view available tours" ON tours;
CREATE POLICY "Anyone can view available tours"
  ON tours FOR SELECT
  USING (available = true);

DROP POLICY IF EXISTS "Authenticated users can create tours" ON tours;
CREATE POLICY "Authenticated users can create tours"
  ON tours FOR INSERT
  WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Hosts can update their own tours" ON tours;
CREATE POLICY "Hosts can update their own tours"
  ON tours FOR UPDATE
  USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Hosts can delete their own tours" ON tours;
CREATE POLICY "Hosts can delete their own tours"
  ON tours FOR DELETE
  USING (auth.uid() = host_id);

-- ================================================
-- 3. TRANSPORT SERVICES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS transport_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- RLS for transport services
ALTER TABLE transport_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view available transport" ON transport_services;
CREATE POLICY "Anyone can view available transport"
  ON transport_services FOR SELECT
  USING (available = true);

DROP POLICY IF EXISTS "Authenticated users can create transport" ON transport_services;
CREATE POLICY "Authenticated users can create transport"
  ON transport_services FOR INSERT
  WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Hosts can update their own transport" ON transport_services;
CREATE POLICY "Hosts can update their own transport"
  ON transport_services FOR UPDATE
  USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Hosts can delete their own transport" ON transport_services;
CREATE POLICY "Hosts can delete their own transport"
  ON transport_services FOR DELETE
  USING (auth.uid() = host_id);

-- ================================================
-- 4. BOOKINGS TABLE *** CRITICAL - WAS MISSING ***
-- ================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL, -- 'accommodation', 'tour', 'transport'
  check_in DATE,
  check_out DATE,
  guests INTEGER,
  total_price DECIMAL(10,2) NOT NULL,
  guest_info JSONB,
  payment_method TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can create bookings" ON bookings;
CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookings" ON bookings;
CREATE POLICY "Users can delete their own bookings"
  ON bookings FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- 5. STORIES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- RLS for stories
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved stories" ON stories;
CREATE POLICY "Anyone can view approved stories"
  ON stories FOR SELECT
  USING (approved = true);

DROP POLICY IF EXISTS "Authenticated users can create stories" ON stories;
CREATE POLICY "Authenticated users can create stories"
  ON stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own stories" ON stories;
CREATE POLICY "Users can update their own stories"
  ON stories FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own stories" ON stories;
CREATE POLICY "Users can delete their own stories"
  ON stories FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- 6. USER PROFILES TABLE (Optional but recommended)
-- ================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'bronze',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ================================================
-- 7. INDEXES for Performance
-- ================================================
CREATE INDEX IF NOT EXISTS idx_properties_host ON properties(host_id);
CREATE INDEX IF NOT EXISTS idx_properties_available ON properties(available);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);

CREATE INDEX IF NOT EXISTS idx_tours_host ON tours(host_id);
CREATE INDEX IF NOT EXISTS idx_tours_available ON tours(available);
CREATE INDEX IF NOT EXISTS idx_tours_location ON tours(location);

CREATE INDEX IF NOT EXISTS idx_transport_host ON transport_services(host_id);
CREATE INDEX IF NOT EXISTS idx_transport_available ON transport_services(available);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_item ON bookings(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_stories_user ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_approved ON stories(approved);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);

-- ================================================
-- 8. TRIGGERS for updated_at
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tours_updated_at ON tours;
CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transport_updated_at ON transport_services;
CREATE TRIGGER update_transport_updated_at
  BEFORE UPDATE ON transport_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SUCCESS MESSAGE
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '✅ All tables created with RLS policies';
  RAISE NOTICE '✅ Indexes and triggers configured';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - properties';
  RAISE NOTICE '  - tours';
  RAISE NOTICE '  - transport_services';
  RAISE NOTICE '  - bookings (NEWLY CREATED)';
  RAISE NOTICE '  - stories';
  RAISE NOTICE '  - profiles';
END $$;
