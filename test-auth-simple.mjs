#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gzmxelgcdpaeklmabszo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjIxOTEsImV4cCI6MjA4MTc5ODE5MX0.nPNTqN3O6eWouM_dPafFpa93YDn8iZDWBdDnS1ZJBb8'

console.log('🧪 Testing Authentication')
console.log('='.repeat(60))
console.log(`Supabase URL: ${SUPABASE_URL}`)
console.log(`API Key: ${SUPABASE_ANON_KEY.substring(0, 50)}...`)
console.log('')

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Test 1: Sign Up
console.log('📝 TEST 1: Sign Up')
console.log('-'.repeat(60))
const testEmail = `test.${Date.now()}@merry360.com`
const testPassword = 'TestPassword123!'

try {
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        first_name: 'Test',
        last_name: 'User'
      }
    }
  })
  
  if (error) {
    console.log('❌ Sign Up Failed:', error.message)
  } else {
    console.log('✅ Sign Up Success!')
    console.log(`   User ID: ${data.user?.id}`)
    console.log(`   Email: ${data.user?.email}`)
  }
} catch (err) {
  console.log('❌ Error:', err.message)
}

console.log('')

// Test 2: Login
console.log('🔐 TEST 2: Login')
console.log('-'.repeat(60))

try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'bebisdavy@gmail.com',
    password: 'davy$100'
  })
  
  if (error) {
    console.log('❌ Login Failed:', error.message)
  } else {
    console.log('✅ Login Success!')
    console.log(`   User ID: ${data.user?.id}`)
    console.log(`   Email: ${data.user?.email}`)
  }
} catch (err) {
  console.log('❌ Error:', err.message)
}

console.log('')
console.log('🎉 Tests Complete!')
