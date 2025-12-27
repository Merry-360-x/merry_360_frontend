# 🚨 CRITICAL FIX: Admin Role Changes Not Persisting

## Problem
When you change a user's role to "host" on the admin dashboard, it appears to work but reverts when you refresh the page. This is because **Row Level Security (RLS) policies** are blocking the update.

## Solution
You need to run this SQL in your Supabase dashboard:

### Step 1: Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/sql/new

### Step 2: Copy and Paste This Exact SQL

```sql
DROP POLICY IF EXISTS "Allow admins to update any profile" ON profiles;

CREATE POLICY "Allow admins to update any profile"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
  )
);
```

### Step 3: Click "RUN" button

### Step 4: Test
1. Go to https://merry360x.com/admin/users
2. Change a user's role to "host"
3. Click the green "Save Role" button
4. Refresh the page (⌘+R or Ctrl+R)
5. The role should now stay as "host" ✅

## Why This Fixes It
The SQL creates an RLS policy that allows users with `role='admin'` to update ANY user's profile. Currently, there's either no policy or a restrictive one blocking admin updates.

## What I Tried
I attempted to apply this fix automatically using:
- ✅ Created migration file: `supabase/migrations/20251221000003_fix_admin_rls_only.sql`
- ❌ `supabase db push` - connection timeout
- ❌ Direct `psql` connection - port 5432 blocked  
- ❌ Pooler connection - "Tenant or user not found"
- ❌ Node.js script - need service role key (not in .env)

The only way to apply this is through the **Supabase Web Dashboard SQL Editor**.

## After You Run This
Let me know and I'll test that role changes persist properly!
