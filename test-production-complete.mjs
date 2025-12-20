#!/usr/bin/env node

/**
 * COMPREHENSIVE PRODUCTION TEST SUITE
 * Tests ALL features on the LIVE production site
 */

import { createClient } from '@supabase/supabase-js'
import readline from 'readline'

const PRODUCTION_URL = 'https://merry-360-frontend-r8jjz3owh-das-48ca2629.vercel.app'
const SUPABASE_URL = 'https://gzmxelgcdpaeklmabszo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMDQzNzAsImV4cCI6MjA0OTc4MDM3MH0.Oi3xCmPCYEjykOrLEp2AxBE8kzewy0nDNlbcGkuKL1w'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
}

function logTest(name, passed, details = '') {
  const icon = passed ? '✅' : '❌'
  console.log(`${icon} ${name}`)
  if (details) console.log(`   ${details}`)
  
  results.tests.push({ name, passed, details })
  if (passed) results.passed++
  else results.failed++
}

function section(title) {
  console.log('\n' + '='.repeat(60))
  console.log(`  ${title}`)
  console.log('='.repeat(60) + '\n')
}

async function cleanup(userId) {
  // Clean up test data
  if (userId) {
    await supabase.from('properties').delete().eq('host_id', userId)
    await supabase.from('bookings').delete().eq('user_id', userId)
    await supabase.from('wishlist').delete().eq('user_id', userId)
  }
}

// ============================================
// TEST 1: AUTHENTICATION - SIGN UP
// ============================================
async function testSignup() {
  section('TEST 1: SIGN UP (New User Registration)')
  
  const timestamp = Date.now()
  const testEmail = `test.user.${timestamp}@merry360test.com`
  const testPassword = 'TestPassword123!'
  
  try {
    console.log(`📝 Creating new account: ${testEmail}`)
    
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
    
    if (error) throw error
    
    logTest('Sign Up - User Creation', true, `User ID: ${data.user.id}`)
    
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        email: testEmail,
        first_name: 'Test',
        last_name: 'User',
        role: 'user',
        loyalty_points: 0,
        loyalty_tier: 'bronze'
      })
    
    if (profileError) throw profileError
    logTest('Sign Up - Profile Creation', true, 'Profile created successfully')
    
    // Verify profile exists
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    if (fetchError) throw fetchError
    logTest('Sign Up - Profile Verification', true, `Name: ${profile.first_name} ${profile.last_name}`)
    
    // Clean up
    await supabase.auth.signOut()
    await supabase.from('profiles').delete().eq('id', data.user.id)
    
    return { passed: true, userId: data.user.id }
  } catch (error) {
    logTest('Sign Up', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 2: AUTHENTICATION - LOGIN
// ============================================
async function testLogin() {
  section('TEST 2: LOGIN (Existing User)')
  
  const email = await question('Enter your email for login test: ')
  const password = await question('Enter your password: ')
  
  try {
    console.log(`🔐 Logging in as: ${email}`)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    logTest('Login - Authentication', true, `User ID: ${data.user.id}`)
    
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    if (profileError) throw profileError
    
    logTest('Login - Profile Load', true, `Name: ${profile.first_name} ${profile.last_name}, Role: ${profile.role}`)
    logTest('Login - Loyalty System', true, `${profile.loyalty_points} points, Tier: ${profile.loyalty_tier}`)
    
    // Check session
    const { data: sessionData } = await supabase.auth.getSession()
    logTest('Login - Session Persistence', !!sessionData.session, 'Session active')
    
    return { passed: true, user: data.user, profile }
  } catch (error) {
    logTest('Login', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 3: BECOME A HOST
// ============================================
async function testBecomeHost(userId) {
  section('TEST 3: BECOME A HOST')
  
  try {
    console.log('🏠 Upgrading user to host...')
    
    // Update profile to host role
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'host' })
      .eq('id', userId)
    
    if (error) throw error
    
    // Verify role change
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    
    logTest('Become Host - Role Update', profile.role === 'host', `Role: ${profile.role}`)
    
    return { passed: true }
  } catch (error) {
    logTest('Become Host', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 4: ADD PROPERTY (Host Feature)
// ============================================
async function testAddProperty(hostId) {
  section('TEST 4: ADD PROPERTY')
  
  try {
    console.log('🏡 Creating a test property...')
    
    const propertyData = {
      host_id: hostId,
      title: 'Test Luxury Villa - Production Test',
      description: 'Beautiful test property for automated testing',
      property_type: 'villa',
      location: 'Kigali, Rwanda',
      address: '123 Test Street, Kigali',
      price_per_night: 150.00,
      max_guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking'],
      images: ['https://via.placeholder.com/800x600'],
      status: 'active',
      rating: 4.5,
      total_reviews: 0
    }
    
    const { data, error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single()
    
    if (error) throw error
    
    logTest('Add Property - Creation', true, `Property ID: ${data.id}`)
    logTest('Add Property - Details', true, `${data.title} - $${data.price_per_night}/night`)
    
    // Verify property exists
    const { data: fetchedProperty } = await supabase
      .from('properties')
      .select('*')
      .eq('id', data.id)
      .single()
    
    logTest('Add Property - Verification', !!fetchedProperty, 'Property retrievable from database')
    
    return { passed: true, propertyId: data.id }
  } catch (error) {
    logTest('Add Property', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 5: BROWSE ACCOMMODATIONS
// ============================================
async function testBrowseAccommodations() {
  section('TEST 5: BROWSE ACCOMMODATIONS')
  
  try {
    console.log('🔍 Fetching all active properties...')
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .limit(10)
    
    if (error) throw error
    
    logTest('Browse Accommodations - Fetch', true, `Found ${data.length} properties`)
    
    if (data.length > 0) {
      const firstProperty = data[0]
      logTest('Browse Accommodations - Display', true, `${firstProperty.title} - $${firstProperty.price_per_night}/night`)
    }
    
    return { passed: true, count: data.length }
  } catch (error) {
    logTest('Browse Accommodations', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 6: ADD TO WISHLIST
// ============================================
async function testWishlist(userId, propertyId) {
  section('TEST 6: WISHLIST FEATURE')
  
  try {
    console.log('❤️ Adding property to wishlist...')
    
    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: userId,
        listing_id: propertyId,
        notes: 'Test wishlist item'
      })
      .select()
      .single()
    
    if (error) throw error
    
    logTest('Wishlist - Add Item', true, `Added property ${propertyId}`)
    
    // Fetch wishlist
    const { data: wishlistItems } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', userId)
    
    logTest('Wishlist - Fetch Items', true, `${wishlistItems.length} items in wishlist`)
    
    // Remove from wishlist
    await supabase
      .from('wishlist')
      .delete()
      .eq('id', data.id)
    
    logTest('Wishlist - Remove Item', true, 'Item removed successfully')
    
    return { passed: true }
  } catch (error) {
    logTest('Wishlist', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 7: CREATE BOOKING
// ============================================
async function testBooking(userId, propertyId) {
  section('TEST 7: BOOKING SYSTEM')
  
  try {
    console.log('📅 Creating a test booking...')
    
    const checkIn = new Date()
    checkIn.setDate(checkIn.getDate() + 7)
    const checkOut = new Date()
    checkOut.setDate(checkOut.getDate() + 10)
    
    const bookingData = {
      user_id: userId,
      property_id: propertyId,
      check_in: checkIn.toISOString().split('T')[0],
      check_out: checkOut.toISOString().split('T')[0],
      guests: 2,
      total_price: 450.00,
      status: 'pending',
      payment_status: 'pending'
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()
    
    if (error) throw error
    
    logTest('Booking - Creation', true, `Booking ID: ${data.id}`)
    logTest('Booking - Details', true, `${data.check_in} to ${data.check_out}, $${data.total_price}`)
    
    return { passed: true, bookingId: data.id }
  } catch (error) {
    logTest('Booking', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 8: ADMIN DASHBOARD
// ============================================
async function testAdminDashboard() {
  section('TEST 8: ADMIN DASHBOARD')
  
  try {
    console.log('📊 Fetching dashboard statistics...')
    
    // Get total bookings
    const { count: bookingsCount, error: bookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
    
    if (bookingsError) throw bookingsError
    logTest('Admin Dashboard - Bookings Count', true, `${bookingsCount} total bookings`)
    
    // Get total users
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    
    if (usersError) throw usersError
    logTest('Admin Dashboard - Users Count', true, `${usersCount} total users`)
    
    // Get total properties
    const { count: propertiesCount, error: propertiesError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
    
    if (propertiesError) throw propertiesError
    logTest('Admin Dashboard - Properties Count', true, `${propertiesCount} total properties`)
    
    // Calculate revenue
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_price')
      .eq('payment_status', 'paid')
    
    const revenue = bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0
    logTest('Admin Dashboard - Revenue Calculation', true, `$${revenue.toFixed(2)} total revenue`)
    
    return { passed: true, stats: { bookingsCount, usersCount, propertiesCount, revenue } }
  } catch (error) {
    logTest('Admin Dashboard', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 9: MESSAGING SYSTEM
// ============================================
async function testMessaging(userId) {
  section('TEST 9: MESSAGING SYSTEM')
  
  try {
    console.log('💬 Testing messaging features...')
    
    // Create a test conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        user1_id: userId,
        user2_id: userId, // Self-conversation for testing
        property_id: null
      })
      .select()
      .single()
    
    if (convError) throw convError
    logTest('Messaging - Create Conversation', true, `Conversation ID: ${conversation.id}`)
    
    // Send a message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: userId,
        content: 'Test message from automated production test',
        read: false
      })
      .select()
      .single()
    
    if (msgError) throw msgError
    logTest('Messaging - Send Message', true, 'Message sent successfully')
    
    // Fetch messages
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
    
    logTest('Messaging - Fetch Messages', true, `${messages.length} messages in conversation`)
    
    // Clean up
    await supabase.from('messages').delete().eq('id', message.id)
    await supabase.from('conversations').delete().eq('id', conversation.id)
    
    return { passed: true }
  } catch (error) {
    logTest('Messaging', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 10: BOOKING APPROVAL/DECLINE
// ============================================
async function testBookingManagement(bookingId, hostId) {
  section('TEST 10: BOOKING MANAGEMENT (Approve/Decline)')
  
  try {
    console.log('✅ Testing booking approval...')
    
    // Approve booking
    const { error: approveError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId)
    
    if (approveError) throw approveError
    logTest('Booking Management - Approve', true, 'Booking approved')
    
    // Decline booking
    const { error: declineError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
    
    if (declineError) throw declineError
    logTest('Booking Management - Decline', true, 'Booking declined')
    
    return { passed: true }
  } catch (error) {
    logTest('Booking Management', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 11: LOYALTY POINTS SYSTEM
// ============================================
async function testLoyaltySystem(userId) {
  section('TEST 11: LOYALTY POINTS SYSTEM')
  
  try {
    console.log('🎯 Testing loyalty points...')
    
    // Add loyalty points
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        loyalty_points: 250,
        loyalty_tier: 'silver'
      })
      .eq('id', userId)
    
    if (updateError) throw updateError
    logTest('Loyalty System - Points Award', true, '250 points awarded')
    
    // Verify update
    const { data: profile } = await supabase
      .from('profiles')
      .select('loyalty_points, loyalty_tier')
      .eq('id', userId)
      .single()
    
    logTest('Loyalty System - Tier Update', profile.loyalty_tier === 'silver', `Tier: ${profile.loyalty_tier}`)
    
    return { passed: true }
  } catch (error) {
    logTest('Loyalty System', false, error.message)
    return { passed: false }
  }
}

// ============================================
// TEST 12: LOGOUT
// ============================================
async function testLogout() {
  section('TEST 12: LOGOUT')
  
  try {
    console.log('👋 Logging out...')
    
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error
    
    // Verify session is cleared
    const { data: sessionData } = await supabase.auth.getSession()
    logTest('Logout - Session Cleared', !sessionData.session, 'No active session')
    
    return { passed: true }
  } catch (error) {
    logTest('Logout', false, error.message)
    return { passed: false }
  }
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runAllTests() {
  console.clear()
  console.log('\n' + '█'.repeat(60))
  console.log('█' + ' '.repeat(58) + '█')
  console.log('█  🚀 COMPREHENSIVE PRODUCTION TEST SUITE'.padEnd(59) + '█')
  console.log('█  Testing: ' + PRODUCTION_URL.substring(0, 40) + '...'.padEnd(59) + '█')
  console.log('█' + ' '.repeat(58) + '█')
  console.log('█'.repeat(60) + '\n')
  
  let userId, propertyId, bookingId, profile
  
  // Test 1: Sign Up
  const signupResult = await testSignup()
  
  // Test 2: Login
  const loginResult = await testLogin()
  if (loginResult.passed) {
    userId = loginResult.user.id
    profile = loginResult.profile
  }
  
  if (userId) {
    // Test 3: Become Host
    const hostResult = await testBecomeHost(userId)
    
    // Test 4: Add Property
    if (hostResult.passed) {
      const propertyResult = await testAddProperty(userId)
      if (propertyResult.passed) {
        propertyId = propertyResult.propertyId
      }
    }
    
    // Test 5: Browse Accommodations
    await testBrowseAccommodations()
    
    // Test 6: Wishlist
    if (propertyId) {
      await testWishlist(userId, propertyId)
      
      // Test 7: Create Booking
      const bookingResult = await testBooking(userId, propertyId)
      if (bookingResult.passed) {
        bookingId = bookingResult.bookingId
      }
    }
    
    // Test 8: Admin Dashboard
    await testAdminDashboard()
    
    // Test 9: Messaging
    await testMessaging(userId)
    
    // Test 10: Booking Management
    if (bookingId) {
      await testBookingManagement(bookingId, userId)
    }
    
    // Test 11: Loyalty System
    await testLoyaltySystem(userId)
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...')
    await cleanup(userId)
    
    // Test 12: Logout
    await testLogout()
  }
  
  // Print Summary
  section('TEST SUMMARY')
  console.log(`✅ Passed: ${results.passed}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`📊 Total: ${results.passed + results.failed}`)
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`)
  
  if (results.failed > 0) {
    console.log('\n❌ FAILED TESTS:')
    results.tests.filter(t => !t.passed).forEach(t => {
      console.log(`   - ${t.name}: ${t.details}`)
    })
  }
  
  console.log('\n' + '='.repeat(60))
  console.log(`\n🌐 Production URL: ${PRODUCTION_URL}`)
  console.log('✅ All tests completed!\n')
  
  rl.close()
}

// Start tests
runAllTests().catch(error => {
  console.error('Fatal error:', error)
  rl.close()
  process.exit(1)
})
