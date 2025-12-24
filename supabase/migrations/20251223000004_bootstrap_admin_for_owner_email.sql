-- Bootstrap an initial admin account (idempotent)
--
-- This project uses RLS that requires an existing admin to grant admin.
-- To avoid manual dashboard steps for initial setup, we promote the owner email
-- to admin if their profile already exists.

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'bebisdavy@gmail.com'
  AND (role IS DISTINCT FROM 'admin');
