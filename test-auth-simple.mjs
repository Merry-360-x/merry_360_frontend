#!/usr/bin/env node

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials')
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env/.env.local')
  process.exit(1)
}

console.log('🧪 Testing Authentication')
console.log('='.repeat(60))
console.log(`Supabase URL: ${SUPABASE_URL}`)
console.log(`Anon key set: ${SUPABASE_ANON_KEY.length > 0} (length: ${SUPABASE_ANON_KEY.length})`)
console.log('')

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Test 1: Sign Up
console.log('📝 TEST 1: Sign Up')
console.log('-'.repeat(60))
const testEmail = `test.${Date.now()}@merry360.com`
const testPassword = 'TestPassword123!'
let createdUserId = null
let emailConfirmed = null

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
    createdUserId = data.user?.id || null
    emailConfirmed = Boolean(data.user?.email_confirmed_at || data.user?.confirmed_at)
    console.log(`   User ID: ${createdUserId}`)
    console.log(`   Email: ${data.user?.email}`)
    console.log(`   Email confirmed: ${emailConfirmed}`)
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
    email: testEmail,
    password: testPassword
  })
  
  if (error) {
    // If email confirmations are enabled, Supabase may not allow immediate password login.
    if (emailConfirmed === false) {
      console.log('⏭️  Login Skipped: Email confirmation is enabled for this project')
      console.log('   Confirm the signup email (or disable confirmations) then re-run.')
    } else {
      console.log('❌ Login Failed:', error.message)
    }
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
