-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create host_applications table
CREATE TABLE IF NOT EXISTS public.host_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  hosting_type TEXT NOT NULL CHECK (hosting_type IN ('accommodation', 'tour', 'transport', 'service')),
  description TEXT NOT NULL,
  experience TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.host_applications ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to insert (apply to be a host)
CREATE POLICY "Anyone can submit host application"
  ON public.host_applications
  FOR INSERT
  WITH CHECK (true);

-- Create policy for admins to view all applications
CREATE POLICY "Admins can view all host applications"
  ON public.host_applications
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' IN ('admin@merry360x.com', 'bebisdavy@gmail.com')
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Create policy for applicants to view their own applications
CREATE POLICY "Users can view their own host applications"
  ON public.host_applications
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Create policy for admins to update applications (approve/reject)
CREATE POLICY "Admins can update host applications"
  ON public.host_applications
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN ('admin@merry360x.com', 'bebisdavy@gmail.com')
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Create index for faster queries
CREATE INDEX idx_host_applications_email ON public.host_applications(email);
CREATE INDEX idx_host_applications_status ON public.host_applications(status);
CREATE INDEX idx_host_applications_created_at ON public.host_applications(created_at DESC);

-- Enable Realtime for email notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.host_applications;

COMMENT ON TABLE public.host_applications IS 'Stores applications from users who want to become hosts on Merry360x';
