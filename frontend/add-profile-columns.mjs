#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gzmxelgcdpaeklmabszo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjIxOTEsImV4cCI6MjA4MTc5ODE5MX0.nPNTqN3O6eWouM_dPafFpa93YDn8iZDWBdDnS1ZJBb8'

console.log('🔧 Adding missing columns to profiles table')
console.log('=' .repeat(60))

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

try {
  // Use RPC to execute SQL as admin
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS date_of_birth DATE,
      ADD COLUMN IF NOT EXISTS bio TEXT;
    `
  })
  
  if (error) {
    console.log('❌ RPC not available, trying direct column check...')
    
    // Check if columns exist by trying to select them
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('date_of_birth, bio')
      .limit(1)
    
    if (testError && testError.message.includes('column') && testError.message.includes('does not exist')) {
      console.log('❌ Columns do not exist. Need to add them manually in Supabase dashboard.')
      console.log('')
      console.log('Please go to: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/editor')
      console.log('And run this SQL:')
      console.log('')
      console.log('ALTER TABLE profiles')
      console.log('ADD COLUMN IF NOT EXISTS date_of_birth DATE,')
      console.log('ADD COLUMN IF NOT EXISTS bio TEXT;')
      console.log('')
      process.exit(1)
    } else {
      console.log('✅ Columns already exist or accessible!')
    }
  } else {
    console.log('✅ Columns added successfully!')
  }
  
} catch (err) {
  console.error('Error:', err.message)
  console.log('')
  console.log('Please manually add these columns in Supabase dashboard:')
  console.log('1. Go to: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/editor')
  console.log('2. Click "New query" and run:')
  console.log('')
  console.log('ALTER TABLE profiles')
  console.log('ADD COLUMN IF NOT EXISTS date_of_birth DATE,')
  console.log('ADD COLUMN IF NOT EXISTS bio TEXT;')
}