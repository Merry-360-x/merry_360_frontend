-- Add host application fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS host_application_status TEXT CHECK (host_application_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS host_application_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS host_approved_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS host_rejected_date TIMESTAMPTZ;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_host_application_status ON profiles(host_application_status);

-- Comment the columns
COMMENT ON COLUMN profiles.host_application_status IS 'Status of host application: pending, approved, or rejected';
COMMENT ON COLUMN profiles.host_application_date IS 'When the user applied to become a host';
COMMENT ON COLUMN profiles.host_approved_date IS 'When the host application was approved';
COMMENT ON COLUMN profiles.host_rejected_date IS 'When the host application was rejected';
