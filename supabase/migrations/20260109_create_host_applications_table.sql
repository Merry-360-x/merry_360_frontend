-- Create host_applications table to store host application data
CREATE TABLE IF NOT EXISTS host_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Applicant type
  applicant_type VARCHAR(20) NOT NULL CHECK (applicant_type IN ('individual', 'business')),
  
  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- ID Verification
  id_number VARCHAR(50),
  id_photo_url TEXT,
  
  -- Business Information (for business applicants)
  business_name VARCHAR(255),
  tax_id VARCHAR(50),
  business_cert_url TEXT,
  
  -- Payment Information
  payment_method VARCHAR(20) CHECK (payment_method IN ('mobile_money', 'bank')),
  payment_details JSONB,
  
  -- Application Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_host_applications_user_id ON host_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_host_applications_status ON host_applications(status);
CREATE INDEX IF NOT EXISTS idx_host_applications_email ON host_applications(email);

-- Add RLS policies
ALTER TABLE host_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON host_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can insert own applications" ON host_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" ON host_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Admins can update applications (approve/reject)
CREATE POLICY "Admins can update applications" ON host_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Add columns to profiles table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'host_applicant_type') THEN
    ALTER TABLE profiles ADD COLUMN host_applicant_type VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'host_id_number') THEN
    ALTER TABLE profiles ADD COLUMN host_id_number VARCHAR(50);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'host_id_document_path') THEN
    ALTER TABLE profiles ADD COLUMN host_id_document_path TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'host_business_name') THEN
    ALTER TABLE profiles ADD COLUMN host_business_name VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'host_business_tax_number') THEN
    ALTER TABLE profiles ADD COLUMN host_business_tax_number VARCHAR(50);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'host_business_registration_certificate_path') THEN
    ALTER TABLE profiles ADD COLUMN host_business_registration_certificate_path TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'host_payment_method') THEN
    ALTER TABLE profiles ADD COLUMN host_payment_method VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'host_payment_details') THEN
    ALTER TABLE profiles ADD COLUMN host_payment_details JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'host_application_data') THEN
    ALTER TABLE profiles ADD COLUMN host_application_data JSONB;
  END IF;
END $$;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_host_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS host_applications_updated_at ON host_applications;
CREATE TRIGGER host_applications_updated_at
  BEFORE UPDATE ON host_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_host_applications_updated_at();
