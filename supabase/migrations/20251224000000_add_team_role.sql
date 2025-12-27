-- Allow 'team' as a valid role in profiles
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (
    role IS NULL OR role IN ('user', 'host', 'admin', 'vendor', 'team')
  );
