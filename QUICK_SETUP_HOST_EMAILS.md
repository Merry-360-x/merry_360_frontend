# Quick Setup: Host Application Emails

## 1. Create Database Table

Go to your Supabase project → SQL Editor and run:

```sql
-- Copy and paste the entire contents of:
supabase-host-applications-table.sql
```

This creates the `host_applications` table with proper permissions.

## 2. Start Email Service

```bash
# Start monitoring for BOTH bookings and host applications
node email-notification-service.mjs

# Or monitor only host applications
node email-notification-service.mjs hosts
```

## 3. Test the Feature

1. Go to: https://merry360x.com/become-host
2. Fill out the application form
3. Click "Submit Application"
4. Check your terminal - you should see:
   ```
   🏠 NEW HOST APPLICATION!
   ─────────────────────────
   Applicant: [Name]
   Email: [Email]
   ✅ All notifications sent!
   ```

5. Check emails:
   - **Admin** (`admin@merry360x.com`) gets application details
   - **Applicant** gets confirmation with next steps

## 4. Verify in Supabase

Check the data was saved:
```sql
SELECT * FROM host_applications ORDER BY created_at DESC LIMIT 5;
```

---

## What Was Implemented

✅ **Database Table:** `host_applications` with RLS policies  
✅ **Form Integration:** BecomeHost.vue saves to Supabase  
✅ **Email Templates:** Beautiful HTML emails for admin and applicant  
✅ **Real-time Monitoring:** Email service watches for new applications  
✅ **Toast Notifications:** Success/error messages for users  

---

## Email Service Commands

```bash
# Monitor everything (bookings + host applications)
node email-notification-service.mjs

# Monitor only bookings
node email-notification-service.mjs bookings

# Monitor only host applications
node email-notification-service.mjs hosts

# Check pending notifications
node email-notification-service.mjs check
```

---

## Files Changed

1. **supabase-host-applications-table.sql** ← Run this in Supabase
2. **src/views/host/BecomeHost.vue** ← Updated form
3. **email-notification-service.mjs** ← Added monitoring
4. **HOST_APPLICATION_SYSTEM.md** ← Full documentation

---

## Troubleshooting

### Application not saving?
- Check Supabase connection
- Verify table was created
- Check browser console for errors

### Emails not sending?
- Ensure email service is running
- Check SMTP credentials in `email-notification-service.mjs`
- Verify Realtime is enabled:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE public.host_applications;
  ```

### Form showing error?
- Check Supabase RLS policies
- Verify "Anyone can submit" policy exists

---

**Need help?** See [HOST_APPLICATION_SYSTEM.md](HOST_APPLICATION_SYSTEM.md) for detailed documentation.
