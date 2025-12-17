#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabaseUrl = 'https://aqrzvlwgkjwaqthsjxpt.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0'

const adminClient = createClient(supabaseUrl, serviceRoleKey)

// ============================================
// EMAIL CONFIGURATION
// ============================================
// BREVO (Sendinblue) - RECOMMENDED FOR PRODUCTION
// Get your SMTP credentials from: https://app.brevo.com/settings/keys/smtp
const EMAIL_CONFIG = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'admin@merry360x.com',  // Your Brevo account email
    pass: 'xsmtpsib-3d6d7acaedc3c50f96edd4c34baadee7a7137bca4fc9a2455976f73717c5ac7a-4QL7muXw3hnjWVFF'  // Your Brevo SMTP key
  }
}

// ALTERNATIVE CONFIGURATIONS:
// 
// Gmail (requires App Password):
// const EMAIL_CONFIG = {
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'your-email@gmail.com',
//     pass: 'your-16-char-app-password'
//   }
// }
//
// SendGrid:
// const EMAIL_CONFIG = {
//   host: 'smtp.sendgrid.net',
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'apikey',
//     pass: 'your-sendgrid-api-key'
//   }
// }

// Admin email to receive notifications
const ADMIN_EMAIL = 'admin@merry360x.com'

// Create email transporter
let transporter = null
try {
  transporter = nodemailer.createTransport(EMAIL_CONFIG)
} catch (err) {
  console.log('⚠️  Email not configured. Notifications will be logged only.')
  console.log('   To enable emails, update EMAIL_CONFIG in this file.')
}

// ============================================
// EMAIL TEMPLATES
// ============================================

function getNewBookingEmailHTML(booking, property) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
    .detail-label { font-weight: bold; color: #667eea; }
    .detail-value { color: #555; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Booking Received!</h1>
      <p>You have a new booking on Merry360x</p>
    </div>
    
    <div class="content">
      <h2>Booking Details</h2>
      
      <div class="booking-details">
        <div class="detail-row">
          <span class="detail-label">Booking ID:</span>
          <span class="detail-value">${booking.id}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Property:</span>
          <span class="detail-value">${property.name}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${property.location}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Guest Name:</span>
          <span class="detail-value">${booking.booking_details.guest_name}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Guest Email:</span>
          <span class="detail-value">${booking.booking_details.guest_email}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Guest Phone:</span>
          <span class="detail-value">${booking.booking_details.guest_phone || 'Not provided'}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Check-in:</span>
          <span class="detail-value">${booking.start_date}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Check-out:</span>
          <span class="detail-value">${booking.end_date}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Number of Guests:</span>
          <span class="detail-value">${booking.guests}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Total Amount:</span>
          <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #667eea;">
            $${booking.total_price.toLocaleString()} ${booking.currency}
          </span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="detail-value">${booking.status.toUpperCase()}</span>
        </div>
        
        ${booking.booking_details.special_requests ? `
        <div class="detail-row">
          <span class="detail-label">Special Requests:</span>
          <span class="detail-value">${booking.booking_details.special_requests}</span>
        </div>
        ` : ''}
      </div>
      
      <center>
        <a href="https://www.merry360x.com/admin/bookings" class="button">
          View in Admin Dashboard
        </a>
      </center>
      
      <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <strong>⚡ Action Required:</strong> Please review and confirm this booking as soon as possible.
      </p>
    </div>
    
    <div class="footer">
      <p>This is an automated notification from Merry360x</p>
      <p>© 2025 Merry360x. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}

function getGuestConfirmationEmailHTML(booking, property) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
    .detail-label { font-weight: bold; color: #10b981; }
    .detail-value { color: #555; }
    .highlight { background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
    .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Booking Confirmed!</h1>
      <p>Thank you for choosing Merry360x</p>
    </div>
    
    <div class="content">
      <p>Dear ${booking.booking_details.guest_name},</p>
      
      <p>Your reservation has been successfully confirmed! We're excited to host you at <strong>${property.name}</strong>.</p>
      
      <div class="highlight">
        <h3 style="margin: 0 0 10px 0;">📋 Your Reservation</h3>
        <strong>Booking ID:</strong> ${booking.id}
      </div>
      
      <div class="booking-details">
        <h2>Booking Details</h2>
        
        <div class="detail-row">
          <span class="detail-label">Property:</span>
          <span class="detail-value">${property.name}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${property.location}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Check-in Date:</span>
          <span class="detail-value">${booking.start_date}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Check-out Date:</span>
          <span class="detail-value">${booking.end_date}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Number of Guests:</span>
          <span class="detail-value">${booking.guests}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Total Amount:</span>
          <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #10b981;">
            $${booking.total_price.toLocaleString()} ${booking.currency}
          </span>
        </div>
      </div>
      
      <div class="highlight">
        <h3 style="margin: 0 0 10px 0;">📍 What's Next?</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>You'll receive check-in instructions 24 hours before arrival</li>
          <li>Our team will contact you shortly to confirm details</li>
          <li>Save this confirmation email for your records</li>
        </ul>
      </div>
      
      <center>
        <a href="https://www.merry360x.com" class="button">
          Visit Website
        </a>
      </center>
      
      <p style="margin-top: 30px;">
        <strong>Questions?</strong> Feel free to reply to this email or contact us at admin@merry360x.com
      </p>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing Merry360x!</p>
      <p>© 2025 Merry360x. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

async function sendBookingNotification(booking, property) {
  const guestEmail = booking.booking_details?.guest_email
  
  // Send admin notification
  const adminSubject = `🎉 New Booking: ${property.name} - ${booking.booking_details.guest_name}`
  const adminHtml = getNewBookingEmailHTML(booking, property)
  
  const plainText = `
NEW BOOKING RECEIVED
====================

Booking ID: ${booking.id}
Property: ${property.name}
Location: ${property.location}

Guest Information:
- Name: ${booking.booking_details.guest_name}
- Email: ${booking.booking_details.guest_email}
- Phone: ${booking.booking_details.guest_phone || 'Not provided'}

Booking Details:
- Check-in: ${booking.start_date}
- Check-out: ${booking.end_date}
- Guests: ${booking.guests}
- Total: $${booking.total_price} ${booking.currency}
- Status: ${booking.status.toUpperCase()}

${booking.booking_details.special_requests ? `Special Requests: ${booking.booking_details.special_requests}` : ''}

View in dashboard: https://www.merry360x.com/admin/bookings
  `
  
  if (!transporter) {
    console.log('\n📧 EMAIL NOTIFICATION (Email not configured - displaying only):')
    console.log('─'.repeat(60))
    console.log(`To: ${ADMIN_EMAIL}`)
    console.log(`Subject: ${adminSubject}`)
    console.log('─'.repeat(60))
    console.log(plainText)
    console.log('─'.repeat(60))
    return { success: false, message: 'Email not configured' }
  }
  
  try {
    // Send to admin
    const adminInfo = await transporter.sendMail({
      from: `"Merry360x Notifications" <${EMAIL_CONFIG.auth.user}>`,
      to: ADMIN_EMAIL,
      subject: adminSubject,
      text: plainText,
      html: adminHtml
    })
    
    console.log(`✅ Admin email sent: ${adminInfo.messageId}`)
    
    // Send guest confirmation
    if (guestEmail) {
      const guestSubject = `✅ Booking Confirmed - ${property.name}`
      const guestHtml = getGuestConfirmationEmailHTML(booking, property)
      
      const guestInfo = await transporter.sendMail({
        from: `"Merry360x" <${EMAIL_CONFIG.auth.user}>`,
        to: guestEmail,
        subject: guestSubject,
        html: guestHtml
      })
      
      console.log(`✅ Guest confirmation sent to ${guestEmail}: ${guestInfo.messageId}`)
    }
    
    return { success: true, messageId: adminInfo.messageId }
  } catch (error) {
    console.error('❌ Email send failed:', error.message)
    return { success: false, message: error.message }
  }
}

// ============================================
// REAL-TIME BOOKING MONITOR
// ============================================

async function startBookingMonitor() {
  console.log('\n🔔 BOOKING NOTIFICATION SERVICE')
  console.log('=====================================')
  console.log(`📧 Admin Email: ${ADMIN_EMAIL}`)
  console.log(`🌐 Supabase: ${supabaseUrl}`)
  console.log(`⚡ Listening for new bookings...`)
  console.log('=====================================\n')
  
  // Subscribe to new bookings in real-time
  const subscription = adminClient
    .channel('booking-notifications')
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
        console.log(`Booking ID: ${booking.id}`)
        console.log(`Guest: ${booking.booking_details?.guest_name}`)
        console.log(`Total: $${booking.total_price} ${booking.currency}`)
        
        // Get property details
        const { data: property, error } = await adminClient
          .from('properties')
          .select('*')
          .eq('id', booking.item_id)
          .single()
        
        if (error) {
          console.error('❌ Failed to get property details:', error.message)
          return
        }
        
        console.log(`Property: ${property.name}`)
        console.log('─'.repeat(60))
        
        // Send email notification
        const result = await sendBookingNotification(booking, property)
        
        if (result.success) {
          console.log('✅ Admin notification sent successfully!')
        } else {
          console.log('⚠️  Notification logged (email not configured)')
        }
        
        console.log('─'.repeat(60))
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Real-time subscription active!')
        console.log('   Waiting for bookings...\n')
      } else if (status === 'CLOSED') {
        console.log('⚠️  Connection closed')
      } else if (status === 'CHANNEL_ERROR') {
        console.log('❌ Subscription error')
      }
    })
  
  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down notification service...')
    subscription.unsubscribe()
    process.exit(0)
  })
}

// ============================================
// CHECK PENDING NOTIFICATIONS
// ============================================

async function checkPendingNotifications() {
  console.log('\n📬 Checking for pending notifications...\n')
  
  const { data: notifications, error } = await adminClient
    .rpc('get_pending_notifications')
  
  if (error) {
    console.error('❌ Failed to get notifications:', error.message)
    return
  }
  
  if (!notifications || notifications.length === 0) {
    console.log('✅ No pending notifications')
    return
  }
  
  console.log(`Found ${notifications.length} pending notification(s)\n`)
  
  for (const notification of notifications) {
    console.log('─'.repeat(60))
    console.log(`Booking ID: ${notification.booking_id}`)
    console.log(`Property: ${notification.property_name}`)
    console.log(`Guest: ${notification.guest_name}`)
    console.log(`Total: $${notification.total_price}`)
    console.log('─'.repeat(60))
    
    // You can process these notifications here
  }
}

// ============================================
// MAIN
// ============================================

const args = process.argv.slice(2)
const command = args[0]

if (command === 'check') {
  checkPendingNotifications().then(() => process.exit(0))
} else if (command === 'monitor' || !command) {
  startBookingMonitor()
} else {
  console.log('\n📧 BOOKING NOTIFICATION SERVICE')
  console.log('═══════════════════════════════\n')
  console.log('Usage:')
  console.log('  node email-notification-service.mjs          - Start real-time monitor')
  console.log('  node email-notification-service.mjs monitor  - Start real-time monitor')
  console.log('  node email-notification-service.mjs check    - Check pending notifications')
  console.log('\n')
  process.exit(0)
}
