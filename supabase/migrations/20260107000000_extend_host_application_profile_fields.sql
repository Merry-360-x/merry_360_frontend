-- Extend host application capture on profiles
-- Stores applicant type, nationality, ID + business verification document paths, and a JSON payload for review.

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS host_applicant_type TEXT CHECK (host_applicant_type IN ('individual', 'business')),
ADD COLUMN IF NOT EXISTS host_nationality TEXT,
ADD COLUMN IF NOT EXISTS host_id_number TEXT,
ADD COLUMN IF NOT EXISTS host_id_document_path TEXT,
ADD COLUMN IF NOT EXISTS host_business_name TEXT,
ADD COLUMN IF NOT EXISTS host_business_tax_number TEXT,
ADD COLUMN IF NOT EXISTS host_business_registration_certificate_path TEXT,
ADD COLUMN IF NOT EXISTS host_application_details JSONB;

CREATE INDEX IF NOT EXISTS idx_profiles_host_applicant_type ON profiles(host_applicant_type);

COMMENT ON COLUMN profiles.host_applicant_type IS 'Whether the host applied as an individual or a business';
COMMENT ON COLUMN profiles.host_nationality IS 'Nationality selected during host application';
COMMENT ON COLUMN profiles.host_id_number IS 'Government ID number provided during host application';
COMMENT ON COLUMN profiles.host_id_document_path IS 'Supabase Storage path for uploaded ID document (private bucket recommended)';
COMMENT ON COLUMN profiles.host_business_name IS 'Business legal name (for business applicants)';
COMMENT ON COLUMN profiles.host_business_tax_number IS 'Tax number/TIN (for business applicants)';
COMMENT ON COLUMN profiles.host_business_registration_certificate_path IS 'Supabase Storage path for business registration certificate (private bucket recommended)';
COMMENT ON COLUMN profiles.host_application_details IS 'JSON payload with additional host application fields (e.g., hosting type, location, description)';
