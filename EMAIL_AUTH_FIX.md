# ⚠️ EMAIL AUTHENTICATION FAILED

The Brevo SMTP authentication is failing with error: **535 5.7.8 Authentication failed**

This means one of the following:
1. The SMTP key is incorrect
2. The Brevo account needs verification
3. The sender email doesn't match the account

## 🔍 VERIFY YOUR BREVO CREDENTIALS

### Step 1: Login to Brevo
Go to: https://app.brevo.com/account/login

### Step 2: Get Your SMTP Credentials
1. Click on your name (top right)
2. Go to **SMTP & API**
3. Under **SMTP**, you'll see:
   - **Login:** This should be `admin@merry360x.com`
   - **SMTP Key:** Click "Generate New Key" if needed

### Step 3: Verify Your Domain (Important!)
Brevo requires domain verification for custom domains:
1. Go to **Senders & IP**
2. Add and verify `merry360x.com`
3. Follow the DNS verification steps

**OR** Use a verified email address instead:
- If you have `bebisdavy@gmail.com` verified in Brevo, use that as the sender

## 🔧 UPDATE THE CONFIGURATION

Once you have the correct credentials, update **email-notification-service.mjs**:

```javascript
const EMAIL_CONFIG = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'YOUR_VERIFIED_EMAIL',  // Could be admin@merry360x.com or bebisdavy@gmail.com
    pass: 'YOUR_CORRECT_SMTP_KEY'
  }
}
```

## ✅ QUICK FIX: Use Your Gmail

If domain verification is taking too long, you can use your Gmail with Brevo:

1. Go to Brevo → **Senders & IP** → **Add Sender**
2. Add `bebisdavy@gmail.com`
3. Verify it through the email you receive
4. Update the config:

```javascript
const EMAIL_CONFIG = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'bebisdavy@gmail.com',  // Your verified email
    pass: 'YOUR_BREVO_SMTP_KEY'
  }
}
```

## 🧪 TEST AFTER FIXING

Run:
```bash
node test-email-simple.mjs
```

You should see:
```
✅ Admin email sent successfully!
✅ Guest confirmation sent successfully!
```

## 📧 CURRENT CONFIGURATION

**File:** email-notification-service.mjs
**Current User:** admin@merry360x.com
**Current SMTP Key:** xsmtpsib-3d6d7acaedc3c50f96edd4c34baadee7a7137bca4fc9a2455976f73717c5ac7a-4QL7muXw3hnjWVFF

**This needs to be updated with:**
- ✅ A verified sender email
- ✅ The correct SMTP key for that email

## 🎯 NEXT STEPS

1. Login to Brevo
2. Verify your sender email (admin@merry360x.com or bebisdavy@gmail.com)
3. Get a fresh SMTP key
4. Update email-notification-service.mjs (lines 19-20)
5. Run: `node test-email-simple.mjs`
