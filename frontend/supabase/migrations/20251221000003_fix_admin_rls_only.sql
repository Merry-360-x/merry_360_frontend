-- Fix RLS policies to allow admins to update any profile
DROP POLICY IF EXISTS "Allow admins to update any profile" ON profiles;

CREATE POLICY "Allow admins to update any profile"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
  )
);
