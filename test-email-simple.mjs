#!/usr/bin/env node

import nodemailer from 'nodemailer'

const EMAIL_CONFIG = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '88e59b001@smtp-brevo.com',
    pass: 'xsmtpsib-3d6d7acaedc3c50f96edd4c34baadee7a7137bca4fc9a2455976f73717c5ac7a-4QL7muXw3hnjWVFF'
  }
}

console.log('\n📧 TESTING EMAIL NOTIFICATIONS\n')
console.log('═'.repeat(60))

const transporter = nodemailer.createTransport(EMAIL_CONFIG)

// Test 1: Send to admin
console.log('\n1️⃣ Sending test email to admin@merry360x.com...')
try {
  const adminInfo = await transporter.sendMail({
    from: '"Merry360x Test" <bebisdavy@gmail.com>',
    to: 'admin@merry360x.com',
    subject: '🎉 Test: New Booking Notification',
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>🎉 New Booking Test</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>This is a test email from Merry360x booking notification system.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Test Booking Details</h2>
            <p><strong>Property:</strong> Sunset Beach Villa</p>
            <p><strong>Guest:</strong> Davy Bebis</p>
            <p><strong>Email:</strong> bebisdavy@gmail.com</p>
            <p><strong>Check-in:</strong> Dec 25, 2025</p>
            <p><strong>Check-out:</strong> Dec 28, 2025</p>
            <p><strong>Total:</strong> $2,400 USD</p>
          </div>
          <p>If you received this email, your Brevo SMTP configuration is working perfectly! ✅</p>
        </div>
      </div>
    `
  })
  
  console.log(`✅ Admin email sent successfully!`)
  console.log(`   Message ID: ${adminInfo.messageId}`)
} catch (error) {
  console.error(`❌ Failed to send admin email: ${error.message}`)
}

// Test 2: Send to guest
console.log('\n2️⃣ Sending test confirmation to bebisdavy@gmail.com...')
try {
  const guestInfo = await transporter.sendMail({
    from: '"Merry360x" <bebisdavy@gmail.com>',
    to: 'bebisdavy@gmail.com',
    subject: '✅ Booking Confirmed - Sunset Beach Villa',
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>✅ Booking Confirmed!</h1>
          <p>Thank you for choosing Merry360x</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Dear Davy Bebis,</p>
          <p>Your reservation has been successfully confirmed! We're excited to host you.</p>
          
          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 10px 0;">📋 Your Reservation</h3>
            <strong>Booking ID:</strong> TEST-123456
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Booking Details</h2>
            <p><strong>Property:</strong> Sunset Beach Villa</p>
            <p><strong>Location:</strong> Malibu, California</p>
            <p><strong>Check-in:</strong> December 25, 2025</p>
            <p><strong>Check-out:</strong> December 28, 2025</p>
            <p><strong>Guests:</strong> 2 people</p>
            <p><strong style="font-size: 18px; color: #10b981;">Total Amount: $2,400 USD</strong></p>
          </div>
          
          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 10px 0;">📍 What's Next?</h3>
            <ul>
              <li>You'll receive check-in instructions 24 hours before arrival</li>
              <li>Our team will contact you shortly to confirm details</li>
              <li>Save this confirmation email for your records</li>
            </ul>
          </div>
          
          <p><strong>Questions?</strong> Reply to this email or contact us at admin@merry360x.com</p>
        </div>
      </div>
    `
  })
  
  console.log(`✅ Guest confirmation sent successfully!`)
  console.log(`   Message ID: ${guestInfo.messageId}`)
} catch (error) {
  console.error(`❌ Failed to send guest email: ${error.message}`)
}

// Test 3: Send to host/vendor
console.log('\n3️⃣ Sending host notification to bebisdavy@gmail.com...')
try {
  const hostInfo = await transporter.sendMail({
    from: '"Merry360x" <bebisdavy@gmail.com>',
    to: 'bebisdavy@gmail.com',
    subject: '🎉 New Booking for Sunset Beach Villa',
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>🎉 New Booking for Your Property!</h1>
          <p>You have a new reservation</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Great news! Your property <strong>Sunset Beach Villa</strong> has been booked.</p>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin: 0 0 10px 0;">💰 Booking Summary</h3>
            <p style="margin: 5px 0;"><strong>Booking ID:</strong> TEST-123456</p>
            <p style="margin: 5px 0; font-size: 20px; color: #f59e0b;"><strong>Total: $2,400 USD</strong></p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Guest Information</h2>
            <p><strong>Name:</strong> Davy Bebis</p>
            <p><strong>Email:</strong> bebisdavy@gmail.com</p>
            <p><strong>Phone:</strong> +250792527083</p>
            <p><strong>Check-in:</strong> December 25, 2025</p>
            <p><strong>Check-out:</strong> December 28, 2025</p>
            <p><strong>Guests:</strong> 2 people</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin: 0 0 10px 0;">✅ Next Steps</h3>
            <ul>
              <li>Prepare your property for the guest arrival</li>
              <li>Send check-in instructions 24 hours before arrival</li>
              <li>Ensure the property is clean and ready</li>
              <li>Contact the guest if you need additional information</li>
            </ul>
          </div>
          
          <p><strong>Questions?</strong> Contact support at admin@merry360x.com</p>
        </div>
      </div>
    `
  })
  
  console.log(`✅ Host notification sent successfully!`)
  console.log(`   Message ID: ${hostInfo.messageId}`)
} catch (error) {
  console.error(`❌ Failed to send host email: ${error.message}`)
}

console.log('\n' + '═'.repeat(60))
console.log('✅ EMAIL TEST COMPLETE!')
console.log('\n📬 Check these inboxes:')
console.log('   • admin@merry360x.com (admin notification)')
console.log('   • bebisdavy@gmail.com (guest confirmation)')
console.log('   • bebisdavy@gmail.com (host notification)')
console.log('\n💡 Total: 3 emails sent per booking')
console.log('═'.repeat(60) + '\n')
