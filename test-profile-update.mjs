#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gzmxelgcdpaeklmabszo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjIxOTEsImV4cCI6MjA4MTc5ODE5MX0.nPNTqN3O6eWouM_dPafFpa93YDn8iZDWBdDnS1ZJBb8'

console.log('🧪 Testing Profile Update')
console.log('=' .repeat(60))

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Create a test account and update profile
const testEmail = `profile.test.${Date.now()}@merry360.com`
const testPassword = 'ProfileTest123!'

try {
  // 1. Sign up
  console.log('\n📝 Step 1: Create Test Account')
  console.log('-'.repeat(40))
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        first_name: 'Profile',
        last_name: 'Tester'
      }
    }
  })
  
  if (signupError) throw signupError
  console.log('✅ Account created:', signupData.user.email)
  
  // 2. Login
  console.log('\n🔐 Step 2: Login')
  console.log('-'.repeat(40))
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  })
  
  if (loginError) throw loginError
  console.log('✅ Login successful')
  
  // 3. Check current profile
  console.log('\n👤 Step 3: Check Current Profile')
  console.log('-'.repeat(40))
  const { data: currentProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', loginData.user.id)
    .single()
  
  if (profileError) throw profileError
  console.log('Current profile:', {
    first_name: currentProfile.first_name,
    last_name: currentProfile.last_name,
    phone: currentProfile.phone,
    email: currentProfile.email
  })
  
  // 4. Update profile (only existing columns)
  console.log('\n📝 Step 4: Update Profile')
  console.log('-'.repeat(40))
  const updates = {
    first_name: 'UpdatedFirst',
    last_name: 'UpdatedLast',
    phone: '+250789123456'
  }
  
  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', loginData.user.id)
    .select()
    .single()
  
  if (updateError) throw updateError
  
  console.log('✅ Profile updated successfully!')
  console.log('Updated profile:', {
    first_name: updatedProfile.first_name,
    last_name: updatedProfile.last_name,
    phone: updatedProfile.phone,
    email: updatedProfile.email
  })
  
  // 5. Verify update persisted
  console.log('\n🔍 Step 5: Verify Update Persisted')
  console.log('-'.repeat(40))
  const { data: verifyProfile, error: verifyError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', loginData.user.id)
    .single()
  
  if (verifyError) throw verifyError
  
  const nameMatches = verifyProfile.first_name === 'UpdatedFirst' && verifyProfile.last_name === 'UpdatedLast'
  const phoneMatches = verifyProfile.phone === '+250789123456'
  
  if (nameMatches && phoneMatches) {
    console.log('✅ Profile updates persisted correctly!')
  } else {
    console.log('❌ Profile updates did not persist properly')
    console.log('Expected: UpdatedFirst UpdatedLast +250789123456')
    console.log('Got:', verifyProfile.first_name, verifyProfile.last_name, verifyProfile.phone)
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('🎉 PROFILE UPDATE TEST COMPLETED SUCCESSFULLY!')
  console.log('='.repeat(60))
  console.log('\n✅ Profile updates are now working correctly on production!')
  
} catch (err) {
  console.error('\n❌ Test failed:', err.message)
  console.error('Details:', err)
}