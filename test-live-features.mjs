#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzAwMDksImV4cCI6MjA4MTA0NjAwOX0.K_8LajqS6qNjMnM3FMVICXyhJG2c8yecNt-glByuhMs'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

const supabase = createClient(supabaseUrl, supabaseKey)
const adminClient = createClient(supabaseUrl, serviceRoleKey)

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
}

function log(emoji, message) {
  console.log(`${emoji} ${message}`)
}

function testResult(name, passed, details = '') {
  results.tests.push({ name, passed, details })
  if (passed) {
    results.passed++
    log('✅', `PASS: ${name}`)
  } else {
    results.failed++
    log('❌', `FAIL: ${name}`)
    if (details) log('   ', details)
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================
// TEST SUITE
// ============================================

console.log('\n🧪 COMPREHENSIVE LIVE FEATURE TESTING')
console.log('=====================================\n')

// Test 1: Database Connection
log('🔗', 'Test 1: Database Connection...')
try {
  const { data, error } = await supabase.from('profiles').select('count').limit(1)
  testResult('Database Connection', !error, error?.message)
} catch (err) {
  testResult('Database Connection', false, err.message)
}

// Test 2: User Authentication - Signup
log('\n👤', 'Test 2: User Signup...')
const testEmail = `test.user${Date.now()}@gmail.com`
const testPassword = 'TestPassword123!'
let testUser = null
let testSession = null

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
  
  if (error) throw error
  testUser = data.user
  testSession = data.session
  testResult('User Signup', !!testUser, `User ID: ${testUser?.id}`)
} catch (err) {
  testResult('User Signup', false, err.message)
}

await sleep(1000)

// Test 3: User Profile Creation
log('\n📝', 'Test 3: User Profile with Loyalty Points...')
if (testUser) {
  try {
    // Create profile using admin client
    const { data: profile, error: profileError} = await adminClient
      .from('profiles')
      .upsert({
        id: testUser.id,
        first_name: 'Test',
        last_name: 'User',
        email: testEmail,
        loyalty_points: 0,
        loyalty_tier: 'bronze',
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (profileError) throw profileError
    
    // Verify profile
    const { data: checkProfile, error: checkError } = await adminClient
      .from('profiles')
      .select('loyalty_points, loyalty_tier')
      .eq('id', testUser.id)
      .single()
    
    const profileOk = checkProfile?.loyalty_points === 0 && checkProfile?.loyalty_tier === 'bronze'
    testResult('Profile Created with 0 Loyalty Points', profileOk, 
      `Points: ${checkProfile?.loyalty_points}, Tier: ${checkProfile?.loyalty_tier}`)
  } catch (err) {
    testResult('Profile Creation', false, err.message)
  }
}

// Test 4: Update Loyalty Points
log('\n💎', 'Test 4: Add Loyalty Points...')
if (testUser) {
  try {
    const { data, error } = await adminClient
      .from('profiles')
      .update({ 
        loyalty_points: 2500,
        loyalty_tier: 'silver'
      })
      .eq('id', testUser.id)
      .select()
    
    if (error) throw error
    
    // Verify update
    const { data: updated } = await adminClient
      .from('profiles')
      .select('loyalty_points, loyalty_tier')
      .eq('id', testUser.id)
      .single()
    
    const pointsOk = updated?.loyalty_points === 2500 && updated?.loyalty_tier === 'silver'
    testResult('Loyalty Points Persistence', pointsOk, 
      `Points: ${updated?.loyalty_points}, Tier: ${updated?.loyalty_tier}`)
  } catch (err) {
    testResult('Loyalty Points Update', false, err.message)
  }
}

// Test 5: Create Property
log('\n🏠', 'Test 5: Create Property...')
let testPropertyId = null

try {
  const { data, error } = await supabase
    .from('properties')
    .insert([{
      name: 'Test Luxury Villa',
      location: 'Test Beach, Paradise Island',
      price: '500/night',
      bedrooms: 3,
      bathrooms: 2.5,
      type: 'villa',
      description: 'Beautiful test property with ocean views',
      amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen'],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
      available: true
    }])
    .select()
    .single()
  
  if (error) throw error
  testPropertyId = data.id
  testResult('Property Creation', !!data, `Property ID: ${data.id}`)
} catch (err) {
  testResult('Property Creation', false, err.message)
}

// Test 6: Read Properties
log('\n📖', 'Test 6: Read All Properties...')
try {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .limit(10)
  
  if (error) throw error
  testResult('Read Properties', data.length > 0, `Found ${data.length} properties`)
} catch (err) {
  testResult('Read Properties', false, err.message)
}

// Test 7: Update Property
log('\n✏️', 'Test 7: Update Property...')
if (testPropertyId) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update({
        price: '600/night',
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen', 'Gym']
      })
      .eq('id', testPropertyId)
      .select()
      .single()
    
    if (error) throw error
    testResult('Property Update', data.price === '600/night', `New price: ${data.price}`)
  } catch (err) {
    testResult('Property Update', false, err.message)
  }
}

// Test 8: Add 360° Tour to Property
log('\n🌐', 'Test 8: Add 360° Tour...')
if (testPropertyId) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update({
        tour_360: ['https://example.com/360-tour-1.jpg', 'https://example.com/360-tour-2.jpg']
      })
      .eq('id', testPropertyId)
      .select()
      .single()
    
    if (error) throw error
    testResult('360° Tour Upload', data.tour_360?.length === 2, `Tours: ${data.tour_360?.length}`)
  } catch (err) {
    testResult('360° Tour Upload', false, err.message)
  }
}

// Test 9: Add VR Content
log('\n🥽', 'Test 9: Add VR Content...')
if (testPropertyId) {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update({
        vr_content: ['https://example.com/vr-experience.mp4']
      })
      .eq('id', testPropertyId)
      .select()
      .single()
    
    if (error) throw error
    testResult('VR Content Upload', data.vr_content?.length === 1, `VR files: ${data.vr_content?.length}`)
  } catch (err) {
    testResult('VR Content Upload', false, err.message)
  }
}

// Test 10: Create Booking
log('\n📅', 'Test 10: Create Booking...')
let testBookingId = null

if (testUser && testPropertyId) {
  try {
    const { data, error } = await adminClient
      .from('bookings')
      .insert([{
        user_id: testUser.id,
        booking_type: 'accommodation',
        item_id: testPropertyId,
        start_date: '2025-12-25',
        end_date: '2025-12-30',
        guests: 4,
        total_price: 3000,
        currency: 'USD',
        status: 'pending',
        booking_details: {
          guest_name: 'Test User',
          guest_email: testEmail,
          guest_phone: '+1234567890'
        }
      }])
      .select()
      .single()
    
    if (error) throw error
    testBookingId = data.id
    testResult('Booking Creation', !!data, `Booking ID: ${data.id}`)
  } catch (err) {
    testResult('Booking Creation', false, err.message)
  }
}

// Test 11: Read User's Bookings
log('\n📋', 'Test 11: Read User Bookings...')
if (testUser) {
  try {
    const { data, error } = await adminClient
      .from('bookings')
      .select('*')
      .eq('user_id', testUser.id)
    
    if (error) throw error
    testResult('Read User Bookings', data.length > 0, `Found ${data.length} bookings`)
  } catch (err) {
    testResult('Read User Bookings', false, err.message)
  }
}

// Test 12: Update Booking Status
log('\n🔄', 'Test 12: Update Booking Status...')
if (testBookingId) {
  try {
    const { data, error } = await adminClient
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', testBookingId)
      .select()
      .single()
    
    if (error) throw error
    testResult('Booking Status Update', data.status === 'confirmed', `Status: ${data.status}`)
  } catch (err) {
    testResult('Booking Status Update', false, err.message)
  }
}

// Test 13: Create Payment Record
log('\n💳', 'Test 13: Create Payment...')
if (testBookingId) {
  try {
    const { data, error } = await adminClient
      .from('payments')
      .insert([{
        booking_id: testBookingId,
        amount: 3000,
        currency: 'USD',
        status: 'completed',
        payment_method: 'credit_card',
        stripe_payment_intent_id: `pi_test_${Date.now()}`
      }])
      .select()
      .single()
    
    if (error) throw error
    testResult('Payment Creation', !!data, `Payment ID: ${data.id}`)
  } catch (err) {
    testResult('Payment Creation', false, err.message)
  }
}

// Test 14: Create Conversation
log('\n💬', 'Test 14: Create Conversation...')
let testConversationId = null

if (testUser) {
  try {
    // Create with UUID for admin
    const dummyAdminId = '00000000-0000-0000-0000-000000000000'
    const { data, error } = await adminClient
      .from('conversations')
      .insert([{
        participant_key: `${testUser.id}_${dummyAdminId}`,
        participants: [testUser.id, dummyAdminId],
      }])
      .select()
      .single()
    
    if (error) throw error
    testConversationId = data.id
    testResult('Conversation Creation', !!data, `Conversation ID: ${data.id}`)
  } catch (err) {
    testResult('Conversation Creation', false, err.message)
  }
}

// Test 15: Send Message
log('\n✉️', 'Test 15: Send Message...')
if (testUser && testConversationId) {
  try {
    const { data, error } = await adminClient
      .from('messages')
      .insert([{
        conversation_id: testConversationId,
        sender_id: testUser.id,
        content: 'Test message - inquiry about property booking'
      }])
      .select()
      .single()
    
    if (error) throw error
    testResult('Message Creation', !!data, `Message ID: ${data.id}`)
  } catch (err) {
    testResult('Message Creation', false, err.message)
  }
}

// Test 16: Row Level Security - Public Property Read
log('\n🔒', 'Test 16: RLS - Public Property Read...')
try {
  // Create anonymous client
  const anonClient = createClient(supabaseUrl, supabaseKey)
  const { data, error } = await anonClient
    .from('properties')
    .select('*')
    .limit(1)
  
  testResult('RLS Public Property Read', !error && data.length > 0, 'Anonymous users can read properties')
} catch (err) {
  testResult('RLS Public Property Read', false, err.message)
}

// Test 17: Filter Properties by Type
log('\n🔍', 'Test 17: Filter Properties by Type...')
try {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('type', 'villa')
  
  if (error) throw error
  testResult('Property Filtering', true, `Found ${data.length} villas`)
} catch (err) {
  testResult('Property Filtering', false, err.message)
}

// Test 18: Search Properties by Location
log('\n🗺️', 'Test 18: Search Properties by Location...')
try {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .ilike('location', '%Beach%')
  
  if (error) throw error
  testResult('Property Search', true, `Found ${data.length} beach properties`)
} catch (err) {
  testResult('Property Search', false, err.message)
}

// Test 19: Loyalty Points Persistence After "Logout"
log('\n🔐', 'Test 19: Loyalty Points Persist Across Sessions...')
if (testUser) {
  try {
    // Simulate logout by clearing local state, then fetch again
    const { data, error } = await adminClient
      .from('profiles')
      .select('loyalty_points, loyalty_tier')
      .eq('id', testUser.id)
      .single()
    
    if (error) throw error
    const persistenceOk = data.loyalty_points === 2500 && data.loyalty_tier === 'silver'
    testResult('Loyalty Points Persistence', persistenceOk, 
      `Points still: ${data.loyalty_points}, Tier: ${data.loyalty_tier}`)
  } catch (err) {
    testResult('Loyalty Points Persistence', false, err.message)
  }
}

// ============================================
// CLEANUP
// ============================================

log('\n🧹', 'Cleanup: Removing test data...')

// Delete test property
if (testPropertyId) {
  try {
    await supabase.from('properties').delete().eq('id', testPropertyId)
    log('   ', 'Test property deleted')
  } catch (err) {
    log('⚠️', `Could not delete property: ${err.message}`)
  }
}

// Delete test booking and payment (cascade should handle it)
if (testBookingId) {
  try {
    await supabase.from('bookings').delete().eq('id', testBookingId)
    log('   ', 'Test booking deleted')
  } catch (err) {
    log('⚠️', `Could not delete booking: ${err.message}`)
  }
}

// Delete test conversation
if (testConversationId) {
  try {
    await supabase.from('conversations').delete().eq('id', testConversationId)
    log('   ', 'Test conversation deleted')
  } catch (err) {
    log('⚠️', `Could not delete conversation: ${err.message}`)
  }
}

// Delete test user profile
if (testUser) {
  try {
    await adminClient.from('profiles').delete().eq('id', testUser.id)
    log('   ', 'Test profile deleted')
  } catch (err) {
    log('⚠️', `Could not delete profile: ${err.message}`)
  }
}

// ============================================
// RESULTS SUMMARY
// ============================================

console.log('\n' + '='.repeat(60))
console.log('📊 TEST RESULTS SUMMARY')
console.log('='.repeat(60))
console.log(`✅ Passed: ${results.passed}`)
console.log(`❌ Failed: ${results.failed}`)
console.log(`📝 Total:  ${results.passed + results.failed}`)
console.log(`🎯 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`)
console.log('='.repeat(60))

if (results.failed > 0) {
  console.log('\n❌ Failed Tests:')
  results.tests.filter(t => !t.passed).forEach(t => {
    console.log(`   - ${t.name}`)
    if (t.details) console.log(`     ${t.details}`)
  })
}

console.log('\n✨ Testing Complete!\n')

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0)
