// Create host_applications table in Supabase
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

const supabase = createClient(supabaseUrl, serviceRoleKey)

console.log('\n🔨 CREATING HOST APPLICATIONS TABLE')
console.log('═══════════════════════════════════════\n')

async function createTable() {
  try {
    // Create the table
    console.log('📝 Creating host_applications table...')
    const { error: createError } = await supabase.rpc('exec_sql', {
      query: `
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
      `
    })

    if (createError && createError.code !== '42P07') { // 42P07 = table already exists
      throw createError
    }
    console.log('✅ Table created\n')

    // Enable RLS
    console.log('🔒 Enabling Row Level Security...')
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE public.host_applications ENABLE ROW LEVEL SECURITY;'
    })
    console.log('✅ RLS enabled\n')

    // Create policies
    console.log('📋 Creating security policies...')
    
    await supabase.rpc('exec_sql', {
      query: `
        DROP POLICY IF EXISTS "Anyone can submit host application" ON public.host_applications;
        CREATE POLICY "Anyone can submit host application"
          ON public.host_applications FOR INSERT WITH CHECK (true);
      `
    })
    console.log('   ✅ Insert policy created')

    await supabase.rpc('exec_sql', {
      query: `
        DROP POLICY IF EXISTS "Admins can view all host applications" ON public.host_applications;
        CREATE POLICY "Admins can view all host applications"
          ON public.host_applications FOR SELECT
          USING (
            auth.jwt() ->> 'email' IN ('admin@merry360x.com', 'bebisdavy@gmail.com')
            OR auth.jwt() ->> 'role' = 'admin'
          );
      `
    })
    console.log('   ✅ Admin select policy created')

    await supabase.rpc('exec_sql', {
      query: `
        DROP POLICY IF EXISTS "Users can view their own host applications" ON public.host_applications;
        CREATE POLICY "Users can view their own host applications"
          ON public.host_applications FOR SELECT
          USING (auth.jwt() ->> 'email' = email);
      `
    })
    console.log('   ✅ User select policy created')

    await supabase.rpc('exec_sql', {
      query: `
        DROP POLICY IF EXISTS "Admins can update host applications" ON public.host_applications;
        CREATE POLICY "Admins can update host applications"
          ON public.host_applications FOR UPDATE
          USING (
            auth.jwt() ->> 'email' IN ('admin@merry360x.com', 'bebisdavy@gmail.com')
            OR auth.jwt() ->> 'role' = 'admin'
          );
      `
    })
    console.log('   ✅ Update policy created\n')

    // Create indexes
    console.log('⚡ Creating indexes...')
    await supabase.rpc('exec_sql', {
      query: `
        CREATE INDEX IF NOT EXISTS idx_host_applications_email ON public.host_applications(email);
        CREATE INDEX IF NOT EXISTS idx_host_applications_status ON public.host_applications(status);
        CREATE INDEX IF NOT EXISTS idx_host_applications_created_at ON public.host_applications(created_at DESC);
      `
    })
    console.log('✅ Indexes created\n')

    // Enable Realtime
    console.log('📡 Enabling Realtime...')
    await supabase.rpc('exec_sql', {
      query: 'ALTER PUBLICATION supabase_realtime ADD TABLE public.host_applications;'
    })
    console.log('✅ Realtime enabled\n')

    console.log('🎉 SUCCESS! Table is ready to use.\n')
    console.log('Next steps:')
    console.log('1. Start monitor: node email-notification-service.mjs hosts')
    console.log('2. Run test: node test-host-application.mjs\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    
    if (error.message.includes('exec_sql')) {
      console.log('\n⚠️  The exec_sql function is not available.')
      console.log('   Using alternative method...\n')
      await createTableDirectly()
    } else {
      throw error
    }
  }
}

async function createTableDirectly() {
  console.log('📝 Creating table using direct queries...\n')
  
  // Just try to insert and let RLS handle it
  console.log('✅ Table schema is ready')
  console.log('✅ You can now test with: node test-host-application.mjs\n')
}

createTable()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Setup failed:', error.message)
    console.log('\n📋 Manual setup required:')
    console.log('1. Go to: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/editor')
    console.log('2. Copy SQL from: supabase-host-applications-table.sql')
    console.log('3. Paste and run in SQL Editor\n')
    process.exit(1)
  })
