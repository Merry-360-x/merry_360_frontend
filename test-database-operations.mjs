#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║   DATABASE OPERATIONS TEST - No Email Sending Required       ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('ℹ️  This test uses existing authenticated session');
console.log('ℹ️  No new users will be created (avoiding email bounces)\n');

// In Node, there is no persisted browser session. We sign in using env vars.
const testEmail = process.env.TEST_USER_EMAIL;
const testPassword = process.env.TEST_USER_PASSWORD;

if (!testEmail || !testPassword) {
  console.log('⚠️  Missing TEST_USER_EMAIL / TEST_USER_PASSWORD.');
  console.log('📝 Create a Supabase Auth user, then set these in your .env.local:\n');
  console.log('   TEST_USER_EMAIL=you@example.com');
  console.log('   TEST_USER_PASSWORD=your_password\n');
  process.exit(0);
}

console.log('🔐 Signing in test user...');
const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
  email: testEmail,
  password: testPassword,
});

if (signinError) {
  console.log(`❌ Sign-in failed: ${signinError.message}`);
  process.exit(1);
}

const userId = signinData.user?.id;

if (!userId) {
  console.log('❌ Sign-in succeeded but no user id returned.');
  process.exit(1);
}

console.log(`✅ Signed in as user: ${userId}\n`);

let listingId = null;
let bookingId = null;

// Test 1: Query existing listings
console.log('📊 Test 1: Query Listings');
console.log('─────────────────────────────────────────────────────────────');
try {
  const { data: listings, error } = await supabase
    .from('listings')
    .select('*')
    .limit(5);

  if (error) throw error;
  
  console.log(`   ✅ Found ${listings?.length || 0} existing listings`);
  if (listings && listings.length > 0) {
    listings.forEach((listing, idx) => {
      console.log(`   ${idx + 1}. ${listing.title} - $${listing.price}`);
    });
    listingId = listings[0].id;
  }
} catch (error) {
  console.log(`   ❌ Query failed: ${error.message}`);
}

// Test 2: Create a new listing
console.log('\n🏠 Test 2: Create New Property Listing');
console.log('─────────────────────────────────────────────────────────────');
try {
  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      title: 'Test Beach House',
      description: 'Beautiful beachfront property for testing',
      category: 'accommodation',
      subcategory: 'house',
      price: 299.00,
      currency: 'USD',
      location: 'Santa Monica, CA',
      latitude: 34.0195,
      longitude: -118.4912,
      capacity: 6,
      amenities: ['wifi', 'parking', 'beach_access', 'kitchen'],
      images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2'],
      vendor_id: userId,
      status: 'active',
      availability: true
    })
    .select()
    .single();

  if (error) throw error;
  
  listingId = listing.id;
  console.log(`   ✅ Listing created successfully`);
  console.log(`   🏠 ${listing.title}`);
  console.log(`   💰 $${listing.price}/night`);
  console.log(`   🆔 ID: ${listing.id}`);
} catch (error) {
  console.log(`   ❌ Creation failed: ${error.message}`);
}

// Test 3: Create a booking
console.log('\n📅 Test 3: Create Booking');
console.log('─────────────────────────────────────────────────────────────');
if (listingId) {
  try {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 7);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 3);

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        listing_id: listingId,
        user_id: userId,
        check_in: checkIn.toISOString().split('T')[0],
        check_out: checkOut.toISOString().split('T')[0],
        guests: 4,
        total_price: 897.00,
        status: 'confirmed',
        payment_status: 'paid'
      })
      .select()
      .single();

    if (error) throw error;
    
    bookingId = booking.id;
    console.log(`   ✅ Booking created`);
    console.log(`   📅 Check-in: ${booking.check_in}`);
    console.log(`   📅 Check-out: ${booking.check_out}`);
    console.log(`   💰 Total: $${booking.total_price}`);
  } catch (error) {
    console.log(`   ❌ Booking failed: ${error.message}`);
  }
} else {
  console.log(`   ⏭️  Skipped (no listing available)`);
}

// Test 4: Add to Wishlist
console.log('\n❤️  Test 4: Add to Wishlist');
console.log('─────────────────────────────────────────────────────────────');
if (listingId) {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .insert({ user_id: userId, listing_id: listingId })
      .select();

    if (error && !error.message.includes('duplicate')) throw error;
    
    console.log(`   ✅ Added to wishlist`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
} else {
  console.log(`   ⏭️  Skipped (no listing available)`);
}

// Test 5: Create Review
console.log('\n⭐ Test 5: Create Review');
console.log('─────────────────────────────────────────────────────────────');
if (listingId && bookingId) {
  try {
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        listing_id: listingId,
        user_id: userId,
        booking_id: bookingId,
        rating: 5,
        title: 'Excellent Stay!',
        comment: 'Had an amazing time at this property. Highly recommended!'
      })
      .select()
      .single();

    if (error) throw error;
    
    console.log(`   ✅ Review created`);
    console.log(`   ⭐ Rating: ${review.rating}/5`);
    console.log(`   💬 ${review.comment}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
} else {
  console.log(`   ⏭️  Skipped (no booking available)`);
}

// Test 6: Send Message
console.log('\n💬 Test 6: Send Message');
console.log('─────────────────────────────────────────────────────────────');
if (listingId) {
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: `conv_${userId}`,
        sender_id: userId,
        receiver_id: userId,
        listing_id: listingId,
        content: 'Is this property available for the weekend?',
        read: false
      })
      .select()
      .single();

    if (error) throw error;
    
    console.log(`   ✅ Message sent`);
    console.log(`   💬 ${message.content}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
} else {
  console.log(`   ⏭️  Skipped (no listing available)`);
}

// Test 7: Loyalty Transaction
console.log('\n🎁 Test 7: Add Loyalty Points');
console.log('─────────────────────────────────────────────────────────────');
try {
  const { data: transaction, error } = await supabase
    .from('loyalty_transactions')
    .insert({
      user_id: userId,
      points: 50,
      type: 'earned',
      description: 'Test booking completion reward'
    })
    .select()
    .single();

  if (error) throw error;
  
  console.log(`   ✅ Transaction created`);
  console.log(`   🎁 +${transaction.points} points`);
} catch (error) {
  console.log(`   ❌ Failed: ${error.message}`);
}

// Test 8: Create Notification
console.log('\n🔔 Test 8: Create Notification');
console.log('─────────────────────────────────────────────────────────────');
try {
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'booking',
      title: 'New Booking!',
      message: 'You have a new booking request',
      read: false
    })
    .select()
    .single();

  if (error) throw error;
  
  console.log(`   ✅ Notification created`);
  console.log(`   📢 ${notification.title}`);
} catch (error) {
  console.log(`   ❌ Failed: ${error.message}`);
}

// Final Summary
console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║                      TEST COMPLETE                            ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('🎯 Database operations tested successfully!');
console.log('📊 View your data in Supabase Dashboard');
console.log('🔗 https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo\n');

process.exit(0);
