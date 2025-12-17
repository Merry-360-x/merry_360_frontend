#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

const adminClient = createClient(supabaseUrl, serviceRoleKey)

// ============================================
// WHATSAPP CONFIGURATION
// ============================================
// Choose your WhatsApp service provider:

// OPTION 1: TWILIO WhatsApp API (Recommended - Easiest)
const WHATSAPP_CONFIG = {
  provider: 'twilio', // 'twilio', 'meta', 'ultramsg', or 'waapi'
  
  // Twilio Configuration
  twilio: {
    accountSid: 'your-twilio-account-sid',
    authToken: 'your-twilio-auth-token',
    fromNumber: 'whatsapp:+14155238886', // Twilio Sandbox or your WhatsApp Business number
    apiUrl: 'https://api.twilio.com/2010-04-01/Accounts'
  },
  
  // Meta (Facebook) WhatsApp Business API
  meta: {
    phoneNumberId: 'your-phone-number-id',
    accessToken: 'your-whatsapp-business-access-token',
    apiUrl: 'https://graph.facebook.com/v18.0'
  },
  
  // UltraMsg (Simple WhatsApp API)
  ultramsg: {
    instanceId: 'your-instance-id',
    token: 'your-ultramsg-token',
    apiUrl: 'https://api.ultramsg.com'
  },
  
  // WAAPI.APP (Alternative)
  waapi: {
    instanceId: 'your-instance-id',
    token: 'your-waapi-token',
    apiUrl: 'https://waapi.app/api/v1'
  }
}

// Admin/Vendor WhatsApp number (receives booking notifications)
const ADMIN_WHATSAPP = '+1234567890' // Replace with your WhatsApp number

// ============================================
// WHATSAPP MESSAGE TEMPLATES
// ============================================

function getClientConfirmationMessage(booking, property) {
  const checkIn = new Date(booking.start_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  
  const checkOut = new Date(booking.end_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  
  return `
🎉 *Booking Confirmed!*

Thank you for booking with Merry360! ✨

*📋 Booking Details:*
━━━━━━━━━━━━━━━━━━━━━━
🏠 *Property:* ${property.name}
📍 *Location:* ${property.location}

📅 *Check-in:* ${checkIn}
📅 *Check-out:* ${checkOut}
👥 *Guests:* ${booking.guests}

💰 *Total Amount:* $${booking.total_price.toLocaleString()} ${booking.currency}
📋 *Booking ID:* ${booking.id}
✅ *Status:* ${booking.status.toUpperCase()}

${booking.booking_details?.special_requests ? `\n📝 *Special Requests:*\n${booking.booking_details.special_requests}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━

📞 *Need Help?*
Contact us anytime:
📧 support@merry360x.com
🌐 www.merry360x.com

_We'll send you more details soon!_

Thank you for choosing Merry360! 🙏
`.trim()
}

function getVendorNotificationMessage(booking, property) {
  const checkIn = new Date(booking.start_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  
  const checkOut = new Date(booking.end_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  
  return `
🔔 *NEW BOOKING ALERT!*

*${property.name}*

━━━━━━━━━━━━━━━━━━━━━━
👤 *Guest:* ${booking.booking_details?.guest_name || 'Unknown'}
📧 ${booking.booking_details?.guest_email || 'N/A'}
📱 ${booking.booking_details?.guest_phone || 'N/A'}

📅 *Dates:* ${checkIn} - ${checkOut}
👥 *Guests:* ${booking.guests}
💰 *Amount:* $${booking.total_price.toLocaleString()}

🆔 *Booking ID:* ${booking.id}
━━━━━━━━━━━━━━━━━━━━━━

${booking.booking_details?.special_requests ? `📝 *Special Requests:*\n${booking.booking_details.special_requests}\n\n` : ''}⚡ *ACTION REQUIRED:*
Please confirm this booking ASAP

🌐 View: www.merry360x.com/admin/bookings
`.trim()
}

// ============================================
// WHATSAPP SENDING FUNCTIONS
// ============================================

async function sendWhatsAppViaTwilio(to, message) {
  const { accountSid, authToken, fromNumber, apiUrl } = WHATSAPP_CONFIG.twilio
  
  const url = `${apiUrl}/${accountSid}/Messages.json`
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: `whatsapp:${to}`,
        Body: message
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Twilio API error')
    }
    
    return { success: true, messageId: data.sid }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function sendWhatsAppViaMeta(to, message) {
  const { phoneNumberId, accessToken, apiUrl } = WHATSAPP_CONFIG.meta
  
  const url = `${apiUrl}/${phoneNumberId}/messages`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/[^0-9]/g, ''),
        type: 'text',
        text: { body: message }
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Meta API error')
    }
    
    return { success: true, messageId: data.messages?.[0]?.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function sendWhatsAppViaUltraMsg(to, message) {
  const { instanceId, token, apiUrl } = WHATSAPP_CONFIG.ultramsg
  
  const url = `${apiUrl}/${instanceId}/messages/chat`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        token: token,
        to: to.replace(/[^0-9]/g, ''),
        body: message
      })
    })
    
    const data = await response.json()
    
    if (!response.ok || !data.sent) {
      throw new Error(data.error || 'UltraMsg API error')
    }
    
    return { success: true, messageId: data.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function sendWhatsAppViaWAAPI(to, message) {
  const { instanceId, token, apiUrl } = WHATSAPP_CONFIG.waapi
  
  const url = `${apiUrl}/sendMessage`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: to.replace(/[^0-9]/g, ''),
        message: message,
        instanceId: instanceId
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'WAAPI error')
    }
    
    return { success: true, messageId: data.messageId }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function sendWhatsApp(to, message) {
  const provider = WHATSAPP_CONFIG.provider
  
  console.log(`\n📱 Sending WhatsApp via ${provider.toUpperCase()}...`)
  console.log(`   To: ${to}`)
  
  // Check if configured
  if (provider === 'twilio' && WHATSAPP_CONFIG.twilio.accountSid === 'your-twilio-account-sid') {
    console.log('⚠️  WhatsApp not configured. Message preview:')
    console.log('─'.repeat(60))
    console.log(message)
    console.log('─'.repeat(60))
    return { success: false, error: 'Not configured' }
  }
  
  let result
  switch (provider) {
    case 'twilio':
      result = await sendWhatsAppViaTwilio(to, message)
      break
    case 'meta':
      result = await sendWhatsAppViaMeta(to, message)
      break
    case 'ultramsg':
      result = await sendWhatsAppViaUltraMsg(to, message)
      break
    case 'waapi':
      result = await sendWhatsAppViaWAAPI(to, message)
      break
    default:
      result = { success: false, error: 'Unknown provider' }
  }
  
  if (result.success) {
    console.log(`✅ WhatsApp sent! Message ID: ${result.messageId}`)
  } else {
    console.log(`❌ Failed to send WhatsApp: ${result.error}`)
  }
  
  return result
}

// ============================================
// BOOKING NOTIFICATION WITH WHATSAPP
// ============================================

async function sendBookingWhatsAppNotifications(booking, property) {
  const results = {
    client: null,
    vendor: null
  }
  
  // Send to client (guest)
  const guestPhone = booking.booking_details?.guest_phone
  if (guestPhone) {
    console.log('\n📱 Sending confirmation to GUEST...')
    const clientMessage = getClientConfirmationMessage(booking, property)
    results.client = await sendWhatsApp(guestPhone, clientMessage)
  } else {
    console.log('⚠️  Guest phone number not provided')
  }
  
  // Send to vendor/admin
  console.log('\n📱 Sending notification to ADMIN/VENDOR...')
  const vendorMessage = getVendorNotificationMessage(booking, property)
  results.vendor = await sendWhatsApp(ADMIN_WHATSAPP, vendorMessage)
  
  return results
}

// ============================================
// REAL-TIME BOOKING MONITOR WITH WHATSAPP
// ============================================

async function startWhatsAppMonitor() {
  console.log('\n📱 WHATSAPP BOOKING NOTIFICATION SERVICE')
  console.log('=' .repeat(60))
  console.log(`📧 Email: ${WHATSAPP_CONFIG.provider.toUpperCase()}`)
  console.log(`📱 Admin WhatsApp: ${ADMIN_WHATSAPP}`)
  console.log(`🌐 Supabase: ${supabaseUrl}`)
  console.log(`⚡ Listening for new bookings...`)
  console.log('=' .repeat(60) + '\n')
  
  // Subscribe to new bookings
  const subscription = adminClient
    .channel('whatsapp-booking-notifications')
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
        console.log('─'.repeat(60))
        
        // Send WhatsApp notifications
        const results = await sendBookingWhatsAppNotifications(booking, property)
        
        // Log results
        if (results.client?.success) {
          console.log('\n✅ Guest WhatsApp confirmation sent!')
        } else if (results.client === null) {
          console.log('\n⚠️  Guest WhatsApp not sent (no phone number)')
        } else {
          console.log('\n❌ Guest WhatsApp failed')
        }
        
        if (results.vendor?.success) {
          console.log('✅ Admin/Vendor WhatsApp notification sent!')
        } else {
          console.log('❌ Admin/Vendor WhatsApp failed')
        }
        
        console.log('\n' + '─'.repeat(60))
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ WhatsApp monitor active!')
        console.log('   Waiting for bookings...\n')
      } else if (status === 'CLOSED') {
        console.log('⚠️  Connection closed')
      } else if (status === 'CHANNEL_ERROR') {
        console.log('❌ Subscription error')
      }
    })
  
  // Keep running
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down WhatsApp notification service...')
    subscription.unsubscribe()
    process.exit(0)
  })
}

// ============================================
// TEST FUNCTION
// ============================================

async function testWhatsApp() {
  console.log('\n🧪 TESTING WHATSAPP NOTIFICATIONS\n')
  
  // Get latest booking
  const { data: booking, error: bookingError } = await adminClient
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (bookingError || !booking) {
    console.error('❌ No bookings found to test')
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
  
  await sendBookingWhatsAppNotifications(booking, property)
  
  process.exit(0)
}

// ============================================
// MAIN
// ============================================

const args = process.argv.slice(2)
const command = args[0]

if (command === 'test') {
  testWhatsApp()
} else if (command === 'monitor' || !command) {
  startWhatsAppMonitor()
} else {
  console.log('\n📱 WHATSAPP BOOKING NOTIFICATION SERVICE')
  console.log('═══════════════════════════════════════\n')
  console.log('Usage:')
  console.log('  node whatsapp-notification-service.mjs          - Start real-time monitor')
  console.log('  node whatsapp-notification-service.mjs monitor  - Start real-time monitor')
  console.log('  node whatsapp-notification-service.mjs test     - Test with latest booking')
  console.log('\n')
  process.exit(0)
}
