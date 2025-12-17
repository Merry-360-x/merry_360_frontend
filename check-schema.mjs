#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzAwMDksImV4cCI6MjA4MTA0NjAwOX0.K_8LajqS6qNjMnM3FMVICXyhJG2c8yecNt-glByuhMs'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Checking Database Schema...\n')

// Check profiles table
console.log('📋 Profiles Table:')
try {
  const { data, error } = await supabase.from('profiles').select('*').limit(1)
  if (error) {
    console.log('❌ Error:', error.message)
  } else {
    console.log('✅ Columns:', data.length > 0 ? Object.keys(data[0]) : 'No data yet')
  }
} catch (err) {
  console.log('❌ Error:', err.message)
}

// Check bookings table
console.log('\n📋 Bookings Table:')
try {
  const { data, error } = await supabase.from('bookings').select('*').limit(1)
  if (error) {
    console.log('❌ Error:', error.message)
  } else {
    console.log('✅ Columns:', data.length > 0 ? Object.keys(data[0]) : 'No data yet')
  }
} catch (err) {
  console.log('❌ Error:', err.message)
}

// Check properties table
console.log('\n📋 Properties Table:')
try {
  const { data, error } = await supabase.from('properties').select('*').limit(1)
  if (error) {
    console.log('❌ Error:', error.message)
  } else {
    console.log('✅ Columns:', data.length > 0 ? Object.keys(data[0]) : 'No data yet')
  }
} catch (err) {
  console.log('❌ Error:', err.message)
}

// Check payments table
console.log('\n📋 Payments Table:')
try {
  const { data, error } = await supabase.from('payments').select('*').limit(1)
  if (error) {
    console.log('❌ Error:', error.message)
  } else {
    console.log('✅ Columns:', data.length > 0 ? Object.keys(data[0]) : 'No data yet')
  }
} catch (err) {
  console.log('❌ Error:', err.message)
}

// Check conversations table
console.log('\n📋 Conversations Table:')
try {
  const { data, error } = await supabase.from('conversations').select('*').limit(1)
  if (error) {
    console.log('❌ Error:', error.message)
  } else {
    console.log('✅ Columns:', data.length > 0 ? Object.keys(data[0]) : 'No data yet')
  }
} catch (err) {
  console.log('❌ Error:', err.message)
}

// Check messages table
console.log('\n📋 Messages Table:')
try {
  const { data, error } = await supabase.from('messages').select('*').limit(1)
  if (error) {
    console.log('❌ Error:', error.message)
  } else {
    console.log('✅ Columns:', data.length > 0 ? Object.keys(data[0]) : 'No data yet')
  }
} catch (err) {
  console.log('❌ Error:', err.message)
}

console.log('\n✅ Schema check complete!')
