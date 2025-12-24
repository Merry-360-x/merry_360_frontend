-- Add missing city column to profiles
--
-- Symptom:
--   Could not find the 'city' column of 'profiles' in the schema cache
--
-- Fix:
--   Add public.profiles.city so host applications/admin analytics can store and read location.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS city text;
