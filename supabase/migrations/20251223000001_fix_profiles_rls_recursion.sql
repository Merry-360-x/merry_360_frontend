-- Fix 500 errors caused by recursive profiles RLS policies
--
-- Symptom:
-- - /rest/v1/profiles SELECT returning 500 in production
--
-- Root cause:
-- - RLS policies that query public.profiles inside their USING/WITH CHECK expressions
--   can cause recursion / stack depth errors.
--
-- Fix:
-- - Use a SECURITY DEFINER helper that checks admin status without being subject to RLS.
-- - Replace the recursive admin policies with non-recursive policies.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER helper: checks if the current user is admin.
-- Runs with table owner privileges (bypasses RLS), avoiding recursion.
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

-- Drop old recursive policies (from previous fixes)
DROP POLICY IF EXISTS "Allow admins to select all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to update any profile" ON public.profiles;

-- Unified policies: self OR admin
DROP POLICY IF EXISTS "Profiles: select own or admin" ON public.profiles;
CREATE POLICY "Profiles: select own or admin"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR public.is_admin()
);

DROP POLICY IF EXISTS "Profiles: update own or admin" ON public.profiles;
CREATE POLICY "Profiles: update own or admin"
ON public.profiles
FOR UPDATE
USING (
  auth.uid() = id OR public.is_admin()
)
WITH CHECK (
  auth.uid() = id OR public.is_admin()
);

-- Keep (or recreate) insert policy for self (supports client-side upsert)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id
  AND (role IS NULL OR role = 'user')
);
