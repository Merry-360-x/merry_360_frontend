-- Option B Schema Alignment: Tours + Vehicles tables + Booking foreign keys
--
-- This migration creates missing tables used by the admin UI and public pages,
-- and adds FK relationships so PostgREST embedded selects work reliably.
--
-- Safe to run multiple times (uses IF NOT EXISTS / guarded constraint creation).

-- Ensure helper exists (used in RLS policies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- Tours
CREATE TABLE IF NOT EXISTS public.tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  destination text,
  duration_days integer,
  price numeric,
  category text,
  available boolean NOT NULL DEFAULT true,
  main_image text,
  images jsonb,
  rating numeric,
  reviews_count integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  capacity integer,
  price_per_day numeric,
  license_plate text,
  driver_included boolean NOT NULL DEFAULT false,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Drop + recreate policies (idempotent)
DROP POLICY IF EXISTS "Tours: public can view available" ON public.tours;
DROP POLICY IF EXISTS "Tours: admins can manage" ON public.tours;

CREATE POLICY "Tours: public can view available"
ON public.tours
FOR SELECT
USING (available = true OR public.is_admin());

CREATE POLICY "Tours: admins can manage"
ON public.tours
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Vehicles: public can view available" ON public.vehicles;
DROP POLICY IF EXISTS "Vehicles: admins can manage" ON public.vehicles;

CREATE POLICY "Vehicles: public can view available"
ON public.vehicles
FOR SELECT
USING (available = true OR public.is_admin());

CREATE POLICY "Vehicles: admins can manage"
ON public.vehicles
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Booking links
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS property_id uuid,
  ADD COLUMN IF NOT EXISTS tour_id uuid,
  ADD COLUMN IF NOT EXISTS vehicle_id uuid;

-- Enforce that bookings reference at most one service type.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_one_service_check'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_one_service_check
      CHECK (num_nonnulls(property_id, tour_id, vehicle_id) <= 1);
  END IF;
END$$;

-- Foreign keys (guarded)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'properties_host_id_fkey') THEN
    ALTER TABLE public.properties
      ADD CONSTRAINT properties_host_id_fkey
      FOREIGN KEY (host_id) REFERENCES public.profiles(id)
      ON DELETE SET NULL;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_user_id_fkey') THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id)
      ON DELETE SET NULL;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_listing_id_fkey') THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_listing_id_fkey
      FOREIGN KEY (listing_id) REFERENCES public.listings(id)
      ON DELETE SET NULL;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_property_id_fkey') THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_property_id_fkey
      FOREIGN KEY (property_id) REFERENCES public.properties(id)
      ON DELETE SET NULL;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_tour_id_fkey') THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_tour_id_fkey
      FOREIGN KEY (tour_id) REFERENCES public.tours(id)
      ON DELETE SET NULL;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_vehicle_id_fkey') THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_vehicle_id_fkey
      FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
      ON DELETE SET NULL;
  END IF;
END$$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON public.bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_properties_host_id ON public.properties(host_id);
