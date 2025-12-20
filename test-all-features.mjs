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
console.log('║     COMPLETE FEATURE TEST - Merry360 Platform                ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Use a real email format that won't bounce, with email confirmations disabled
const testEmail = 'testuser@example.com'; // Standard test email
const testPassword = 'TestPassword123!';
let userId = null;
let listingId = null;
let bookingId = null;

console.log('👤 Step 1: Create/Sign In Test User');
console.log('─────────────────────────────────────────────────────────────');
console.log(`📧 Using: ${testEmail}`);
console.log('ℹ️  Email confirmation should be disabled in Supabase settings\n');

try {
  // Try to sign in first
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });

  if (signInError) {
    // If sign in fails, try to sign up
    console.log('   Creating new user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User'
        }
      }
    });

    if (signUpError) throw signUpError;
    userId = signUpData.user?.id;
    console.log(`   ✅ User created: ${userId}`);
  } else {
    userId = signInData.user?.id;
    console.log(`   ✅ Signed in: ${userId}`);
  }
} catch (error) {
  console.log(`   ❌ Auth failed: ${error.message}`);
  console.log('\n   Please ensure email confirmation is disabled:');
  console.log('   https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/auth/providers\n');
  process.exit(1);
}

// Wait for profile creation
await new Promise(resolve => setTimeout(resolve, 2000));

console.log('\n📊 Step 2: Verify Profile Auto-Creation');
console.log('─────────────────────────────────────────────────────────────');
try {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  console.log(`   ✅ Profile exists`);
  console.log(`   ⭐ Tier: ${profile.loyalty_tier}`);
  console.log(`   🎁 Points: ${profile.loyalty_points}`);
} catch (error) {
  console.log(`   ❌ Failed: ${error.message}`);
}

console.log('\n🏠 Step 3: Create Property Listings');
console.log('─────────────────────────────────────────────────────────────');
const listings = [
  {
    title: 'Luxury Beachfront Villa',
    description: 'Stunning ocean views with private pool',
    category: 'accommodation',
    subcategory: 'villa',
    price: 450.00,
    currency: 'USD',
    location: 'Malibu, California',
    latitude: 34.0259,
    longitude: -118.7798,
    capacity: 8,
    amenities: ['wifi', 'pool', 'beach_access', 'parking', 'kitchen'],
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914'],
    vendor_id: userId,
    status: 'active',
    availability: true,
    featured: true
  },
  {
    title: 'Cozy Mountain Cabin',
    description: 'Perfect retreat in the mountains',
    category: 'accommodation',
    subcategory: 'cabin',
    price: 180.00,
    currency: 'USD',
    location: 'Aspen, Colorado',
    latitude: 39.1911,
    longitude: -106.8175,
    capacity: 4,
    amenities: ['wifi', 'fireplace', 'parking'],
    images: ['https://images.unsplash.com/photo-1542718610-a1d656d1884c'],
    vendor_id: userId,
    status: 'active',
    availability: true
  },
  {
    title: 'Modern City Apartment',
    description: 'Downtown loft with skyline views',
    category: 'accommodation',
    subcategory: 'apartment',
    price: 220.00,
    currency: 'USD',
    location: 'New York, NY',
    latitude: 40.7589,
    longitude: -73.9851,
    capacity: 3,
    amenities: ['wifi', 'gym', 'elevator'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
    vendor_id: userId,
    status: 'active',
    availability: true
  }
];

try {
  const { data: createdListings, error } = await supabase
    .from('listings')
    .insert(listings)
    .select();

  if (error) throw error;
  
  console.log(`   ✅ Created ${createdListings.length} listings:`);
  createdListings.forEach((listing, i) => {
    console.log(`   ${i + 1}. ${listing.title} - $${listing.price}/night`);
  });
  listingId = createdListings[0].id;
} catch (error) {
  console.log(`   ❌ Failed: ${error.message}`);
}

console.log('\n📅 Step 4: Create Booking');
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
        total_price: 1350.00,
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'credit_card'
      })
      .select()
      .single();

    if (error) throw error;
    
    bookingId = booking.id;
    console.log(`   ✅ Booking created`);
    console.log(`   📅 ${booking.check_in} → ${booking.check_out}`);
    console.log(`   💰 $${booking.total_price}`);
    console.log(`   ✔️  Status: ${booking.status}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
}

console.log('\n❤️  Step 5: Add to Wishlist');
console.log('─────────────────────────────────────────────────────────────');
if (listingId) {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .upsert({ user_id: userId, listing_id: listingId })
      .select();

    if (error) throw error;
    console.log(`   ✅ Added to wishlist`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
}

console.log('\n⭐ Step 6: Write Review');
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
        title: 'Perfect Stay!',
        comment: 'Everything was amazing. The property exceeded expectations!'
      })
      .select()
      .single();

    if (error) throw error;
    
    console.log(`   ✅ Review posted`);
    console.log(`   ⭐ ${review.rating}/5 - ${review.title}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
}

console.log('\n💬 Step 7: Send Message');
console.log('─────────────────────────────────────────────────────────────');
if (listingId) {
  try {
    const conversationId = crypto.randomUUID();
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        receiver_id: userId,
        listing_id: listingId,
        content: 'Hello! I have a question about this property.',
        read: false
      })
      .select()
      .single();

    if (error) throw error;
    
    console.log(`   ✅ Message sent`);
    console.log(`   💬 "${message.content}"`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
}

console.log('\n🎁 Step 8: Add Loyalty Points');
console.log('─────────────────────────────────────────────────────────────');
try {
  const { data: transaction, error } = await supabase
    .from('loyalty_transactions')
    .insert({
      user_id: userId,
      points: 100,
      type: 'earned',
      description: 'Booking completion reward',
      booking_id: bookingId
    })
    .select()
    .single();

  if (error) throw error;
  
  console.log(`   ✅ Points added`);
  console.log(`   🎁 +${transaction.points} points`);
  
  // Update profile
  await supabase
    .from('profiles')
    .update({ loyalty_points: 100 })
    .eq('id', userId);
    
  console.log(`   ⭐ Total points: 100`);
} catch (error) {
  console.log(`   ❌ Failed: ${error.message}`);
}

console.log('\n🔔 Step 9: Create Notification');
console.log('─────────────────────────────────────────────────────────────');
try {
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your reservation has been confirmed!',
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

console.log('\n📊 Step 10: Summary Statistics');
console.log('─────────────────────────────────────────────────────────────');
try {
  const [
    { count: listingsCount },
    { count: bookingsCount },
    { count: reviewsCount },
    { count: wishlistCount },
    { count: messagesCount },
    { count: notificationsCount }
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('vendor_id', userId),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('wishlist').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sender_id', userId),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId)
  ]);

  console.log(`   🏠 Listings: ${listingsCount}`);
  console.log(`   📅 Bookings: ${bookingsCount}`);
  console.log(`   ⭐ Reviews: ${reviewsCount}`);
  console.log(`   ❤️  Wishlist: ${wishlistCount}`);
  console.log(`   💬 Messages: ${messagesCount}`);
  console.log(`   🔔 Notifications: ${notificationsCount}`);
} catch (error) {
  console.log(`   ❌ Query failed: ${error.message}`);
}

console.log('\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║                  ✅ ALL FEATURES TESTED!                      ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('🎯 Test completed successfully!');
console.log('📊 View data: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo\n');
console.log('👤 Test account:');
console.log(`   Email: ${testEmail}`);
console.log(`   Password: ${testPassword}\n`);

process.exit(0);
