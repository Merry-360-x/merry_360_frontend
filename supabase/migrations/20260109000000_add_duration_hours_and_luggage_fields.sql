-- Add duration_hours to tours table
-- Add duration_days, duration_hours, and luggage_bags to vehicles table
-- These fields match the updated form inputs for better data structure

-- Tours: Add duration_hours column
ALTER TABLE public.tours 
  ADD COLUMN IF NOT EXISTS duration_hours integer DEFAULT 0;

-- Vehicles: Add duration and luggage fields
ALTER TABLE public.vehicles 
  ADD COLUMN IF NOT EXISTS duration_days integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS duration_hours integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS luggage_bags integer;

-- Add comments for documentation
COMMENT ON COLUMN public.tours.duration_hours IS 'Number of hours (0-23) in addition to duration_days';
COMMENT ON COLUMN public.vehicles.duration_days IS 'Number of days for the transport service';
COMMENT ON COLUMN public.vehicles.duration_hours IS 'Number of hours (0-23) in addition to duration_days';
COMMENT ON COLUMN public.vehicles.luggage_bags IS 'Number of bags/luggage capacity';
