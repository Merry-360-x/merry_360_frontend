#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

const adminClient = createClient(supabaseUrl, serviceRoleKey)

// ============================================
// TWILIO CONFIGURATION (SMS + WhatsApp)
// ============================================
// CHEAPEST OPTION: Single provider for both SMS & WhatsApp!
// Get credentials from: https://console.twilio.com/
const TWILIO_CONFIG = {
  accountSid: 'AC0cbb76d7bff822ddef701585c7438b84',  // From Twilio Console
  authToken: 'YOUR_AUTH_TOKEN_HERE',               // ⚠️ ADD YOUR AUTH TOKEN HERE!
  
  // SMS Configuration
  smsFrom: '+14155238886',                         // Twilio phone number
  
  // WhatsApp Configuration
  whatsappFrom: 'whatsapp:+14155238886',          // Twilio Sandbox (free testing)
  
  // API URL
  apiUrl: 'https://api.twilio.com/2010-04-01/Accounts'
}

// Admin contact (receives booking notifications)
const ADMIN_PHONE = '+250792527083'     // Your phone number (SMS & WhatsApp)
const ADMIN_EMAIL = 'admin@merry360x.com'

// ============================================
// COST BREAKDOWN (TWILIO PAY-AS-YOU-GO)
// ============================================
// SMS: $0.0079 per message (US)
// WhatsApp: $0.005 per message
// Example: 100 bookings/month = 200 SMS + 200 WhatsApp = $2.58/month!
// ============================================

// ============================================
// MESSAGE TEMPLATES
// ============================================

function getClientSMS(booking, property) {
  const checkIn = new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const checkOut = new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  
  return `✅ BOOKING CONFIRMED!

${property.name}
${checkIn} - ${checkOut} | ${booking.guests} guests

Total: $${booking.total_price}
Booking ID: ${booking.id.slice(0, 8)}

Questions? Reply to this SMS
www.merry360x.com

Thank you! - Merry360 Team`
}

function getClientWhatsApp(booking, property) {
  const checkIn = new Date(booking.start_date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
  
  const checkOut = new Date(booking.end_date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
  
  return `🎉 *Booking Confirmed!*

Thank you for booking with Merry360! ✨

*Property:* ${property.name}
*Location:* ${property.location}

*Check-in:* ${checkIn}
*Check-out:* ${checkOut}
*Guests:* ${booking.guests}

*Total:* $${booking.total_price.toLocaleString()} ${booking.currency}
*Booking ID:* ${booking.id}

${booking.booking_details?.special_requests ? `\n*Special Requests:*\n${booking.booking_details.special_requests}\n` : ''}
📞 *Need help?* Reply to this message
🌐 www.merry360x.com

Thank you for choosing Merry360! 🙏`
}

function getAdminSMS(booking, property) {
  return `🔔 NEW BOOKING

${property.name}
Guest: ${booking.booking_details?.guest_name || 'Unknown'}
Phone: ${booking.booking_details?.guest_phone || 'N/A'}

${new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
${booking.guests} guests | $${booking.total_price}

ID: ${booking.id.slice(0, 8)}
View: www.merry360x.com/admin/bookings

CONFIRM ASAP`
}

function getAdminWhatsApp(booking, property) {
  const checkIn = new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const checkOut = new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  
  return `🔔 *NEW BOOKING ALERT!*

*${property.name}*

━━━━━━━━━━━━━━━━
👤 *Guest:* ${booking.booking_details?.guest_name || 'Unknown'}
📧 ${booking.booking_details?.guest_email || 'N/A'}
📱 ${booking.booking_details?.guest_phone || 'N/A'}

📅 ${checkIn} - ${checkOut}
👥 ${booking.guests} guests
💰 $${booking.total_price.toLocaleString()}

🆔 ${booking.id.slice(0, 13)}
━━━━━━━━━━━━━━━━

${booking.booking_details?.special_requests ? `📝 *Special:* ${booking.booking_details.special_requests}\n\n` : ''}⚡ *ACTION REQUIRED*
View: www.merry360x.com/admin/bookings`
}

// ============================================
// TWILIO SENDING FUNCTIONS
// ============================================

async function sendTwilioMessage(to, message, type = 'sms') {
  const { accountSid, authToken, smsFrom, whatsappFrom, apiUrl } = TWILIO_CONFIG
  
  // Check if configured
  if (accountSid === 'your-twilio-account-sid') {
    console.log(`⚠️  Twilio not configured. ${type.toUpperCase()} preview:`)
    console.log('─'.repeat(60))
    console.log(`To: ${to}`)
    console.log(message)
    console.log('─'.repeat(60))
    return { success: false, error: 'Not configured' }
  }
  
  const url = `${apiUrl}/${accountSid}/Messages.json`
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')
  
  const fromNumber = type === 'whatsapp' ? whatsappFrom : smsFrom
  const toNumber = type === 'whatsapp' ? `whatsapp:${to}` : to
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: toNumber,
        Body: message
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || `Twilio ${type} error`)
    }
    
    const cost = type === 'sms' ? '$0.0079' : '$0.005'
    console.log(`✅ ${type.toUpperCase()} sent! ID: ${data.sid} (Cost: ${cost})`)
    
    return { success: true, messageId: data.sid, cost: cost }
  } catch (error) {
    console.error(`❌ ${type.toUpperCase()} failed:`, error.message)
    return { success: false, error: error.message }
  }
}

async function sendSMS(to, message) {
  console.log(`\n📱 Sending SMS to ${to}...`)
  return await sendTwilioMessage(to, message, 'sms')
}

async function sendWhatsApp(to, message) {
  console.log(`\n📱 Sending WhatsApp to ${to}...`)
  return await sendTwilioMessage(to, message, 'whatsapp')
}

// ============================================
// SEND BOOKING NOTIFICATIONS
// ============================================

async function sendBookingNotifications(booking, property) {
  console.log('\n' + '='.repeat(60))
  console.log('📱 SENDING BOOKING NOTIFICATIONS')
  console.log('='.repeat(60))
  
  const results = {
    clientSMS: null,
    clientWhatsApp: null,
    adminSMS: null,
    adminWhatsApp: null,
    totalCost: 0
  }
  
  // Get guest phone
  const guestPhone = booking.booking_details?.guest_phone
  
  // Send to GUEST
  if (guestPhone) {
    console.log('\n📤 GUEST NOTIFICATIONS:')
    console.log(`   Sending to: ${guestPhone}`)
    
    // Guest SMS
    const clientSMS = getClientSMS(booking, property)
    results.clientSMS = await sendSMS(guestPhone, clientSMS)
    
    // Guest WhatsApp
    const clientWhatsApp = getClientWhatsApp(booking, property)
    results.clientWhatsApp = await sendWhatsApp(guestPhone, clientWhatsApp)
  } else {
    console.log('\n⚠️  Guest phone not provided - skipping guest notifications')
  }
  
  // Send to ADMIN
  console.log('\n📤 ADMIN/VENDOR NOTIFICATIONS:')
  console.log(`   Sending to: ${ADMIN_PHONE}`)
  
  // Admin SMS
  const adminSMS = getAdminSMS(booking, property)
  results.adminSMS = await sendSMS(ADMIN_PHONE, adminSMS)
  
  // Admin WhatsApp
  const adminWhatsApp = getAdminWhatsApp(booking, property)
  results.adminWhatsApp = await sendWhatsApp(ADMIN_PHONE, adminWhatsApp)
  
  // Calculate total cost
  if (results.clientSMS?.success) results.totalCost += 0.0079
  if (results.clientWhatsApp?.success) results.totalCost += 0.005
  if (results.adminSMS?.success) results.totalCost += 0.0079
  if (results.adminWhatsApp?.success) results.totalCost += 0.005
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
  console.log(`Guest SMS: ${results.clientSMS?.success ? '✅ Sent' : '❌ Not sent'}`)
  console.log(`Guest WhatsApp: ${results.clientWhatsApp?.success ? '✅ Sent' : '❌ Not sent'}`)
  console.log(`Admin SMS: ${results.adminSMS?.success ? '✅ Sent' : '❌ Not sent'}`)
  console.log(`Admin WhatsApp: ${results.adminWhatsApp?.success ? '✅ Sent' : '❌ Not sent'}`)
  console.log(`\n💰 Total Cost: $${results.totalCost.toFixed(4)}`)
  console.log('='.repeat(60) + '\n')
  
  return results
}

// ============================================
// REAL-TIME MONITORING
// ============================================

async function startMonitor() {
  console.log('\n💬 SMS + WHATSAPP NOTIFICATION SERVICE (TWILIO)')
  console.log('=' .repeat(60))
  console.log(`📧 Email: Brevo (300/day FREE)`)
  console.log(`📱 SMS: Twilio ($0.0079/message)`)
  console.log(`📱 WhatsApp: Twilio ($0.005/message)`)
  console.log(`👤 Admin: ${ADMIN_PHONE}`)
  console.log(`🌐 Supabase: ${supabaseUrl}`)
  console.log(`⚡ Listening for new bookings...`)
  console.log('=' .repeat(60) + '\n')
  
  const subscription = adminClient
    .channel('sms-whatsapp-notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'bookings'
      },
      async (payload) => {
        console.log('\n🎯 NEW BOOKING DETECTED!')
        console.log('─'.repeat(60))
        
        const booking = payload.new
        
        // Get property details
        const { data: property, error } = await adminClient
          .from('properties')
          .select('*')
          .eq('id', booking.item_id)
          .single()
        
        if (error) {
          console.error('❌ Failed to get property:', error.message)
          return
        }
        
        console.log(`📋 Booking ID: ${booking.id}`)
        console.log(`🏠 Property: ${property.name}`)
        console.log(`👤 Guest: ${booking.booking_details?.guest_name}`)
        console.log(`💰 Amount: $${booking.total_price}`)
        
        // Send notifications
        await sendBookingNotifications(booking, property)
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Monitor active! Waiting for bookings...\n')
      }
    })
  
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down...')
    subscription.unsubscribe()
    process.exit(0)
  })
}

// ============================================
// TEST FUNCTION
// ============================================

async function testNotifications() {
  console.log('\n🧪 TESTING SMS + WHATSAPP NOTIFICATIONS\n')
  
  // Get latest booking
  const { data: booking, error: bookingError } = await adminClient
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (bookingError || !booking) {
    console.error('❌ No bookings found')
    return
  }
  
  // Get property
  const { data: property, error: propertyError } = await adminClient
    .from('properties')
    .select('*')
    .eq('id', booking.item_id)
    .single()
  
  if (propertyError || !property) {
    console.error('❌ Property not found')
    return
  }
  
  console.log(`Testing with booking: ${booking.id}`)
  console.log(`Property: ${property.name}\n`)
  
  await sendBookingNotifications(booking, property)
  
  process.exit(0)
}

// ============================================
// MAIN
// ============================================

const args = process.argv.slice(2)
const command = args[0]

if (command === 'test') {
  testNotifications()
} else if (command === 'monitor' || !command) {
  startMonitor()
} else {
  console.log('\n💬 SMS + WHATSAPP NOTIFICATION SERVICE')
  console.log('═══════════════════════════════════════\n')
  console.log('Usage:')
  console.log('  node sms-whatsapp-service.mjs          - Start monitor')
  console.log('  node sms-whatsapp-service.mjs monitor  - Start monitor')
  console.log('  node sms-whatsapp-service.mjs test     - Test with latest booking')
  console.log('\n💰 Cost per booking (4 messages):')
  console.log('  2 SMS (guest + admin): $0.0158')
  console.log('  2 WhatsApp (guest + admin): $0.010')
  console.log('  Total per booking: $0.0258')
  console.log('\n📊 Monthly estimates:')
  console.log('  10 bookings: $0.26')
  console.log('  50 bookings: $1.29')
  console.log('  100 bookings: $2.58')
  console.log('  500 bookings: $12.90')
  console.log('\n')
  process.exit(0)
}
