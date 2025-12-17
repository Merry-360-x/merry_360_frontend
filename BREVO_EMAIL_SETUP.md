# 🚀 BREVO EMAIL SETUP GUIDE

## Why Brevo?
✅ **300 FREE emails per day** (forever)  
✅ Professional transactional emails  
✅ Easy SMTP setup  
✅ No credit card required for free tier  
✅ Excellent deliverability  
✅ Real-time email tracking  

---

## 📋 Quick Setup (5 minutes)

### Step 1: Create Brevo Account
1. Go to: **https://www.brevo.com/free-trial/**
2. Click **"Sign up free"**
3. Enter your email and create password
4. Verify your email address
5. Complete the quick setup wizard

### Step 2: Get Your SMTP Credentials
1. Login to Brevo dashboard
2. Go to: **Settings** → **SMTP & API**
3. Or direct link: **https://app.brevo.com/settings/keys/smtp**
4. Click **"Generate a new SMTP key"**
5. Give it a name: `Merry360 Notifications`
6. Copy the SMTP key (you'll need this!)

### Step 3: Configure Email Service

Open `email-notification-service.mjs` and update:

```javascript
const EMAIL_CONFIG = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@example.com',     // Your Brevo account email
    pass: 'xsmtpsib-abc123...'          // Your SMTP key from Step 2
  }
}
```

**Replace:**
- `your-email@example.com` → Your Brevo login email
- `xsmtpsib-abc123...` → The SMTP key you copied

### Step 4: Update Admin Email (Optional)

If you want notifications sent to a different email:

```javascript
const ADMIN_EMAIL = 'admin@merry360x.com'  // Change to your email
```

### Step 5: Start the Email Service

```bash
node email-notification-service.mjs monitor
```

You should see:
```
🔔 BOOKING NOTIFICATION SERVICE
=====================================
📧 Admin Email: admin@merry360x.com
🌐 Supabase: https://aqrzvlwgkjwaqthsjxpt.supabase.co
⚡ Listening for new bookings...
=====================================

✅ Real-time subscription active!
   Waiting for bookings...
```

### Step 6: Test It!

**Option 1: Run Test Script**
```bash
node test-booking-notification.mjs
```

**Option 2: Make Real Booking**
1. Visit: www.merry360x.com
2. Browse properties
3. Create a booking
4. Check your email! 📧

---

## 📧 What the Email Looks Like

**Subject:** 🎉 New Booking: Sunset Beach Villa - John Doe

**Email Preview:**
```
╔══════════════════════════════════════════╗
║     🎉 New Booking Received!             ║
║     You have a new booking on Merry360x  ║
╚══════════════════════════════════════════╝

Booking Details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Booking ID: 95ae4d65-d222-4826-81b7-326c941a8e31
Property: Sunset Beach Villa
Location: Malibu, California

Guest Name: John Doe
Guest Email: john@example.com
Guest Phone: +1234567890

Check-in: December 25, 2025
Check-out: December 28, 2025
Number of Guests: 2

Total Amount: $2,400 USD
Status: PENDING

Special Requests: Early check-in if possible

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[View in Admin Dashboard Button]

⚡ Action Required: Please review and confirm this
booking as soon as possible.
```

---

## 🎯 Brevo Free Tier Limits

✅ **300 emails per day** (enough for most small businesses)  
✅ **Unlimited contacts**  
✅ **Full SMTP access**  
✅ **Email tracking**  
✅ **Templates & automation**  

**Daily limits reset at midnight UTC**

If you get 300+ bookings per day, you'll need to upgrade! 🎉 (That's a good problem!)

---

## 🔧 Troubleshooting

### Error: "Invalid login credentials"
- ✅ Make sure you're using the **SMTP key**, not your Brevo password
- ✅ Check for typos in email/key
- ✅ Regenerate SMTP key if needed

### Error: "Could not establish connection"
- ✅ Check internet connection
- ✅ Verify port 587 is not blocked by firewall
- ✅ Try using port 465 with `secure: true`

### No email received?
- ✅ Check spam/junk folder
- ✅ Verify sender email in Brevo dashboard
- ✅ Check Brevo logs: https://app.brevo.com/logs
- ✅ Verify "From" email is validated in Brevo

### Daily limit reached?
- ✅ Check usage: https://app.brevo.com/account/plan
- ✅ Consider upgrading plan
- ✅ Limit resets at midnight UTC

---

## 🚀 Production Tips

### 1. Verify Sender Domain (Optional but Recommended)
1. Go to: https://app.brevo.com/senders/domain
2. Add your domain: merry360x.com
3. Add DNS records (SPF, DKIM)
4. Emails will look more professional!

### 2. Add Email Template
1. Go to: https://app.brevo.com/campaign/template
2. Create beautiful HTML templates
3. Use in your emails

### 3. Monitor Email Performance
- Track opens, clicks, bounces
- View real-time statistics
- Export reports

### 4. Keep Service Running
Use PM2 to keep service running 24/7:
```bash
npm install -g pm2
pm2 start email-notification-service.mjs --name booking-notifications
pm2 save
pm2 startup
```

---

## 📊 Brevo Dashboard Overview

**Main Dashboard:** https://app.brevo.com/
- Email statistics
- Campaign management
- Contact lists

**SMTP Settings:** https://app.brevo.com/settings/keys/smtp
- SMTP credentials
- API keys
- Webhooks

**Email Logs:** https://app.brevo.com/logs
- See all sent emails
- Delivery status
- Error messages

**Account Plan:** https://app.brevo.com/account/plan
- Current usage
- Upgrade options
- Billing

---

## ✨ Example Configuration

Here's a complete working example:

```javascript
const EMAIL_CONFIG = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'admin@merry360x.com',
    pass: 'xsmtpsib-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z'
  }
}

const ADMIN_EMAIL = 'admin@merry360x.com'
```

**That's it!** Brevo will handle:
- ✅ Email delivery
- ✅ Spam prevention
- ✅ Bounce handling
- ✅ Unsubscribe management
- ✅ Tracking & analytics

---

## 🎉 You're Ready!

1. ✅ Sign up for Brevo (free)
2. ✅ Get SMTP key
3. ✅ Update email-notification-service.mjs
4. ✅ Start the service
5. ✅ Test with a booking
6. ✅ Receive beautiful email notifications!

**Questions?** Check Brevo docs: https://developers.brevo.com/docs

---

*Brevo Free Tier: 300 emails/day, no credit card required*  
*Perfect for getting started with professional email notifications!*
