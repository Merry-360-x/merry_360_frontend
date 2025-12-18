// Create host_applications table using Supabase REST API
import fetch from 'node-fetch'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

console.log('\n🔨 SETTING UP HOST APPLICATIONS TABLE')
console.log('═══════════════════════════════════════\n')

const sqlStatements = `
-- Create host_applications table
CREATE TABLE IF NOT EXISTS public.host_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit host application" ON public.host_applications;
DROP POLICY IF EXISTS "Admins can view all host applications" ON public.host_applications;
DROP POLICY IF EXISTS "Users can view their own host applications" ON public.host_applications;
DROP POLICY IF EXISTS "Admins can update host applications" ON public.host_applications;

-- Create policy for anyone to insert
CREATE POLICY "Anyone can submit host application"
  ON public.host_applications FOR INSERT WITH CHECK (true);

-- Create policy for admins to view all
CREATE POLICY "Admins can view all host applications"
  ON public.host_applications FOR SELECT
  USING (
    auth.jwt() ->> 'email' IN ('admin@merry360x.com', 'bebisdavy@gmail.com')
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Create policy for users to view their own
CREATE POLICY "Users can view their own host applications"
  ON public.host_applications FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Create policy for admins to update
CREATE POLICY "Admins can update host applications"
  ON public.host_applications FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN ('admin@merry360x.com', 'bebisdavy@gmail.com')
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_host_applications_email ON public.host_applications(email);
CREATE INDEX IF NOT EXISTS idx_host_applications_status ON public.host_applications(status);
CREATE INDEX IF NOT EXISTS idx_host_applications_created_at ON public.host_applications(created_at DESC);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.host_applications;
`

async function executeSQL() {
  try {
    console.log('📡 Connecting to Supabase...')
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      },
      body: JSON.stringify({ query: sqlStatements })
    })

    if (!response.ok) {
      const error = await response.text()
      console.log('⚠️  Direct SQL execution not available')
      console.log('\n📋 Please run the SQL manually:\n')
      console.log('1. Open: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/editor')
      console.log('2. Copy contents of: supabase-host-applications-table.sql')
      console.log('3. Paste into SQL Editor')
      console.log('4. Click Run\n')
      console.log('Or copy this SQL:\n')
      console.log('─'.repeat(60))
      console.log(sqlStatements)
      console.log('─'.repeat(60))
      process.exit(1)
    }

    console.log('✅ Table created successfully!\n')
    console.log('🎉 Setup complete! You can now:')
    console.log('   1. Start monitor: node email-notification-service.mjs hosts')
    console.log('   2. Run test: node test-host-application.mjs\n')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n📋 Manual SQL execution required.')
    console.log('Please run: supabase-host-applications-table.sql in Supabase SQL Editor\n')
    process.exit(1)
  }
}

executeSQL()
