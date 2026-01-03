import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Found' : '✗ Missing')
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✓ Found' : '✗ Missing')
  process.exit(1)
}

console.log('🔗 Connecting to Supabase:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyMigration() {
  console.log('\n🚀 Applying live support system migration...\n')

  try {
    const sql = readFileSync('supabase/migrations/create_live_support_tables.sql', 'utf8')
    
    console.log('📝 Migration SQL loaded')
    console.log('⚠️  Note: Supabase client cannot execute DDL statements directly.')
    console.log('   You need to run the SQL manually in Supabase Dashboard.\n')

    console.error('📌 MANUAL SETUP REQUIRED:')
    console.error('   1. Go to: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/editor')
    console.error('   2. Click "SQL Editor" in the left sidebar')
    console.error('   3. Click "New Query"')
    console.error('   4. Copy the entire contents from: supabase/migrations/create_live_support_tables.sql')
    console.error('   5. Paste into the SQL editor')
    console.error('   6. Click "Run" or press Cmd/Ctrl + Enter')
    console.error('\n✅ Once done, the live chat system will be fully functional!')
    console.error('   Test at: https://merry-360-frontend-mu80poj6c-das-48ca2629.vercel.app/')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

applyMigration()
