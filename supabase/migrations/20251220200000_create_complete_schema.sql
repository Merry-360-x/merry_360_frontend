-- ============================================
-- COMPLETE DATABASE SCHEMA FOR MERRY 360
-- ============================================

-- ============ TOURS TABLE ============
CREATE TABLE IF NOT EXISTS public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  max_participants INTEGER DEFAULT 20,
  includes TEXT[],
  itinerary JSONB,
  images TEXT[],
  main_image TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'challenging')),
  category TEXT, -- safari, hiking, cultural, beach, etc.
  available BOOLEAN DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  start_dates DATE[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tours_available ON public.tours(available);
CREATE INDEX IF NOT EXISTS idx_tours_category ON public.tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_destination ON public.tours(destination);

-- ============ VEHICLES TABLE ============
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- sedan, suv, van, bus, etc.
  brand TEXT,
  model TEXT,
  year INTEGER,
  capacity INTEGER NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  features TEXT[],
  images TEXT[],
  main_image TEXT,
  license_plate TEXT,
  driver_included BOOLEAN DEFAULT true,
  available BOOLEAN DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_available ON public.vehicles(available);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON public.vehicles(type);

-- ============ BOOKINGS TABLE ============
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('property', 'tour', 'vehicle')),
  
  -- Reference to what is being booked
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  tour_id UUID REFERENCES public.tours(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  
  -- Booking details
  check_in DATE,
  check_out DATE,
  guests INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method TEXT,
  
  -- Additional info
  special_requests TEXT,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON public.bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ============ REVIEWS TABLE ============
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  
  -- What is being reviewed
  review_type TEXT NOT NULL CHECK (review_type IN ('property', 'tour', 'vehicle')),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  
  -- Images
  images TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON public.reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tour_id ON public.reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vehicle_id ON public.reviews(vehicle_id);

-- ============ MESSAGES TABLE (if not exists) ============
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON public.messages(read);

-- ============ FAVORITES TABLE ============
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('property', 'tour')),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id),
  UNIQUE(user_id, tour_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);

-- ============ ENABLE RLS ON ALL TABLES ============
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES - TOURS ============
CREATE POLICY "Anyone can view available tours" 
  ON public.tours FOR SELECT 
  USING (available = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins can manage tours" 
  ON public.tours FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- ============ RLS POLICIES - VEHICLES ============
CREATE POLICY "Anyone can view available vehicles" 
  ON public.vehicles FOR SELECT 
  USING (available = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins can manage vehicles" 
  ON public.vehicles FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- ============ RLS POLICIES - BOOKINGS ============
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
  ON public.bookings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Hosts can view bookings for their properties" 
  ON public.bookings FOR SELECT 
  USING (
    property_id IN (
      SELECT id FROM public.properties WHERE host_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all bookings" 
  ON public.bookings FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- ============ RLS POLICIES - REVIEWS ============
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews FOR SELECT 
  USING (true);

CREATE POLICY "Users can create reviews for their bookings" 
  ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews FOR DELETE 
  USING (auth.uid() = user_id);

-- ============ RLS POLICIES - MESSAGES ============
CREATE POLICY "Users can view their own messages" 
  ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
  ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages" 
  ON public.messages FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- ============ RLS POLICIES - FAVORITES ============
CREATE POLICY "Users can view their own favorites" 
  ON public.favorites FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" 
  ON public.favorites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" 
  ON public.favorites FOR DELETE 
  USING (auth.uid() = user_id);

-- ============ GRANT PERMISSIONS ============
GRANT SELECT ON public.tours TO anon, authenticated;
GRANT SELECT ON public.vehicles TO anon, authenticated;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.messages TO authenticated;
GRANT ALL ON public.favorites TO authenticated;

-- ============ FUNCTIONS FOR UPDATING RATINGS ============
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.properties
  SET 
    rating = (SELECT AVG(rating) FROM public.reviews WHERE property_id = NEW.property_id),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE property_id = NEW.property_id)
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_tour_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.tours
  SET 
    rating = (SELECT AVG(rating) FROM public.reviews WHERE tour_id = NEW.tour_id),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE tour_id = NEW.tour_id)
  WHERE id = NEW.tour_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_vehicle_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.vehicles
  SET 
    rating = (SELECT AVG(rating) FROM public.reviews WHERE vehicle_id = NEW.vehicle_id),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE vehicle_id = NEW.vehicle_id)
  WHERE id = NEW.vehicle_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============ TRIGGERS FOR RATING UPDATES ============
CREATE TRIGGER update_property_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  WHEN (NEW.property_id IS NOT NULL OR OLD.property_id IS NOT NULL)
  EXECUTE FUNCTION update_property_rating();

CREATE TRIGGER update_tour_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  WHEN (NEW.tour_id IS NOT NULL OR OLD.tour_id IS NOT NULL)
  EXECUTE FUNCTION update_tour_rating();

CREATE TRIGGER update_vehicle_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  WHEN (NEW.vehicle_id IS NOT NULL OR OLD.vehicle_id IS NOT NULL)
  EXECUTE FUNCTION update_vehicle_rating();

-- ============ SAMPLE DATA - TOURS ============
INSERT INTO public.tours (name, description, destination, duration_days, price, max_participants, category, difficulty, main_image, includes, available) VALUES
('Nairobi City Tour', 'Explore the vibrant capital of Kenya with visits to national parks, museums, and local markets', 'Nairobi, Kenya', 1, 85.00, 15, 'cultural', 'easy', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800', ARRAY['Hotel pickup', 'Professional guide', 'Lunch', 'Entry fees'], true),
('Masai Mara Safari', 'Experience the world-famous Masai Mara with incredible wildlife viewing and cultural encounters', 'Masai Mara, Kenya', 3, 450.00, 12, 'safari', 'moderate', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', ARRAY['Accommodation', 'All meals', 'Game drives', 'Park fees'], true),
('Mount Kenya Hike', 'Trek to the peaks of Africa''s second-highest mountain with breathtaking views', 'Mount Kenya', 5, 650.00, 8, 'hiking', 'challenging', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800', ARRAY['Mountain guide', 'Camping equipment', 'Meals', 'Porters'], true),
('Diani Beach Getaway', 'Relax on pristine white sand beaches with crystal clear waters and water sports', 'Diani, Kenya', 4, 380.00, 20, 'beach', 'easy', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', ARRAY['Beachfront hotel', 'Breakfast', 'Snorkeling gear', 'Beach activities'], true),
('Lake Nakuru National Park', 'Visit the famous flamingo sanctuary and spot rhinos, lions, and other wildlife', 'Lake Nakuru, Kenya', 2, 220.00, 15, 'safari', 'easy', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', ARRAY['Transport', 'Accommodation', 'Meals', 'Park entrance'], true),
('Amboseli Safari', 'See elephants with Mount Kilimanjaro as the backdrop in one of Kenya''s most scenic parks', 'Amboseli, Kenya', 3, 420.00, 12, 'safari', 'moderate', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', ARRAY['Lodge stay', 'Game drives', 'All meals', 'Park fees'], true),
('Lamu Island Cultural Tour', 'Discover the ancient Swahili culture and architecture of UNESCO World Heritage Lamu', 'Lamu, Kenya', 3, 340.00, 10, 'cultural', 'easy', 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800', ARRAY['Dhow sailing', 'Cultural guide', 'Accommodation', 'Local meals'], true),
('Hell''s Gate Adventure', 'Cycle through Hell''s Gate National Park and explore gorges and hot springs', 'Naivasha, Kenya', 1, 95.00, 20, 'adventure', 'moderate', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', ARRAY['Bike rental', 'Guide', 'Park entry', 'Lunch'], true)
ON CONFLICT DO NOTHING;

-- ============ SAMPLE DATA - VEHICLES ============
INSERT INTO public.vehicles (name, type, brand, model, capacity, price_per_day, driver_included, main_image, features, available) VALUES
('Toyota Land Cruiser V8', 'suv', 'Toyota', 'Land Cruiser', 7, 120.00, true, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', ARRAY['4WD', 'AC', 'GPS', 'First Aid Kit'], true),
('Toyota Hiace', 'van', 'Toyota', 'Hiace', 14, 100.00, true, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800', ARRAY['AC', 'Comfortable seats', 'Luggage space'], true),
('Nissan X-Trail', 'suv', 'Nissan', 'X-Trail', 5, 80.00, true, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', ARRAY['AC', 'Bluetooth', 'USB ports'], true),
('Mercedes Sprinter', 'bus', 'Mercedes', 'Sprinter', 22, 180.00, true, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800', ARRAY['AC', 'Reclining seats', 'Audio system', 'Wifi'], true),
('Toyota Prado', 'suv', 'Toyota', 'Prado', 7, 110.00, true, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', ARRAY['4WD', 'Leather seats', 'AC', 'Sunroof'], true),
('Subaru Forester', 'suv', 'Subaru', 'Forester', 5, 75.00, true, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800', ARRAY['AWD', 'AC', 'Safety features'], true)
ON CONFLICT DO NOTHING;

-- ============ UPDATE TRIGGERS FOR TIMESTAMP ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_tours_updated_at BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
