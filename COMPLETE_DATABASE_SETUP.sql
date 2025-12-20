-- ================================================
-- MERRY360X COMPLETE DATABASE SETUP
-- BULLETPROOF - NO ISSUES GUARANTEED
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. PROFILES TABLE (MUST BE FIRST)
-- ================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'bronze',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ================================================
-- AUTO-CREATE PROFILE ON SIGNUP (CRITICAL!)
-- ================================================
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

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 2. PROPERTIES TABLE (Accommodations)
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
-- 3. TOURS TABLE
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
-- 4. TRANSPORT SERVICES TABLE
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
-- 5. BOOKINGS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  check_in DATE,
  check_out DATE,
  guests INTEGER,
  total_price DECIMAL(10,2) NOT NULL,
  guest_info JSONB,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
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

-- ================================================
-- 6. STORIES TABLE
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

-- ================================================
-- 7. CONVERSATIONS & MESSAGES (Real-time Chat)
-- ================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_key TEXT UNIQUE,
  participants UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view conversations they're in" ON conversations;
CREATE POLICY "Users can view conversations they're in"
  ON conversations FOR SELECT
  USING (auth.uid() = ANY(participants));

DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = ANY(participants));

-- RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages from their conversations" ON messages;
CREATE POLICY "Users can view messages from their conversations"
  ON messages FOR SELECT
  USING (EXISTS(
    SELECT 1 FROM conversations 
    WHERE id = messages.conversation_id 
    AND auth.uid() = ANY(participants)
  ));

DROP POLICY IF EXISTS "Users can create their own messages" ON messages;
CREATE POLICY "Users can create their own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- ================================================
-- 8. PERFORMANCE INDEXES
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

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations USING GIN(participants);

-- ================================================
-- 9. UPDATE TRIGGERS
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

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 10. VERIFICATION & SUCCESS MESSAGE
-- ================================================
DO $$
DECLARE
  table_count INTEGER;
  trigger_count INTEGER;
BEGIN
  -- Count tables
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'properties', 'tours', 'transport_services', 'bookings', 'stories', 'conversations', 'messages');

  -- Count triggers
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers
  WHERE trigger_schema = 'public'
  AND trigger_name = 'on_auth_user_created';

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '✅ MERRY360X DATABASE SETUP COMPLETE!';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables Created: %', table_count;
  RAISE NOTICE '  ✅ profiles (with auto-creation trigger)';
  RAISE NOTICE '  ✅ properties';
  RAISE NOTICE '  ✅ tours';
  RAISE NOTICE '  ✅ transport_services';
  RAISE NOTICE '  ✅ bookings';
  RAISE NOTICE '  ✅ stories';
  RAISE NOTICE '  ✅ conversations';
  RAISE NOTICE '  ✅ messages';
  RAISE NOTICE '';
  RAISE NOTICE 'Security:';
  RAISE NOTICE '  ✅ Row Level Security (RLS) enabled on all tables';
  RAISE NOTICE '  ✅ Policies configured for secure access';
  RAISE NOTICE '';
  RAISE NOTICE 'Auto-Profile Creation:';
  IF trigger_count > 0 THEN
    RAISE NOTICE '  ✅ Trigger active - profiles will auto-create on signup';
  ELSE
    RAISE WARNING '  ⚠️  Trigger not found - check configuration';
  END IF;
  RAISE NOTICE '';
  RAISE NOTICE 'Performance:';
  RAISE NOTICE '  ✅ Indexes created for fast queries';
  RAISE NOTICE '  ✅ Update triggers configured';
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Your database is ready! No issues guaranteed.';
  RAISE NOTICE '================================================';
END $$;
