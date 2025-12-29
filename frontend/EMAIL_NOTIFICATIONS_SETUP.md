# Email Notifications (Host Applications)

This project sends email notifications when a user submits a host application:
- Confirmation email to the applicant
- Notification email to the admin

This is implemented as a **Supabase Edge Function**: `send-host-application-emails`.

## 1) Prerequisites
- A Supabase project (already used by the app)
- A transactional email provider account
  - Using: **Brevo** (Sendinblue) SMTP API

## 2) Configure secrets in Supabase
In your terminal (with Supabase CLI logged into your project):

```bash
supabase secrets set \
  BREVO_API_KEY="YOUR_BREVO_API_KEY" \
  ADMIN_NOTIFICATION_EMAIL="admin@example.com" \
  FROM_EMAIL="no-reply@yourdomain.com" \
  FROM_NAME="Merry360"
```

Notes:
- `FROM_EMAIL` must be a sender address allowed by Brevo.
- `ADMIN_NOTIFICATION_EMAIL` is where the admin notifications are delivered.

## 3) Deploy the function
```bash
supabase functions deploy send-host-application-emails
```

## 4) Verify
1. Submit a host application from `/become-host`
2. Confirm:
   - Host receives a confirmation email
   - Admin receives an email containing the applicant email and a link to `/admin/host-applications`

## Troubleshooting
- If the UI says the application is submitted but email fails, check Supabase Function logs.
- Make sure the `FROM_EMAIL` / domain is verified with Brevo.
