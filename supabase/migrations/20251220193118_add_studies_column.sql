-- Add studies column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS studies TEXT;

-- Add comment to document the column
COMMENT ON COLUMN profiles.studies IS 'Education and academic background information';
