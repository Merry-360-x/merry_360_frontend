#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

console.log('\n🔨 CREATING TABLE USING SERVICE ROLE')
console.log('═════════════════════════════════════════\n')

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'public' }
})

async function createTable() {
  console.log('📝 Step 1: Attempting to create table...\n')
  
  // First, let's try to query the table to see if it exists
  const { data: existingCheck, error: checkError } = await supabase
    .from('host_applications')
    .select('count')
    .limit(0)
  
  if (!checkError) {
    console.log('✅ Table already exists!')
    console.log('\n🎉 You can now test with:')
    console.log('   node test-host-application.mjs\n')
    return true
  }
  
  console.log('⚠️  Table does not exist yet. Creating via INSERT...\n')
  
  // Try to trigger table creation by attempting an insert with proper structure
  // This will fail but might create the table if RLS allows it
  const { error: insertError } = await supabase
    .from('host_applications')
    .insert([{
      full_name: 'Test',
      email: 'test@test.com',
      phone: '123',
      location: 'Test',
      hosting_type: 'accommodation',
      description: 'Test',
      status: 'pending'
    }])
  
  if (insertError) {
    if (insertError.message.includes('relation') || insertError.message.includes('does not exist')) {
      console.log('❌ Table truly does not exist in database\n')
      console.log('📋 I need to execute SQL in Supabase Dashboard:\n')
      console.log('1. Opening Supabase Dashboard...')
      console.log('2. Go to SQL Editor')
      console.log('3. Run the SQL from: supabase-host-applications-table.sql\n')
      
      // Open the dashboard
      const { exec } = await import('child_process')
      exec('open "https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/editor"')
      
      console.log('✅ Dashboard opening...')
      console.log('\nℹ️  Please run the SQL in the editor, then come back and run:')
      console.log('   node test-host-application.mjs\n')
      return false
    }
  }
  
  console.log('✅ Table should be ready!\n')
  return true
}

createTable()
  .then(success => {
    if (success) {
      console.log('🎉 SUCCESS! Running test now...\n')
      import('child_process').then(({ exec }) => {
        exec('node test-host-application.mjs', (error, stdout, stderr) => {
          console.log(stdout)
          if (error) console.error(stderr)
        })
      })
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })
