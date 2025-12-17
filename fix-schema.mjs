#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
})

console.log('🔧 Adding Missing Columns to Database...\n')

const sqlStatements = `
-- Add missing columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS loyalty_tier text DEFAULT 'bronze';

-- Update existing profiles
UPDATE public.profiles 
SET loyalty_points = COALESCE(loyalty_points, 0), 
    loyalty_tier = COALESCE(loyalty_tier, 'bronze');
`.trim().split(';').filter(s => s.trim())

for (const sql of sqlStatements) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query: sql.trim() + ';' })
    if (error) {
      // Try direct query
      console.log('⚠️  RPC failed, trying direct approach...')
    } else {
      console.log('✅', sql.substring(0, 50) + '...')
    }
  } catch (err) {
    console.log('⚠️ ', err.message)
  }
}

console.log('\n📋 Checking profiles table structure...\n')

// Check what we have now
const { data: profiles } = await supabase.from('profiles').select('*').limit(1)
if (profiles && profiles.length > 0) {
  console.log('✅ Profile columns:', Object.keys(profiles[0]))
} else {
  console.log('⚠️  No profiles exist yet')
}

console.log('\n' + '='.repeat(60))
console.log('⚠️  Manual Step Required:')
console.log('='.repeat(60))
console.log('\n1. Open: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/sql/new')
console.log('\n2. Copy and run this SQL:\n')
console.log(readFileSync('./add-missing-columns.sql', 'utf8'))
console.log('\n3. Then run: node test-live-features.mjs')
console.log('\n' + '='.repeat(60))
