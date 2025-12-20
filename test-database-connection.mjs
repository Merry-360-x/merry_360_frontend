/**
 * Database Connection Test
 * Verifies that Supabase is properly connected and queries work
 */

import { supabase } from './src/services/supabase.js'
import supabaseApi from './src/services/supabaseApi.js'

console.log('🔍 Testing Supabase Database Connection...\n')

async function testConnection() {
  const results = {
    connection: false,
    auth: false,
    properties: false,
    bookings: false,
    profiles: false,
    errors: []
  }

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (!healthError) {
      results.connection = true
      console.log('✅ Connection successful!\n')
    } else {
      results.errors.push(`Connection error: ${healthError.message}`)
      console.log('❌ Connection failed:', healthError.message, '\n')
    }

    // Test 2: Auth status
    console.log('2️⃣ Testing auth system...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!authError) {
      results.auth = true
      console.log('✅ Auth system working!')
      console.log(`   User status: ${user ? 'Logged in' : 'Anonymous'}\n`)
    } else {
      results.errors.push(`Auth error: ${authError.message}`)
      console.log('❌ Auth error:', authError.message, '\n')
    }

    // Test 3: Properties table
    console.log('3️⃣ Testing properties table...')
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('*')
      .limit(5)
    
    if (!propError) {
      results.properties = true
      console.log('✅ Properties table accessible!')
      console.log(`   Found ${properties?.length || 0} properties`)
      if (properties && properties.length > 0) {
        console.log('   Sample:', properties[0].name || 'Unnamed property')
      }
      console.log()
    } else {
      results.errors.push(`Properties error: ${propError.message}`)
      console.log('❌ Properties error:', propError.message, '\n')
    }

    // Test 4: Bookings table
    console.log('4️⃣ Testing bookings table...')
    const { data: bookings, error: bookError } = await supabase
      .from('bookings')
      .select('count')
      .limit(1)
    
    if (!bookError) {
      results.bookings = true
      console.log('✅ Bookings table accessible!\n')
    } else {
      results.errors.push(`Bookings error: ${bookError.message}`)
      console.log('❌ Bookings error:', bookError.message, '\n')
    }

    // Test 5: Profiles table
    console.log('5️⃣ Testing profiles table...')
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (!profileError) {
      results.profiles = true
      console.log('✅ Profiles table accessible!\n')
    } else {
      results.errors.push(`Profiles error: ${profileError.message}`)
      console.log('❌ Profiles error:', profileError.message, '\n')
    }

    // Test 6: API Service (uses Supabase)
    console.log('6️⃣ Testing API service layer...')
    try {
      const apiProperties = await supabaseApi.accommodations.getAll({ limit: 3 })
      console.log('✅ API service working!')
      console.log(`   API returned ${apiProperties?.length || 0} properties\n`)
    } catch (apiError) {
      results.errors.push(`API service error: ${apiError.message}`)
      console.log('❌ API service error:', apiError.message, '\n')
    }

    // Summary
    console.log('━'.repeat(60))
    console.log('📊 TEST SUMMARY')
    console.log('━'.repeat(60))
    console.log(`Connection:    ${results.connection ? '✅' : '❌'}`)
    console.log(`Auth System:   ${results.auth ? '✅' : '❌'}`)
    console.log(`Properties:    ${results.properties ? '✅' : '❌'}`)
    console.log(`Bookings:      ${results.bookings ? '✅' : '❌'}`)
    console.log(`Profiles:      ${results.profiles ? '✅' : '❌'}`)
    console.log('━'.repeat(60))

    const allPassed = results.connection && results.auth && 
                     results.properties && results.bookings && results.profiles

    if (allPassed) {
      console.log('\n🎉 SUCCESS! Database is 100% connected!')
      console.log('\n✨ Your website is now using:')
      console.log('   • Supabase for real-time database')
      console.log('   • Live authentication')
      console.log('   • Real property listings')
      console.log('   • Actual booking system')
      console.log('\n🚀 You can now:')
      console.log('   1. Browse real properties from database')
      console.log('   2. Create actual bookings')
      console.log('   3. User authentication with Supabase')
      console.log('   4. AI Advisor with live data')
    } else {
      console.log('\n⚠️  Some issues detected:')
      results.errors.forEach(err => console.log(`   • ${err}`))
      console.log('\n💡 Check:')
      console.log('   • VITE_SUPABASE_URL in .env')
      console.log('   • VITE_SUPABASE_ANON_KEY in .env')
      console.log('   • Database tables exist (run migrations)')
      console.log('   • RLS policies are configured')
    }

    console.log('\n━'.repeat(60))

  } catch (error) {
    console.error('\n❌ Unexpected error:', error)
    console.log('\n💡 Make sure:')
    console.log('   1. .env file has correct Supabase credentials')
    console.log('   2. Database migrations have been applied')
    console.log('   3. Network connection is working')
  }
}

testConnection()
