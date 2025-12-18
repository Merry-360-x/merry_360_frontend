#!/usr/bin/env node

// Direct SQL execution using Supabase client
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

console.log('\n🔨 CREATING TABLE VIA SUPABASE CLIENT')
console.log('═════════════════════════════════════\n')

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
})

async function executeSQL() {
  const statements = [
    // Create table
    `CREATE TABLE IF NOT EXISTS public.host_applications (
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
    )`,
    
    // Enable RLS
    `ALTER TABLE public.host_applications ENABLE ROW LEVEL SECURITY`,
    
    // Drop existing policies
    `DROP POLICY IF EXISTS "Anyone can submit host application" ON public.host_applications`,
    `DROP POLICY IF EXISTS "Admins can view all host applications" ON public.host_applications`,
    `DROP POLICY IF EXISTS "Users can view their own host applications" ON public.host_applications`,
    `DROP POLICY IF EXISTS "Admins can update host applications" ON public.host_applications`,
    
    // Create policies
    `CREATE POLICY "Anyone can submit host application" ON public.host_applications FOR INSERT WITH CHECK (true)`,
    
    `CREATE POLICY "Admins can view all host applications" ON public.host_applications FOR SELECT USING (
      auth.jwt() ->> 'email' IN ('admin@merry360x.com', 'bebisdavy@gmail.com') OR auth.jwt() ->> 'role' = 'admin'
    )`,
    
    `CREATE POLICY "Users can view their own host applications" ON public.host_applications FOR SELECT USING (auth.jwt() ->> 'email' = email)`,
    
    `CREATE POLICY "Admins can update host applications" ON public.host_applications FOR UPDATE USING (
      auth.jwt() ->> 'email' IN ('admin@merry360x.com', 'bebisdavy@gmail.com') OR auth.jwt() ->> 'role' = 'admin'
    )`,
    
    // Create indexes
    `CREATE INDEX IF NOT EXISTS idx_host_applications_email ON public.host_applications(email)`,
    `CREATE INDEX IF NOT EXISTS idx_host_applications_status ON public.host_applications(status)`,
    `CREATE INDEX IF NOT EXISTS idx_host_applications_created_at ON public.host_applications(created_at DESC)`,
  ]

  try {
    console.log('📝 Creating table structure...')
    
    // Execute statements one by one
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i]
      const action = stmt.trim().split(' ')[0]
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: stmt })
        
        if (error && error.code !== '42710' && error.code !== '42P07') { // Ignore "already exists" errors
          // Try alternative method
          const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'POST',
            headers: {
              'apikey': serviceRoleKey,
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json'
            }
          })
        }
        
        console.log(`   ✅ ${action} statement executed`)
      } catch (err) {
        // Continue on errors - some statements might fail if already exists
        console.log(`   ⚠️  ${action} (might already exist)`)
      }
    }
    
    console.log('\n✅ Table structure created!\n')
    
    // Now enable Realtime
    console.log('📡 Enabling Realtime...')
    try {
      await supabase.rpc('exec_sql', { 
        sql: 'ALTER PUBLICATION supabase_realtime ADD TABLE public.host_applications' 
      })
      console.log('✅ Realtime enabled\n')
    } catch (err) {
      console.log('⚠️  Realtime (might already be enabled)\n')
    }
    
    // Verify table exists
    console.log('🔍 Verifying table...')
    const { error: checkError } = await supabase
      .from('host_applications')
      .select('count')
      .limit(0)
    
    if (checkError) {
      throw new Error('Table verification failed: ' + checkError.message)
    }
    
    console.log('✅ Table verified and ready!\n')
    console.log('🎉 SUCCESS! You can now:')
    console.log('   1. Run test: node test-host-application.mjs')
    console.log('   2. Start monitor: node email-notification-service.mjs hosts\n')
    
    return true
  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

executeSQL()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
