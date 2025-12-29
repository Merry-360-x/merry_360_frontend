#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import readline from 'readline'

const supabaseUrl = 'https://gzmxelgcdpaeklmabszo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMDQzNzAsImV4cCI6MjA0OTc4MDM3MH0.Oi3xCmPCYEjykOrLEp2AxBE8kzewy0nDNlbcGkuKL1w'

const supabase = createClient(supabaseUrl, supabaseKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

console.log('\n🧪 AUTHENTICATION FLOW TEST\n')
console.log('=' . repeat(50))

async function testSignup() {
  console.log('\n📝 TEST 1: Sign Up Flow')
  console.log('-'.repeat(50))
  
  const email = await question('Enter email: ')
  const password = await question('Enter password: ')
  const firstName = await question('Enter first name: ')
  const lastName = await question('Enter last name: ')
  
  console.log('\n🔄 Signing up...')
  
  try {
    // Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    })
    
    if (authError) {
      console.error('❌ Signup error:', authError.message)
      return
    }
    
    console.log('✅ User created:', authData.user.email)
    console.log('   User ID:', authData.user.id)
    
    // Create profile
    console.log('\n🔄 Creating profile...')
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: authData.user.email,
        first_name: firstName,
        last_name: lastName,
        role: 'user',
        loyalty_points: 0,
        loyalty_tier: 'bronze'
      })
      .select()
    
    if (profileError) {
      console.error('❌ Profile creation error:', profileError.message)
      return
    }
    
    console.log('✅ Profile created!')
    
    // Fetch profile to verify
    console.log('\n🔄 Fetching profile...')
    const { data: fetchedProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()
    
    if (fetchError) {
      console.error('❌ Profile fetch error:', fetchError.message)
      return
    }
    
    console.log('✅ Profile fetched successfully:')
    console.log(JSON.stringify(fetchedProfile, null, 2))
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

async function testLogin() {
  console.log('\n🔐 TEST 2: Login Flow')
  console.log('-'.repeat(50))
  
  const email = await question('Enter email: ')
  const password = await question('Enter password: ')
  
  console.log('\n🔄 Logging in...')
  
  try {
    // Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (authError) {
      console.error('❌ Login error:', authError.message)
      return
    }
    
    console.log('✅ Login successful!')
    console.log('   Email:', authData.user.email)
    console.log('   User ID:', authData.user.id)
    console.log('   Access Token:', authData.session.access_token.substring(0, 20) + '...')
    
    // Fetch profile
    console.log('\n🔄 Fetching profile...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()
    
    if (profileError) {
      console.error('❌ Profile fetch error:', profileError.message)
      return
    }
    
    console.log('✅ Profile fetched successfully:')
    console.log(JSON.stringify(profile, null, 2))
    
    // Test session persistence
    console.log('\n🔄 Testing session...')
    const { data: sessionData } = await supabase.auth.getSession()
    
    if (sessionData.session) {
      console.log('✅ Session exists!')
      console.log('   Session email:', sessionData.session.user.email)
    } else {
      console.log('❌ No session found!')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

async function testExistingSession() {
  console.log('\n🔍 TEST 3: Check Existing Session')
  console.log('-'.repeat(50))
  
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    
    if (sessionData.session) {
      console.log('✅ Active session found!')
      console.log('   Email:', sessionData.session.user.email)
      console.log('   User ID:', sessionData.session.user.id)
      
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single()
      
      if (profile) {
        console.log('\n✅ Profile data:')
        console.log(JSON.stringify(profile, null, 2))
      } else {
        console.log('❌ No profile found!')
      }
    } else {
      console.log('ℹ️  No active session')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function main() {
  console.log('\nSelect a test:')
  console.log('1. Test Sign Up')
  console.log('2. Test Login')
  console.log('3. Check Existing Session')
  console.log('4. Exit')
  
  const choice = await question('\nEnter your choice (1-4): ')
  
  switch (choice) {
    case '1':
      await testSignup()
      break
    case '2':
      await testLogin()
      break
    case '3':
      await testExistingSession()
      break
    case '4':
      console.log('\n👋 Goodbye!')
      rl.close()
      return
    default:
      console.log('❌ Invalid choice')
  }
  
  console.log('\n' + '='.repeat(50))
  rl.close()
}

main()
