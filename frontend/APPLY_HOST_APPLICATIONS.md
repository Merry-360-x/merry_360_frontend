# Host Applications Setup

## Database Migration Required

You need to run this SQL in your Supabase SQL Editor to enable host applications:

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/sql
2. Click "New Query"

### Step 2: Run This SQL

```sql
-- Add host application fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS host_application_status TEXT CHECK (host_application_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS host_application_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS host_approved_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS host_rejected_date TIMESTAMPTZ;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_host_application_status ON profiles(host_application_status);

-- Comment the columns
COMMENT ON COLUMN profiles.host_application_status IS 'Status of host application: pending, approved, or rejected';
COMMENT ON COLUMN profiles.host_application_date IS 'When the user applied to become a host';
COMMENT ON COLUMN profiles.host_approved_date IS 'When the host application was approved';
COMMENT ON COLUMN profiles.host_rejected_date IS 'When the host application was rejected';
```

### Step 3: Test with Sample Application (Optional)

```sql
-- Create a test host application
UPDATE profiles 
SET 
  host_application_status = 'pending',
  host_application_date = NOW()
WHERE email = 'test@example.com'; -- Change to an actual user email
```

## How It Works

### For Users (Frontend)
Users can apply to become hosts from the "Become a Host" page at `/become-host`

### For Admins (Admin Panel)
1. Go to Admin Panel → **Host Applications** at `/admin/host-applications`
2. View all applications with status: Pending, Approved, or Rejected
3. Click **View Details** to see full user profile
4. Click **Approve** to promote user to host role (saved immediately to database)
5. Click **Reject** to deny the application

### Database Flow
- When user applies: `host_application_status = 'pending'`, `host_application_date = NOW()`
- When admin approves: `role = 'host'`, `host_application_status = 'approved'`, `host_approved_date = NOW()`
- When admin rejects: `host_application_status = 'rejected'`, `host_rejected_date = NOW()`

### Features
✅ Real-time stats (pending, approved today, total hosts, rejected)
✅ Filter by status (pending/approved/rejected)
✅ Instant database save when approving/rejecting
✅ Success toast notifications confirming saves
✅ Auto-reload after save to ensure consistency
✅ Full user details modal
✅ Shows application date and timestamps

## Access the Page

After applying the SQL migration:
1. Login as admin (bebisdavy@gmail.com)
2. Go to: https://merry-360-frontend-bkhyeerbo-das-48ca2629.vercel.app/admin/host-applications
3. You'll see "No pending applications found" until users apply or you create test data
