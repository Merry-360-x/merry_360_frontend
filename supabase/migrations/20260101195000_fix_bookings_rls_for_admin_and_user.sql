-- Ensure bookings RLS allows:
-- - users to read their own bookings
-- - admins to read/manage all bookings

-- Helper should already exist from prior migrations, but keep it safe.
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

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if present (idempotent)
DROP POLICY IF EXISTS "Bookings: users can view own" ON public.bookings;
DROP POLICY IF EXISTS "Bookings: admins can manage" ON public.bookings;
DROP POLICY IF EXISTS "bookings_select_own" ON public.bookings;
DROP POLICY IF EXISTS "bookings_admin_all" ON public.bookings;

-- Users can select their own bookings; admins can select all.
CREATE POLICY "Bookings: users can view own"
ON public.bookings
FOR SELECT
USING (
  user_id = auth.uid()
  OR public.is_admin()
);

-- Admins can insert/update/delete any booking (for admin panel management).
CREATE POLICY "Bookings: admins can manage"
ON public.bookings
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());
