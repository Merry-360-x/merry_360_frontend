# Host Application System Documentation

## Overview
The host application system allows users to apply to become hosts on Merry360x, offering accommodations, tours, transport services, or other services. When a user submits an application, both the admin and the applicant receive email notifications.

---

## Features

✅ **Application Form** - `/become-host` page with comprehensive form  
✅ **Supabase Integration** - Applications saved to `host_applications` table  
✅ **Email Notifications** - Both admin and applicant receive emails  
✅ **Real-time Monitoring** - Email service monitors for new applications  
✅ **Status Tracking** - Applications can be pending, approved, or rejected  

---

## Database Setup

### 1. Create the Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create host_applications table
CREATE TABLE IF NOT EXISTS public.host_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  hosting_type TEXT NOT NULL CHECK (hosting_type IN ('accommodation', 'tour', 'transport', 'service')),
  description TEXT NOT NULL,
  experience TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.host_applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can submit host application"
  ON public.host_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all host applications"
  ON public.host_applications FOR SELECT
  USING (
    auth.jwt() ->> 'email' IN ('admin@merry360x.com', 'bebisdavy@gmail.com')
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Users can view their own host applications"
  ON public.host_applications FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Admins can update host applications"
  ON public.host_applications FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN ('admin@merry360x.com', 'bebisdavy@gmail.com')
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Indexes
CREATE INDEX idx_host_applications_email ON public.host_applications(email);
CREATE INDEX idx_host_applications_status ON public.host_applications(status);
CREATE INDEX idx_host_applications_created_at ON public.host_applications(created_at DESC);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.host_applications;
```

### 2. Verify Table Creation

Check that the table exists:
```sql
SELECT * FROM host_applications LIMIT 5;
```

---

## Email Notification Service

### Start the Service

The email notification service now monitors both bookings AND host applications:

```bash
# Monitor all notifications (bookings + host applications)
node email-notification-service.mjs

# Monitor only bookings
node email-notification-service.mjs bookings

# Monitor only host applications
node email-notification-service.mjs hosts
```

### Email Templates

When a host application is submitted, two emails are sent:

1. **Admin Notification** (`admin@merry360x.com`)
   - Application details
   - Applicant contact info
   - What they want to host
   - Direct link to admin dashboard

2. **Applicant Confirmation** (to the applicant's email)
   - Confirmation of receipt
   - Next steps explanation
   - Application summary
   - Document checklist
   - Contact information

---

## Application Flow

### 1. User Submits Application

**URL:** `https://merry360x.com/become-host`

User fills out:
- Full Name *
- Email Address *
- Phone Number *
- Location *
- Hosting Type * (accommodation, tour, transport, service)
- Description *
- Experience Level (optional)
- Terms Agreement *

### 2. Data Saved to Supabase

Application is inserted into `host_applications` table with:
- `status: 'pending'`
- `created_at: NOW()`
- All form data

### 3. Real-time Trigger

Supabase Realtime detects the INSERT and triggers the email service.

### 4. Emails Sent

- **Admin:** Receives detailed application with action required notice
- **Applicant:** Receives confirmation with next steps

### 5. Admin Reviews

Admin can:
- View application in dashboard
- Contact applicant
- Update status to 'approved' or 'rejected'

---

## Frontend Components

### BecomeHost.vue

Located at: `src/views/host/BecomeHost.vue`

**Key Features:**
- Comprehensive application form
- Supabase integration via `supabase.from('host_applications').insert()`
- Toast notifications for success/error
- Form validation
- Responsive design

**Imports:**
```javascript
import { supabase } from '../../services/supabase'
import { useToast } from '../../composables/useToast'
```

**Submit Handler:**
```javascript
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    const { data, error } = await supabase
      .from('host_applications')
      .insert([{
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        hosting_type: formData.hostingType,
        description: formData.description,
        experience: formData.experience || null,
        status: 'pending'
      }])
      .select()
      .single()
    
    if (error) throw error
    
    showToast('Application submitted successfully!', 'success')
    // Reset form...
  } catch (error) {
    showToast('Failed to submit application.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
```

---

## Testing

### 1. Test Application Submission

1. Navigate to `https://merry360x.com/become-host`
2. Fill out the form completely
3. Click "Submit Application"
4. Verify success toast appears
5. Check Supabase dashboard for new record

### 2. Test Email Notifications

1. Ensure email service is running:
   ```bash
   node email-notification-service.mjs
   ```

2. Submit a host application

3. Check console output for:
   ```
   🏠 NEW HOST APPLICATION!
   ─────────────────────────────
   Applicant: [Name]
   Email: [Email]
   Hosting Type: [Type]
   ─────────────────────────────
   ✅ All notifications sent successfully!
   ```

4. Check emails:
   - Admin inbox (`admin@merry360x.com`)
   - Applicant inbox (email used in form)

### 3. Verify Database

Check Supabase:
```sql
SELECT * FROM host_applications ORDER BY created_at DESC LIMIT 5;
```

---

## Admin Management

### View Applications

Create an admin interface to:
- List all applications
- Filter by status (pending/approved/rejected)
- View application details
- Update status
- Contact applicants

**Example Query:**
```javascript
const { data: applications } = await supabase
  .from('host_applications')
  .select('*')
  .eq('status', 'pending')
  .order('created_at', { ascending: false })
```

### Approve Application

```javascript
const { error } = await supabase
  .from('host_applications')
  .update({ status: 'approved', updated_at: new Date() })
  .eq('id', applicationId)
```

### Reject Application

```javascript
const { error } = await supabase
  .from('host_applications')
  .update({ status: 'rejected', updated_at: new Date() })
  .eq('id', applicationId)
```

---

## Files Modified/Created

### Created:
1. `supabase-host-applications-table.sql` - Database schema
2. `HOST_APPLICATION_SYSTEM.md` - This documentation

### Modified:
1. `src/views/host/BecomeHost.vue` - Added Supabase integration
2. `email-notification-service.mjs` - Added host application monitoring and email templates
3. `SUPABASE_SETUP.md` - Updated to mention host applications table

---

## Hosting Types

The system supports four hosting types:

| Type | Label | Description |
|------|-------|-------------|
| `accommodation` | Accommodation | Hotels, guesthouses, apartments, unique stays |
| `tour` | Tours & Experiences | Guided tours, activities, experiences |
| `transport` | Transport Services | Car rentals, airport transfers, drivers |
| `service` | Other Services | Photography, guides, consultations, etc. |

---

## Security

### Row Level Security (RLS)

✅ **Anyone** can submit an application (INSERT)  
✅ **Admins** can view all applications (SELECT)  
✅ **Users** can view their own applications (SELECT)  
✅ **Admins** can update applications (UPDATE)  
❌ **Non-admins** cannot update or delete applications  

### Admin Identification

Admins are identified by:
- Email: `admin@merry360x.com`
- Email: `bebisdavy@gmail.com`
- Role: `admin` (in JWT)

---

## Monitoring & Logging

The email service logs:
- New application received
- Applicant details
- Email sending status
- Success/failure messages

**Example Console Output:**
```
🏠 NEW HOST APPLICATION!
─────────────────────────────────────────
Applicant: John Doe
Email: john@example.com
Hosting Type: accommodation
Location: Kigali, Rwanda
Application ID: 123e4567-e89b-12d3-a456-426614174000
─────────────────────────────────────────
Sending notifications...

   ✅ Admin notification sent to admin@merry360x.com
      Message ID: <abc123@smtp.com>
   ✅ Confirmation sent to applicant: john@example.com
      Message ID: <def456@smtp.com>
✅ All notifications sent successfully!
─────────────────────────────────────────
```

---

## Troubleshooting

### Application Not Saving

**Check:**
1. Supabase connection (check `.env` variables)
2. Table exists and RLS policies are correct
3. Form validation passes
4. Browser console for errors

### Emails Not Sending

**Check:**
1. Email service is running
2. SMTP credentials are correct in `email-notification-service.mjs`
3. Realtime is enabled on `host_applications` table
4. Console output shows errors

**Enable Realtime:**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.host_applications;
```

### Permission Denied

**Check:**
1. RLS policies are created correctly
2. User has proper authentication
3. Admin email is in policy list

---

## Future Enhancements

- [ ] Admin dashboard view for applications
- [ ] Email notifications when status changes (approved/rejected)
- [ ] Automated background checks integration
- [ ] Document upload support
- [ ] SMS notifications
- [ ] Application analytics
- [ ] Bulk approval/rejection

---

## Support

For issues or questions:
- Email: admin@merry360x.com
- Check application logs
- Review Supabase logs
- Test email service manually

---

**Last Updated:** December 2024  
**Version:** 1.0
