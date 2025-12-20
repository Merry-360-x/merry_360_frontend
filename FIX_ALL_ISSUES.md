# 🔧 FIX ALL ISSUES - COMPLETE GUIDE

## ⚠️ ISSUE 1: Node.js Version (CRITICAL)

**Problem:** Node.js 18 and below are deprecated for @supabase/supabase-js

**Solution:**

### Step 1: Check your current Node.js version
```bash
node --version
```

### Step 2: Upgrade to Node.js 20 or later

**Option A: Using nvm (Recommended)**
```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20
nvm install 20

# Use Node.js 20
nvm use 20

# Set as default
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
```

**Option B: Using Homebrew (macOS)**
```bash
brew update
brew install node@20
brew unlink node  # If you have an older version
brew link node@20

# Verify
node --version  # Should show v20.x.x
```

**Option C: Download from nodejs.org**
- Visit: https://nodejs.org/
- Download Node.js 20 LTS
- Install and restart terminal

### Step 3: Reinstall dependencies
```bash
cd /Users/davy/merry_360_frontend
rm -rf node_modules package-lock.json
npm install
```

---

## ⚠️ ISSUE 2: Missing Bookings Table

**Problem:** The `bookings` table doesn't exist in Supabase

**Solution:**

### Go to Supabase Dashboard:
1. Visit: https://supabase.com/dashboard
2. Select your project: aqrzvlwgkjwaqthsjxpt
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the contents of `supabase-complete-setup.sql`
6. Click "Run" button

This will create:
- ✅ properties table (if not exists)
- ✅ tours table (if not exists)
- ✅ transport_services table (if not exists)
- ✅ **bookings table (NEW)**
- ✅ stories table (if not exists)
- ✅ profiles table (NEW)
- ✅ All RLS (Row Level Security) policies
- ✅ Indexes for performance
- ✅ Auto-update triggers

---

## ⚠️ ISSUE 3: RLS Policies

**Problem:** Some tables might have restrictive RLS policies blocking inserts

**Solution:** The SQL script above will fix all RLS policies to:
- Allow anyone to view available items
- Allow authenticated users to create items
- Allow users to manage their own items
- Proper bookings access control

---

## 🧪 VERIFY EVERYTHING WORKS

After completing the steps above, run this test:

```bash
node verify-setup.mjs
```

This will:
- ✅ Check Node.js version
- ✅ Verify Supabase connection
- ✅ Check all tables exist
- ✅ Test authentication
- ✅ Test creating records
- ✅ Verify 100% functionality

---

## 📊 EXPECTED RESULTS

After fixing all issues:

```
✅ Node.js version: 20.x.x or higher
✅ Supabase connection: Connected
✅ Properties table: Exists
✅ Tours table: Exists
✅ Transport table: Exists
✅ Bookings table: Exists ← FIXED
✅ Stories table: Exists
✅ All RLS policies: Configured
✅ Test success rate: 100%
```

---

## 🚀 QUICK FIX CHECKLIST

1. [ ] Upgrade Node.js to version 20+
2. [ ] Run `supabase-complete-setup.sql` in Supabase SQL Editor
3. [ ] Run `npm install` to reinstall dependencies
4. [ ] Run `node verify-setup.mjs` to test
5. [ ] Verify 100% success rate

---

## 💡 TROUBLESHOOTING

### If you still see "Invalid API key":
1. Check `.env` file has correct credentials
2. Make sure no extra spaces in API keys
3. Restart dev server after any .env changes

### If tables don't exist:
1. Make sure you ran the SQL in the correct Supabase project
2. Check SQL Editor for any error messages
3. Try running the SQL again

### If authentication fails:
1. Check Supabase Auth settings (Email/Password enabled)
2. Verify email confirmation is disabled for testing
3. Check RLS policies are not too restrictive

---

## 📞 SUPPORT

If issues persist:
1. Check Supabase dashboard logs
2. Check browser console for errors
3. Verify environment variables in `.env`
4. Make sure dev server is running on port 5174
