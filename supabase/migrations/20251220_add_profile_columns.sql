-- Add missing profile columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS bio TEXT;