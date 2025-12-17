# 🚀 Quick Database Setup (2 Minutes)

## Method 1: Supabase Dashboard (EASIEST - Recommended)

### Step 1: Open SQL Editor
Click here: [Open Supabase SQL Editor](https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/sql/new)

### Step 2: Copy & Paste
1. Open the file: `APPLY_THIS_SQL.sql`
2. Copy ALL content (Cmd+A, Cmd+C)
3. Paste into SQL Editor (Cmd+V)
4. Click **RUN** button

### Step 3: Verify
Run this to check:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see: `profiles`, `properties`, `conversations`, `messages`, `bookings`, `payments`

## Method 2: Using psql (If you have database password)

```bash
cat APPLY_THIS_SQL.sql | psql "postgresql://postgres.aqrzvlwgkjwaqthsjxpt:YOUR_ACTUAL_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

**Get your password:**
1. Go to: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/settings/database
2. Click "Database password" → "Reset password" or view existing
3. Copy the password
4. Replace `YOUR_ACTUAL_PASSWORD` in command above

---

## ✅ After Setup Complete

1. **Test Admin Panel**: Visit `www.merry360x.com/admin/properties`
2. **Test Loyalty Points**: Login → check points persist after logout
3. **Test Property CRUD**: Create/edit/delete properties

## 🔍 Troubleshooting

**Issue: "relation already exists"**
- ✅ This is GOOD! It means tables already exist
- Just means some parts already set up

**Issue: "permission denied"**
- Make sure you're logged in to Supabase Dashboard
- Your account must be project owner

**Issue: "syntax error"**
- Make sure you copied the ENTIRE SQL file
- Don't skip any lines

---

## 📋 What Gets Created

### Tables:
- ✅ `profiles` - User profiles with **loyalty_points** & **loyalty_tier**
- ✅ `properties` - Admin-managed properties with **images[]**, **tour_360[]**, **vr_content[]**
- ✅ `conversations` - Real-time chat
- ✅ `messages` - Chat messages
- ✅ `bookings` - Reservation system
- ✅ `payments` - Payment tracking

### Security:
- ✅ Row Level Security (RLS) on all tables
- ✅ Public can read properties
- ✅ Only authenticated users can create/update own data
- ✅ Admins can manage properties

### Performance:
- ✅ Indexes on foreign keys
- ✅ Indexes on commonly queried fields

---

**Need help?** The easiest method is Method 1 (Dashboard). Takes 30 seconds!
