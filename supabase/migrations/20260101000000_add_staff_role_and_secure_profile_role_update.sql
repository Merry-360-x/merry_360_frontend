-- Add 'staff' role + prevent self role escalation
--
-- Goals:
-- 1) Allow 'staff' in profiles.role constraint.
-- 2) Prevent non-admin users from changing their own role (e.g., user -> admin).
--    They can still update their own profile fields, but role must remain unchanged.

-- 1) Expand role constraint
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (
    role IS NULL OR role IN ('user', 'host', 'admin', 'vendor', 'staff')
  );

-- 2) SECURITY DEFINER helper to read current user's role without RLS recursion
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 3) Tighten UPDATE policy to keep role immutable for non-admin
DROP POLICY IF EXISTS "Profiles: update own or admin" ON public.profiles;
CREATE POLICY "Profiles: update own or admin"
ON public.profiles
FOR UPDATE
USING (
  auth.uid() = id OR public.is_admin()
)
WITH CHECK (
  public.is_admin()
  OR (
    auth.uid() = id
    AND coalesce(role, '') = coalesce(public.get_my_role(), '')
  )
);
