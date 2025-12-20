# Vercel Environment Variables Setup

The error "Google sign-in not configured" means Vercel doesn't have the VITE_USE_SUPABASE environment variable.

## Add these to Vercel:

1. Go to: https://vercel.com/das-48ca2629/merry-360-frontend/settings/environment-variables

2. Add the following environment variables (for Production, Preview, and Development):

**Required:**
- `VITE_USE_SUPABASE` = `true`
- `VITE_SUPABASE_URL` = `https://gzmxelgcdpaeklmabszo.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjIxOTEsImV4cCI6MjA4MTc5ODE5MX0.nPNTqN3O6eWouM_dPafFpa93YDn8iZDWBdDnS1ZJBb8`

**Optional (but recommended):**
- `VITE_USE_MOCK_API` = `false`
- `VITE_API_BASE_URL` = `https://gzmxelgcdpaeklmabszo.supabase.co`
- `VITE_APP_ENV` = `production`
- `VITE_GOOGLE_CLIENT_ID` = `270563800148-mafsbml3i6h01gjeo7qdlruc75a1s63i.apps.googleusercontent.com`
- `VITE_GOOGLE_CLIENT_SECRET` = `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`

## After adding variables:

3. Redeploy the application for changes to take effect

## OR run this command to add them all at once:

```bash
# This will copy .env variables to Vercel
vercel env pull
```

But it's better to add them manually through the Vercel dashboard for security.
