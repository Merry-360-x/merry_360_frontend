# 🔐 ADMIN ACCOUNT SETUP GUIDE

## Your Admin Account

**Email:** `bebisdavy@gmail.com`  
**Status:** Configured as admin in the system ✅

---

## METHOD 1: Create via Browser (RECOMMENDED) ⭐

### Steps:

1. **Open the app:**
   - Local: http://localhost:5174/
   - Production: https://merry-360-frontend-2bzu70ix6-das-48ca2629.vercel.app

2. **Click "Sign Up" or "Create Account"**

3. **Fill in the form:**
   - **Email:** `bebisdavy@gmail.com`
   - **Password:** Choose a strong password (min 8 characters)
   - **First Name:** Davy
   - **Last Name:** Bebis

4. **Submit the form**

5. **Verify account created:**
   - Check Supabase Dashboard → Authentication → Users
   - Look for bebisdavy@gmail.com in the list

6. **Log in with your credentials**

✅ **Done!** You now have admin access!

---

## METHOD 2: Create via Script

Run the interactive script:

```bash
node create-admin.mjs
```

When prompted:
- **Email:** Press Enter (defaults to bebisdavy@gmail.com)
- **Password:** Enter your password
- **First Name:** Davy
- **Last Name:** Bebis

---

## METHOD 3: Create via Supabase Dashboard

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt

2. **Navigate to Authentication → Users**

3. **Click "Add User"**

4. **Fill in details:**
   - Email: `bebisdavy@gmail.com`
   - Password: Your password
   - Auto Confirm: Yes (check this)

5. **Click "Create User"**

6. **Optional: Add metadata**
   - Click on the user
   - Add metadata:
     ```json
     {
       "first_name": "Davy",
       "last_name": "Bebis",
       "role": "admin"
     }
     ```

---

## 🎯 Admin Privileges

Once logged in as `bebisdavy@gmail.com`, you'll have:

### ✅ AI Advisor Admin Controls
- **Take Control:** Interrupt AI conversations
- **3 Clearance Levels:**
  - 🟢 Support Agent (Level 1)
  - 🟡 Support Manager (Level 2)
  - 🔴 Administrator (Level 3)
- **Real-time Data:** AI uses live Supabase data
- **Admin Badge:** Your messages show admin status

### ✅ System Access
- Full access to all features
- Can post properties, tours, transport
- Can make bookings
- Can share stories
- Admin controls in AI chat

---

## 📍 Where Admin Features Appear

### AI Concierge/Advisor:
1. Open AI chat in the app
2. Look for **"Admin Controls"** panel
3. Options to:
   - Take control of conversation
   - Set clearance level
   - Interrupt AI
   - Send admin messages

### Code Location:
Admin features are in: `src/components/ai/AIConcierge.vue`

```javascript
// Admin emails (line ~20)
const adminEmails = ['admin@merry360x.com', 'bebisdavy@gmail.com']

// Clearance levels (line ~30)
const clearanceLevels = [
  { level: 1, name: 'Support Agent' },
  { level: 2, name: 'Support Manager' },
  { level: 3, name: 'Administrator' }
]
```

---

## ✅ Verify Admin Account

After creating the account:

### 1. Check Supabase:
- Go to: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/auth/users
- Find: bebisdavy@gmail.com
- Status should be: Confirmed ✅

### 2. Test Login:
- Open app: http://localhost:5174/
- Click "Login"
- Enter credentials
- Should log in successfully

### 3. Test Admin Features:
- Open AI Chat
- Look for admin controls
- Should see "Take Control" button
- Should see clearance level selector

---

## 🔧 Troubleshooting

### Can't create account?
- **Email already exists:** Use password reset
- **Email confirmation required:** 
  - Go to Supabase → Authentication → Settings
  - Disable "Enable email confirmations"
- **Invalid credentials:** Check .env file

### Don't see admin controls?
- **Verify email matches:** Must be exactly `bebisdavy@gmail.com`
- **Check code:** Open `src/components/ai/AIConcierge.vue`
- **Clear cache:** Refresh browser (Cmd+Shift+R)
- **Re-login:** Log out and log back in

### Password issues?
- **Forgot password:** Use password reset feature
- **Too short:** Must be at least 8 characters
- **Reset via Supabase:**
  - Go to Authentication → Users
  - Click on user → Reset password

---

## 🚀 Quick Start

**Fastest way to get started:**

1. Open: http://localhost:5174/
2. Click: "Sign Up"
3. Enter: bebisdavy@gmail.com + password
4. Submit
5. Done! ✅

---

## 📊 Admin Account Summary

```
Email:     bebisdavy@gmail.com
Role:      Administrator
Access:    Full system access + AI admin controls
Features:  All user features + admin privileges
System:    Configured in AIConcierge.vue
Status:    Ready to create ✅
```

---

## 🎯 Next Steps

1. ✅ Create admin account (use METHOD 1 above)
2. ✅ Log in to the app
3. ✅ Test AI admin features
4. ✅ Explore all system features
5. ✅ Start using the platform!

---

**Ready to create your admin account! Use METHOD 1 (browser signup) - it's the easiest!** 🚀
