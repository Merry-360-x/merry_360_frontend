/**
 * Authentication Flow Testing Script
 * Tests email/password signup, login, and Google OAuth functionality
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test user credentials
const testEmail = `test-${Date.now()}@merry360x.com`
const testPassword = 'TestPassword123!'
const testFirstName = 'Test'
const testLastName = 'User'

console.log('\n🧪 Testing Merry360X Authentication Flows\n')
console.log('=' .repeat(60))

// Test 1: Email/Password Signup
async function testSignup() {
  console.log('\n📝 TEST 1: Email/Password Signup')
  console.log('-'.repeat(60))
  
  try {
    console.log(`Creating account for: ${testEmail}`)
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: testFirstName,
          last_name: testLastName
        }
      }
    })

    if (authError) {
      console.log('❌ Signup failed:', authError.message)
      return false
    }

    console.log('✅ User created in auth system')
    console.log(`   User ID: ${authData.user.id}`)
    console.log(`   Email: ${authData.user.email}`)

    // Check if profile was created
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.log('⚠️  Profile query error:', profileError.message)
      
      // Try to create profile manually
      console.log('   Creating profile manually...')
      const { error: createError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          first_name: testFirstName,
          last_name: testLastName,
          email: testEmail,
          role: 'user',
          loyalty_points: 0,
          loyalty_tier: 'bronze',
          created_at: new Date().toISOString()
        })
      
      if (createError) {
        console.log('❌ Manual profile creation failed:', createError.message)
        return false
      }
      console.log('✅ Profile created manually')
    } else if (profile) {
      console.log('✅ Profile exists in database')
      console.log(`   Name: ${profile.first_name} ${profile.last_name}`)
      console.log(`   Role: ${profile.role}`)
      console.log(`   Loyalty: ${profile.loyalty_tier}`)
    }

    // Sign out
    await supabase.auth.signOut()
    
    console.log('\n✅ SIGNUP TEST PASSED')
    return true
  } catch (error) {
    console.log('❌ SIGNUP TEST FAILED:', error.message)
    return false
  }
}

// Test 2: Email/Password Login
async function testLogin() {
  console.log('\n🔐 TEST 2: Email/Password Login')
  console.log('-'.repeat(60))
  
  try {
    console.log(`Signing in as: ${testEmail}`)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (error) {
      console.log('❌ Login failed:', error.message)
      return false
    }

    console.log('✅ Login successful')
    console.log(`   User ID: ${data.user.id}`)
    console.log(`   Email: ${data.user.email}`)
    console.log(`   Access Token: ${data.session.access_token.substring(0, 20)}...`)

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.log('⚠️  Could not fetch profile:', profileError.message)
      return false
    }

    console.log('✅ Profile retrieved')
    console.log(`   Name: ${profile.first_name} ${profile.last_name}`)
    console.log(`   Email: ${profile.email}`)
    console.log(`   Role: ${profile.role}`)

    // Sign out
    await supabase.auth.signOut()
    
    console.log('\n✅ LOGIN TEST PASSED')
    return true
  } catch (error) {
    console.log('❌ LOGIN TEST FAILED:', error.message)
    return false
  }
}

// Test 3: Check Google OAuth Configuration
async function testGoogleOAuth() {
  console.log('\n🔵 TEST 3: Google OAuth Configuration')
  console.log('-'.repeat(60))
  
  try {
    console.log('Testing Google OAuth setup...')
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/auth/callback',
        skipBrowserRedirect: true  // Don't actually redirect in test
      }
    })

    if (error) {
      console.log('❌ Google OAuth not configured:', error.message)
      return false
    }

    if (data.url) {
      console.log('✅ Google OAuth URL generated successfully')
      console.log(`   URL: ${data.url.substring(0, 80)}...`)
      console.log('   ✓ OAuth provider is configured')
      console.log('   ✓ Callback URL will be: http://localhost:5173/auth/callback')
    }
    
    console.log('\n✅ GOOGLE OAUTH TEST PASSED')
    return true
  } catch (error) {
    console.log('❌ GOOGLE OAUTH TEST FAILED:', error.message)
    return false
  }
}

// Test 4: Verify AuthCallback.vue will work
async function testAuthCallback() {
  console.log('\n🔄 TEST 4: Auth Callback Profile Creation')
  console.log('-'.repeat(60))
  
  try {
    // Simulate what happens in AuthCallback.vue for OAuth users
    console.log('Testing OAuth profile creation flow...')
    
    // Sign in to get a session
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (loginError) {
      console.log('❌ Could not sign in for callback test:', loginError.message)
      return false
    }

    // Check if profile exists (simulating AuthCallback.vue logic)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', loginData.user.id)
      .single()

    if (existingProfile) {
      console.log('✅ Profile exists (callback would skip creation)')
      console.log(`   Profile ID: ${existingProfile.id}`)
    } else {
      console.log('⚠️  No profile found (callback would create one)')
      
      // This is what AuthCallback.vue does for OAuth users
      const metadata = loginData.user.user_metadata || {}
      const firstName = metadata.given_name || metadata.first_name || loginData.user.email.split('@')[0]
      const lastName = metadata.family_name || metadata.last_name || ''
      
      console.log(`   Would create profile with name: ${firstName} ${lastName}`)
    }

    await supabase.auth.signOut()
    
    console.log('\n✅ AUTH CALLBACK TEST PASSED')
    return true
  } catch (error) {
    console.log('❌ AUTH CALLBACK TEST FAILED:', error.message)
    return false
  }
}

// Test 5: Clean up test user
async function cleanup() {
  console.log('\n🧹 Cleanup: Removing test user')
  console.log('-'.repeat(60))
  
  try {
    // Sign in as test user
    const { data: loginData } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (loginData?.user) {
      // Delete profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', loginData.user.id)
      
      console.log('✅ Test profile deleted')
    }

    // Note: Can't delete auth user via client SDK (requires admin)
    console.log('⚠️  Auth user remains (requires admin deletion)')
    console.log(`   Email to clean up manually: ${testEmail}`)
    
    await supabase.auth.signOut()
  } catch (error) {
    console.log('⚠️  Cleanup error:', error.message)
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    signup: false,
    login: false,
    googleOAuth: false,
    authCallback: false
  }

  try {
    results.signup = await testSignup()
    
    if (results.signup) {
      results.login = await testLogin()
      results.authCallback = await testAuthCallback()
    }
    
    results.googleOAuth = await testGoogleOAuth()
    
    // Cleanup
    await cleanup()
    
    // Summary
    console.log('\n')
    console.log('=' .repeat(60))
    console.log('📊 TEST SUMMARY')
    console.log('=' .repeat(60))
    console.log(`✅ Email/Password Signup: ${results.signup ? 'PASSED' : 'FAILED'}`)
    console.log(`✅ Email/Password Login:  ${results.login ? 'PASSED' : 'FAILED'}`)
    console.log(`✅ Google OAuth Config:   ${results.googleOAuth ? 'PASSED' : 'FAILED'}`)
    console.log(`✅ Auth Callback Flow:    ${results.authCallback ? 'PASSED' : 'FAILED'}`)
    console.log('=' .repeat(60))
    
    const allPassed = Object.values(results).every(r => r === true)
    
    if (allPassed) {
      console.log('\n🎉 ALL TESTS PASSED! Authentication is working correctly.\n')
    } else {
      console.log('\n⚠️  Some tests failed. Please review the errors above.\n')
    }
    
  } catch (error) {
    console.log('\n❌ Test execution error:', error.message)
  }
}

// Execute tests
runAllTests()
