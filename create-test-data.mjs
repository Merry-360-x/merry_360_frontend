#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

const adminClient = createClient(supabaseUrl, serviceRoleKey)

console.log('\n🎬 CREATING TEST DATA & ACCOUNTS')
console.log('=====================================\n')

// Admin email for notifications
const ADMIN_EMAIL = 'admin@merry360x.com'

// Test user credentials
const testUsers = {
  user: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'testuser@merry360.com',
    password: 'TestUser123!',
    role: 'user'
  },
  vendor: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'testvendor@merry360.com',
    password: 'TestVendor123!',
    role: 'vendor'
  },
  admin: {
    id: '33333333-3333-3333-3333-333333333333',
    email: ADMIN_EMAIL,
    password: 'TestAdmin123!',
    role: 'admin'
  }
}

// Create test properties
const testProperties = [
  {
    name: 'Sunset Beach Villa',
    location: 'Malibu, California',
    price: '1200/night',
    bedrooms: 4,
    bathrooms: 3.5,
    type: 'villa',
    description: 'Stunning beachfront villa with panoramic ocean views, private pool, and direct beach access.',
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen', 'Parking', 'Ocean View', 'BBQ', 'Hot Tub'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ],
    tour_360: ['https://example.com/tours/sunset-villa-living-room.jpg'],
    vr_content: ['https://example.com/vr/sunset-villa-tour.mp4'],
    available: true
  },
  {
    name: 'Downtown Luxury Apartment',
    location: 'Miami, Florida',
    price: '450/night',
    bedrooms: 2,
    bathrooms: 2,
    type: 'apartment',
    description: 'Modern apartment in the heart of downtown with stunning city views.',
    amenities: ['WiFi', 'Gym', 'Pool', 'Parking', 'City View', 'Concierge'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    tour_360: [],
    vr_content: [],
    available: true
  },
  {
    name: 'Mountain Retreat Cabin',
    location: 'Aspen, Colorado',
    price: '800/night',
    bedrooms: 3,
    bathrooms: 2,
    type: 'cabin',
    description: 'Cozy mountain cabin with fireplace, perfect for winter getaways.',
    amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Mountain View', 'Hot Tub', 'Ski Access'],
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800'
    ],
    tour_360: ['https://example.com/tours/mountain-cabin.jpg'],
    vr_content: [],
    available: true
  }
]

console.log('👥 Creating Test User Profiles...\n')

// Create profiles for test users
for (const [key, user] of Object.entries(testUsers)) {
  try {
    const { error } = await adminClient.from('profiles').upsert({
      id: user.id,
      email: user.email,
      first_name: key.charAt(0).toUpperCase() + key.slice(1),
      last_name: 'Test',
      role: user.role,
      loyalty_points: user.role === 'user' ? 500 : 0,
      loyalty_tier: user.role === 'user' ? 'bronze' : 'bronze',
      full_name: `${key.charAt(0).toUpperCase() + key.slice(1)} Test`,
      phone: '+1234567890',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    
    if (error) throw error
    console.log(`✅ ${key.toUpperCase()}: ${user.email} (${user.role})`)
    console.log(`   Password: ${user.password}`)
  } catch (err) {
    console.log(`⚠️  ${key}: ${err.message}`)
  }
}

console.log('\n🏠 Creating Test Properties...\n')

const createdProperties = []
for (const property of testProperties) {
  try {
    const { data, error } = await adminClient
      .from('properties')
      .insert([property])
      .select()
      .single()
    
    if (error) throw error
    createdProperties.push(data)
    console.log(`✅ ${data.name}`)
    console.log(`   Location: ${data.location}`)
    console.log(`   Price: ${data.price}`)
    console.log(`   ID: ${data.id}`)
  } catch (err) {
    console.log(`⚠️  ${property.name}: ${err.message}`)
  }
}

console.log('\n📅 Creating Test Booking...\n')

if (createdProperties.length > 0) {
  try {
    const property = createdProperties[0]
    const { data: booking, error } = await adminClient.from('bookings').insert([{
      user_id: testUsers.user.id,
      booking_type: 'accommodation',
      item_id: property.id,
      start_date: '2025-12-25',
      end_date: '2025-12-28',
      guests: 4,
      total_price: 3600,
      currency: 'USD',
      status: 'pending',
      booking_details: {
        property_name: property.name,
        guest_name: 'User Test',
        guest_email: testUsers.user.email,
        guest_phone: '+1234567890',
        special_requests: 'Early check-in if possible'
      }
    }]).select().single()
    
    if (error) throw error
    
    console.log(`✅ Booking Created!`)
    console.log(`   Property: ${property.name}`)
    console.log(`   Guest: ${testUsers.user.email}`)
    console.log(`   Check-in: 2025-12-25`)
    console.log(`   Check-out: 2025-12-28`)
    console.log(`   Total: $3,600`)
    console.log(`   Status: ${booking.status}`)
    console.log(`   Booking ID: ${booking.id}`)
  } catch (err) {
    console.log(`⚠️  Booking creation: ${err.message}`)
  }
}

console.log('\n' + '='.repeat(50))
console.log('📊 TEST DATA SUMMARY')
console.log('='.repeat(50))
console.log(`\n👥 Test Accounts Created: ${Object.keys(testUsers).length}`)
console.log(`🏠 Properties Created: ${createdProperties.length}`)
console.log(`📧 Admin Email: ${ADMIN_EMAIL}`)

console.log('\n📋 Test Account Credentials:')
console.log('─'.repeat(50))
for (const [key, user] of Object.entries(testUsers)) {
  console.log(`\n${key.toUpperCase()}:`)
  console.log(`  Email: ${user.email}`)
  console.log(`  Password: ${user.password}`)
  console.log(`  Role: ${user.role}`)
}

console.log('\n─'.repeat(50))
console.log('\n🎯 Next Steps:')
console.log('1. Login at www.merry360x.com/login')
console.log('2. Use test credentials above')
console.log('3. Browse properties and make bookings')
console.log('4. Check admin notifications')
console.log('\n✅ Test environment ready!\n')

process.exit(0)
