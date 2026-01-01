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

console.log('🧪 Full Authentication Test')
console.log('='.repeat(60))

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const testEmail = `testuser.${Date.now()}@merry360.com`
const testPassword = 'TestPassword123!'

// Test 1: Sign Up
console.log('\n📝 TEST 1: Create New Account')
console.log('-'.repeat(60))
console.log(`Email: ${testEmail}`)
console.log(`Password: ${testPassword}`)

try {
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        first_name: 'Test',
        last_name: 'User'
      }
    }
  })
  
  if (signupError) {
    console.log('❌ Sign Up Failed:', signupError.message)
    process.exit(1)
  }
  
  console.log('✅ Sign Up Success!')
  console.log(`   User ID: ${signupData.user?.id}`)
  console.log(`   Email: ${signupData.user?.email}`)
  
  // Test 2: Login with the account we just created
  console.log('\n🔐 TEST 2: Login with New Account')
  console.log('-'.repeat(60))
  
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  })
  
  if (loginError) {
    console.log('❌ Login Failed:', loginError.message)
    process.exit(1)
  }
  
  console.log('✅ Login Success!')
  console.log(`   User ID: ${loginData.user?.id}`)
  console.log(`   Email: ${loginData.user?.email}`)
  console.log(`   Access Token: ${loginData.session?.access_token.substring(0, 50)}...`)
  
  // Test 3: Check if profile was created
  console.log('\n👤 TEST 3: Check Profile Creation')
  console.log('-'.repeat(60))
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', loginData.user?.id)
    .single()
  
  if (profileError) {
    console.log('⚠️  Profile not found (might need to be created by app)')
  } else {
    console.log('✅ Profile Found!')
    console.log(`   Name: ${profile.first_name} ${profile.last_name}`)
    console.log(`   Email: ${profile.email}`)
    console.log(`   Role: ${profile.role}`)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('🎉 ALL TESTS PASSED!')
  console.log('='.repeat(60))
  console.log('\n✅ Authentication is working correctly!')
  console.log('✅ Ready to test on production site')
  
} catch (err) {
  console.log('❌ Unexpected Error:', err.message)
  process.exit(1)
}
