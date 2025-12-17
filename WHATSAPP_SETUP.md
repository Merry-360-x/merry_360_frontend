# 📱 WhatsApp Booking Notifications Setup

## 🎯 What This Does

When a guest makes a booking:
1. **Guest receives:** ✅ Booking confirmation on WhatsApp
2. **Admin/Vendor receives:** 🔔 New booking alert on WhatsApp

Both notifications sent automatically and instantly!

---

## 🚀 Quick Setup (Choose One Service)

### Option 1: Twilio WhatsApp API (Recommended - Easiest)

**Why Twilio?**
- ✅ Easy sandbox for testing (free)
- ✅ Official WhatsApp Business API partner
- ✅ Reliable delivery
- ✅ Pay-as-you-go pricing ($0.005/message)

**Setup Steps:**

1. **Create Twilio Account**
   - Go to: https://www.twilio.com/try-twilio
   - Sign up (free trial includes $15 credit)
   - Verify your phone number

2. **Get Credentials**
   - Dashboard: https://console.twilio.com/
   - Copy **Account SID**
   - Copy **Auth Token**

3. **Activate WhatsApp Sandbox**
   - Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
   - Send join code to Twilio sandbox number
   - Example: Send "join <your-code>" to +1 415 523 8886

4. **Configure Service**
   ```javascript
   const WHATSAPP_CONFIG = {
     provider: 'twilio',
     twilio: {
       accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
       authToken: 'your_auth_token_here',
       fromNumber: 'whatsapp:+14155238886', // Sandbox number
     }
   }
   
   const ADMIN_WHATSAPP = '+1234567890' // Your WhatsApp number
   ```

5. **Start Service**
   ```bash
   node whatsapp-notification-service.mjs monitor
   ```

**Production (After Testing):**
- Request WhatsApp Business Account
- Get approved sender number
- Update `fromNumber` to your business number

---

### Option 2: Meta WhatsApp Business API (Official)

**Why Meta?**
- ✅ Direct from WhatsApp/Facebook
- ✅ Free for 1,000 conversations/month
- ✅ Official business integration

**Setup Steps:**

1. **Create Meta Business Account**
   - Go to: https://business.facebook.com/
   - Create Business Portfolio
   - Add WhatsApp product

2. **Setup WhatsApp Business**
   - Go to: https://developers.facebook.com/
   - Create App → Business → WhatsApp
   - Add phone number
   - Verify business

3. **Get Credentials**
   - Phone Number ID
   - Access Token (24h or permanent)

4. **Configure Service**
   ```javascript
   const WHATSAPP_CONFIG = {
     provider: 'meta',
     meta: {
       phoneNumberId: '123456789012345',
       accessToken: 'EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
       apiUrl: 'https://graph.facebook.com/v18.0'
     }
   }
   ```

**Note:** Requires business verification (can take days)

---

### Option 3: UltraMsg (Simplest - No Verification)

**Why UltraMsg?**
- ✅ No business verification needed
- ✅ Setup in 5 minutes
- ✅ Works with personal WhatsApp
- ✅ Cheap ($9/month unlimited)

**Setup Steps:**

1. **Create Account**
   - Go to: https://ultramsg.com/
   - Sign up and choose plan
   - Connect your WhatsApp by scanning QR code

2. **Get Credentials**
   - Dashboard → API
   - Copy Instance ID
   - Copy Token

3. **Configure Service**
   ```javascript
   const WHATSAPP_CONFIG = {
     provider: 'ultramsg',
     ultramsg: {
       instanceId: 'instance12345',
       token: 'abcdef123456',
       apiUrl: 'https://api.ultramsg.com'
     }
   }
   ```

**Pros:** Quick setup, no verification  
**Cons:** Uses your personal WhatsApp number

---

### Option 4: WAAPI.APP (Alternative)

Similar to UltraMsg:
- Go to: https://waapi.app/
- Connect WhatsApp via QR code
- Get Instance ID and Token
- Configure as shown in code

---

## 📱 What Guests Receive

```
🎉 *Booking Confirmed!*

Thank you for booking with Merry360! ✨

*📋 Booking Details:*
━━━━━━━━━━━━━━━━━━━━━━
🏠 *Property:* Sunset Beach Villa
📍 *Location:* Malibu, California

📅 *Check-in:* Wednesday, December 25, 2025
📅 *Check-out:* Saturday, December 28, 2025
👥 *Guests:* 2

💰 *Total Amount:* $2,400 USD
📋 *Booking ID:* 95ae4d65...
✅ *Status:* CONFIRMED

━━━━━━━━━━━━━━━━━━━━━━

📞 *Need Help?*
Contact us anytime:
📧 support@merry360x.com
🌐 www.merry360x.com

Thank you for choosing Merry360! 🙏
```

---

## 🏪 What Vendor/Admin Receives

```
🔔 *NEW BOOKING ALERT!*

*Sunset Beach Villa*

━━━━━━━━━━━━━━━━━━━━━━
👤 *Guest:* John Doe
📧 john@example.com
📱 +1234567890

📅 *Dates:* Dec 25 - Dec 28
👥 *Guests:* 2
💰 *Amount:* $2,400

🆔 *Booking ID:* 95ae4d65...
━━━━━━━━━━━━━━━━━━━━━━

⚡ *ACTION REQUIRED:*
Please confirm this booking ASAP

🌐 View: www.merry360x.com/admin/bookings
```

---

## 🧪 Testing

### Test with Latest Booking:
```bash
node whatsapp-notification-service.mjs test
```

### Create Test Booking:
```bash
node test-booking-notification.mjs
```

Then check:
1. Guest's WhatsApp (if phone provided)
2. Admin's WhatsApp

---

## 🚀 Running in Production

### Start Monitor:
```bash
node whatsapp-notification-service.mjs monitor
```

### Keep Running 24/7:
```bash
npm install -g pm2
pm2 start whatsapp-notification-service.mjs --name whatsapp-bookings
pm2 save
pm2 startup
```

### Check Status:
```bash
pm2 status
pm2 logs whatsapp-bookings
```

---

## 🔧 Configuration

Edit `whatsapp-notification-service.mjs`:

```javascript
// Line 16: Choose provider
const WHATSAPP_CONFIG = {
  provider: 'twilio', // Change to: twilio, meta, ultramsg, or waapi
  
  // Configure your chosen provider below...
}

// Line 63: Set admin WhatsApp
const ADMIN_WHATSAPP = '+1234567890' // YOUR number with country code
```

**Important:** 
- Include country code (e.g., +1 for US, +44 for UK)
- No spaces or dashes
- Format: +1234567890

---

## 💰 Pricing Comparison

| Service | Setup | Monthly | Per Message | Best For |
|---------|-------|---------|-------------|----------|
| **Twilio** | Free | Pay-as-go | $0.005 | Production, reliable |
| **Meta** | Free | Free* | Free* | High volume, official |
| **UltraMsg** | Free | $9-$29 | Unlimited | Quick start, testing |
| **WAAPI** | Free | $10-$40 | Unlimited | Simple integration |

*Meta: 1,000 free conversations/month, then $0.008/conversation

---

## 🎯 Recommended Setup Flow

### For Testing (5 minutes):
1. Use **UltraMsg** or **WAAPI**
2. Scan QR code
3. Get credentials
4. Start service
5. Test immediately!

### For Production (1-2 days):
1. Use **Twilio** (easier) or **Meta** (free)
2. Get business verified
3. Request official WhatsApp Business number
4. Update configuration
5. Launch!

---

## 🔥 Combined Email + WhatsApp

Run both services together:

```bash
# Terminal 1: Email notifications
node email-notification-service.mjs monitor

# Terminal 2: WhatsApp notifications
node whatsapp-notification-service.mjs monitor
```

Or use PM2:
```bash
pm2 start email-notification-service.mjs --name email-bookings
pm2 start whatsapp-notification-service.mjs --name whatsapp-bookings
pm2 save
```

Now every booking triggers:
- ✉️ Email to admin@merry360x.com
- 📱 WhatsApp to admin's phone
- 📱 WhatsApp confirmation to guest

**Triple notification = Zero missed bookings!** 🎯

---

## 🛠️ Troubleshooting

### "WhatsApp not configured" message
- Update credentials in WHATSAPP_CONFIG
- Make sure not using placeholder values

### Guest not receiving confirmation
- Check guest provided phone number in booking
- Verify phone format: +1234567890
- Check service provider dashboard for errors

### Admin not receiving notifications
- Verify ADMIN_WHATSAPP is correct
- Check you joined sandbox (Twilio)
- Verify instance is connected (UltraMsg/WAAPI)

### Messages not sending
- Check API credentials
- Verify account balance (Twilio)
- Check rate limits
- View service logs: `pm2 logs whatsapp-bookings`

---

## 📊 Message Delivery Status

All services provide delivery tracking:

**Twilio:** https://console.twilio.com/us1/monitor/logs/messages  
**Meta:** Facebook Business Manager → WhatsApp → Insights  
**UltraMsg:** Dashboard → Messages  
**WAAPI:** Dashboard → Logs

---

## ✅ Success Checklist

- [ ] Service provider account created
- [ ] WhatsApp connected/verified
- [ ] API credentials configured
- [ ] Admin WhatsApp number set
- [ ] Service started and running
- [ ] Test booking created
- [ ] Guest received confirmation
- [ ] Admin received notification
- [ ] PM2 configured for 24/7 running

---

## 🎉 You're Done!

Your guests now receive instant WhatsApp confirmations, and you get notified immediately about every booking!

**Questions?**
- Twilio Docs: https://www.twilio.com/docs/whatsapp
- Meta Docs: https://developers.facebook.com/docs/whatsapp
- UltraMsg Docs: https://docs.ultramsg.com/

---

*Last Updated: December 18, 2025*  
*WhatsApp Business API Integration for Merry360*
