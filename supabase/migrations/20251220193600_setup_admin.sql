-- Create admin user script
-- Run this to create an admin account

-- First, you need to sign up normally at the website
-- Then run this to upgrade an existing user to admin:

-- Replace 'your-email@example.com' with the actual email
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'bebisdavy@gmail.com';

-- Or create a new admin directly (requires auth.users access):
-- This is just documentation - actual creation happens via signup

-- To make any user an admin, update their profile:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'email@example.com';
