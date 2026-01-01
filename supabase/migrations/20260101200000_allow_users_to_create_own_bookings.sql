-- Allow authenticated users to create their own bookings.
--
-- Without this, checkout flows that insert into public.bookings from the client
-- will fail under RLS.

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Bookings: users can create own" ON public.bookings;

CREATE POLICY "Bookings: users can create own"
ON public.bookings
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
);
