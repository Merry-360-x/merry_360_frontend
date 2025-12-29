-- Fix profiles RLS policies so admin panel actions persist reliably
--
-- Goals:
-- - Admins can SELECT and UPDATE any profile (role changes, approve/reject host applications)
-- - Users can INSERT their own profile row if it doesn't exist (supports client-side upsert)
--
-- Notes:
-- - This assumes roles are stored in public.profiles.role and admin users have role='admin'.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow admins to read all profiles (needed for admin screens)
DROP POLICY IF EXISTS "Allow admins to select all profiles" ON public.profiles;
CREATE POLICY "Allow admins to select all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
);

-- Allow admins to update any profile (needed for role changes and host approvals)
DROP POLICY IF EXISTS "Allow admins to update any profile" ON public.profiles;
CREATE POLICY "Allow admins to update any profile"
ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
);

-- Allow users to create their own profile row if missing (supports upsert from the client)
-- Keep role locked to 'user' (or NULL) at insert time to reduce privilege escalation risk.
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id
  AND (role IS NULL OR role = 'user')
);
