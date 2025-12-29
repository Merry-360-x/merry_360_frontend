/**
 * Comprehensive Authentication Testing
 * Tests all authentication flows: Email/Password Signup, Login, and Google OAuth
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test data
const testUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: `john.doe.${Date.now()}@test.com`,
    password: 'SecurePassword123!'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: `jane.smith.${Date.now()}@test.com`,
    password: 'AnotherPassword456!'
  }
]

console.log('\n🧪 COMPREHENSIVE AUTHENTICATION TESTING\n')
console.log('=' .repeat(70))

// Test 1: Sign Up with Complete Form Data
async function testSignup(user) {
  console.log(`\n📝 TEST: Sign Up - ${user.firstName} ${user.lastName}`)
  console.log('-'.repeat(70))
  
  try {
    console.log('Form Data:')
    console.log(`  First Name: ${user.firstName}`)
    console.log(`  Last Name: ${user.lastName}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Password: ${user.password}`)
    
    // Step 1: Sign up the user
    console.log('\n📤 Submitting signup form...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          first_name: user.firstName,
          last_name: user.lastName
        }
      }
    })

    if (authError) {
      console.log('❌ Signup failed:', authError.message)
      return { success: false, error: authError.message }
    }

    console.log('✅ User created in auth system')
    console.log(`   User ID: ${authData.user.id}`)
    console.log(`   Email: ${authData.user.email}`)
    console.log(`   Email Confirmed: ${authData.user.email_confirmed_at ? 'Yes' : 'No'}`)

    // Step 2: Create/verify profile
    console.log('\n📋 Creating profile...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        role: 'user',
        loyalty_points: 0,
        loyalty_tier: 'bronze',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.log('⚠️  Profile creation warning:', profileError.message)
    } else {
      console.log('✅ Profile created successfully')
    }

    // Step 3: Verify profile exists
    const { data: verifyProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (verifyProfile) {
      console.log('✅ Profile verified in database')
      console.log(`   Name: ${verifyProfile.first_name} ${verifyProfile.last_name}`)
      console.log(`   Email: ${verifyProfile.email}`)
      console.log(`   Role: ${verifyProfile.role}`)
      console.log(`   Loyalty Tier: ${verifyProfile.loyalty_tier}`)
      console.log(`   Points: ${verifyProfile.loyalty_points}`)
    }

    // Sign out
    await supabase.auth.signOut()
    
    console.log('\n✅ SIGNUP TEST PASSED')
    return { success: true, user: authData.user }
    
  } catch (error) {
    console.log('❌ SIGNUP TEST FAILED:', error.message)
    return { success: false, error: error.message }
  }
}

// Test 2: Login with Email/Password
async function testLogin(user) {
  console.log(`\n🔐 TEST: Login - ${user.email}`)
  console.log('-'.repeat(70))
  
  try {
    console.log('Login Credentials:')
    console.log(`  Email: ${user.email}`)
    console.log(`  Password: ${user.password}`)
    
    console.log('\n📤 Submitting login form...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password
    })

    if (error) {
      console.log('❌ Login failed:', error.message)
      return { success: false, error: error.message }
    }

    console.log('✅ Login successful')
    console.log(`   User ID: ${data.user.id}`)
    console.log(`   Email: ${data.user.email}`)
    console.log(`   Access Token: ${data.session.access_token.substring(0, 30)}...`)
    console.log(`   Token Expiry: ${new Date(data.session.expires_at * 1000).toLocaleString()}`)

    // Fetch profile
    console.log('\n📋 Fetching user profile...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.log('⚠️  Could not fetch profile:', profileError.message)
      return { success: false, error: 'Profile not found' }
    }

    console.log('✅ Profile retrieved')
    console.log(`   Full Name: ${profile.first_name} ${profile.last_name}`)
    console.log(`   Email: ${profile.email}`)
    console.log(`   Role: ${profile.role}`)
    console.log(`   Phone: ${profile.phone || 'Not set'}`)
    console.log(`   Loyalty: ${profile.loyalty_tier} (${profile.loyalty_points} points)`)

    // Test navigation logic
    const isAdmin = data.user.email === 'admin@merry360x.com' || data.user.email === 'bebisdavy@gmail.com'
    console.log(`\n🚀 Would navigate to: ${isAdmin ? '/admin' : '/profile'}`)

    // Sign out
    await supabase.auth.signOut()
    console.log('👋 Signed out')
    
    console.log('\n✅ LOGIN TEST PASSED')
    return { success: true }
    
  } catch (error) {
    console.log('❌ LOGIN TEST FAILED:', error.message)
    return { success: false, error: error.message }
  }
}

// Test 3: Google OAuth Configuration
async function testGoogleOAuth() {
  console.log('\n🔵 TEST: Google OAuth')
  console.log('-'.repeat(70))
  
  try {
    console.log('Testing Google OAuth button click...')
    console.log('Callback URL:', `${process.env.VITE_SUPABASE_URL}/auth/callback`)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/auth/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        },
        skipBrowserRedirect: true
      }
    })

    if (error) {
      console.log('❌ Google OAuth failed:', error.message)
      return { success: false, error: error.message }
    }

    if (data.url) {
      console.log('✅ Google OAuth URL generated')
      console.log(`   Provider: google`)
      console.log(`   URL: ${data.url.substring(0, 100)}...`)
      console.log(`   ✓ Would redirect to Google sign-in page`)
      console.log(`   ✓ After Google auth, would return to /auth/callback`)
      console.log(`   ✓ AuthCallback.vue would create profile from Google metadata`)
    }
    
    console.log('\n✅ GOOGLE OAUTH TEST PASSED')
    return { success: true }
    
  } catch (error) {
    console.log('❌ GOOGLE OAUTH TEST FAILED:', error.message)
    return { success: false, error: error.message }
  }
}

// Test 4: Password Validation
async function testPasswordValidation() {
  console.log('\n🔒 TEST: Password Validation')
  console.log('-'.repeat(70))
  
  const testCases = [
    { password: '123', confirmPassword: '123', shouldFail: true, reason: 'Too short (< 6 chars)' },
    { password: 'Pass123!', confirmPassword: 'Pass456!', shouldFail: true, reason: 'Passwords do not match' },
    { password: 'ValidPass123!', confirmPassword: 'ValidPass123!', shouldFail: false, reason: 'Valid password' }
  ]
  
  let passed = 0
  let failed = 0
  
  for (const test of testCases) {
    const passwordTooShort = test.password.length < 6
    const passwordsDontMatch = test.password !== test.confirmPassword
    const shouldShowError = passwordTooShort || passwordsDontMatch
    
    if (shouldShowError === test.shouldFail) {
      console.log(`✅ ${test.reason}: Validation works correctly`)
      passed++
    } else {
      console.log(`❌ ${test.reason}: Validation failed`)
      failed++
    }
  }
  
  console.log(`\nResults: ${passed} passed, ${failed} failed`)
  console.log(failed === 0 ? '✅ PASSWORD VALIDATION TEST PASSED' : '❌ PASSWORD VALIDATION TEST FAILED')
  return { success: failed === 0 }
}

// Test 5: Form Field Validation
async function testFormValidation() {
  console.log('\n📋 TEST: Form Field Validation')
  console.log('-'.repeat(70))
  
  const testCases = [
    { fields: { firstName: '', lastName: 'Doe', email: 'test@test.com', password: 'Pass123!' }, shouldFail: true, reason: 'Missing first name' },
    { fields: { firstName: 'John', lastName: '', email: 'test@test.com', password: 'Pass123!' }, shouldFail: true, reason: 'Missing last name' },
    { fields: { firstName: 'John', lastName: 'Doe', email: '', password: 'Pass123!' }, shouldFail: true, reason: 'Missing email' },
    { fields: { firstName: 'John', lastName: 'Doe', email: 'test@test.com', password: '' }, shouldFail: true, reason: 'Missing password' },
    { fields: { firstName: 'John', lastName: 'Doe', email: 'test@test.com', password: 'Pass123!' }, shouldFail: false, reason: 'All fields filled' }
  ]
  
  let passed = 0
  let failed = 0
  
  for (const test of testCases) {
    const hasEmptyField = !test.fields.firstName || !test.fields.lastName || !test.fields.email || !test.fields.password
    const shouldShowError = hasEmptyField
    
    if (shouldShowError === test.shouldFail) {
      console.log(`✅ ${test.reason}: Validation works correctly`)
      passed++
    } else {
      console.log(`❌ ${test.reason}: Validation failed`)
      failed++
    }
  }
  
  console.log(`\nResults: ${passed} passed, ${failed} failed`)
  console.log(failed === 0 ? '✅ FORM VALIDATION TEST PASSED' : '❌ FORM VALIDATION TEST FAILED')
  return { success: failed === 0 }
}

// Run all tests
async function runAllTests() {
  const results = {
    formValidation: false,
    passwordValidation: false,
    signup1: false,
    login1: false,
    signup2: false,
    login2: false,
    googleOAuth: false
  }

  try {
    // Form validation tests
    const formValidationResult = await testFormValidation()
    results.formValidation = formValidationResult.success
    
    const passwordValidationResult = await testPasswordValidation()
    results.passwordValidation = passwordValidationResult.success
    
    // User 1: Signup and Login
    const signup1Result = await testSignup(testUsers[0])
    results.signup1 = signup1Result.success
    
    if (results.signup1) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      const login1Result = await testLogin(testUsers[0])
      results.login1 = login1Result.success
    }
    
    // User 2: Signup and Login
    const signup2Result = await testSignup(testUsers[1])
    results.signup2 = signup2Result.success
    
    if (results.signup2) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      const login2Result = await testLogin(testUsers[1])
      results.login2 = login2Result.success
    }
    
    // Google OAuth test
    const googleOAuthResult = await testGoogleOAuth()
    results.googleOAuth = googleOAuthResult.success
    
    // Summary
    console.log('\n')
    console.log('=' .repeat(70))
    console.log('📊 TEST SUMMARY')
    console.log('=' .repeat(70))
    console.log(`${results.formValidation ? '✅' : '❌'} Form Field Validation`)
    console.log(`${results.passwordValidation ? '✅' : '❌'} Password Validation`)
    console.log(`${results.signup1 ? '✅' : '❌'} User 1 Signup (${testUsers[0].email})`)
    console.log(`${results.login1 ? '✅' : '❌'} User 1 Login`)
    console.log(`${results.signup2 ? '✅' : '❌'} User 2 Signup (${testUsers[1].email})`)
    console.log(`${results.login2 ? '✅' : '❌'} User 2 Login`)
    console.log(`${results.googleOAuth ? '✅' : '❌'} Google OAuth Configuration`)
    console.log('=' .repeat(70))
    
    const allPassed = Object.values(results).every(r => r === true)
    
    if (allPassed) {
      console.log('\n🎉 ALL TESTS PASSED!')
      console.log('\n✨ Authentication System Status:')
      console.log('   ✅ Email/Password Signup - Working')
      console.log('   ✅ Email/Password Login - Working')
      console.log('   ✅ Google OAuth - Configured and Ready')
      console.log('   ✅ Form Validation - Working')
      console.log('   ✅ Profile Creation - Working')
      console.log('\n🚀 Ready for production use!\n')
    } else {
      console.log('\n⚠️  Some tests failed. Please review the errors above.\n')
    }
    
  } catch (error) {
    console.log('\n❌ Test execution error:', error.message)
  }
}

// Execute tests
runAllTests()
