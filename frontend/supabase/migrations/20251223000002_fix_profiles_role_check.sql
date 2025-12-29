-- Fix profiles.role check constraint to allow host/admin/user/vendor
--
-- Symptom:
--   new row for relation "profiles" violates check constraint "profiles_role_check"
--   when setting role = 'host'
--
-- Fix:
--   Update the constraint to include the 'host' role (and keep existing roles).

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (
    role IS NULL OR role IN ('user', 'host', 'admin', 'vendor')
  );
