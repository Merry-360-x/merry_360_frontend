# Google OAuth Setup Guide for www.merry360x.com

## Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

## Step 2: Create or Select a Project
1. Click on the project dropdown at the top
2. Click "NEW PROJECT" or select an existing one
3. Name it "Merry360" or similar

## Step 3: Enable Google Sign-In API
1. Go to "APIs & Services" > "Library"
2. Search for "Google Identity Services"
3. Click "Enable" if not already enabled

## Step 4: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - User Type: External
   - App name: Merry360
   - User support email: your-email@domain.com
   - Developer contact: your-email@domain.com
   - Add your logo (optional)
   - Click "Save and Continue" through all steps

## Step 5: Configure OAuth Client
1. Application type: **Web application**
2. Name: "Merry360 Web Client"

3. **Authorized JavaScript origins** - Add these:
   ```
   https://www.merry360x.com
   http://www.merry360x.com
   http://localhost:5173
   http://localhost:3000
   ```

4. **Authorized redirect URIs** - Add these:
   ```
   https://www.merry360x.com
   https://www.merry360x.com/login
   https://www.merry360x.com/signup
   http://localhost:5173
   http://localhost:5173/login
   http://localhost:5173/signup
   ```

5. Click "CREATE"

## Step 6: Copy Your Client ID
1. After creating, you'll see a popup with your Client ID
2. Copy the **Client ID** (looks like: xxxxx.apps.googleusercontent.com)
3. Open your `.env` file
4. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   ```

## Step 7: Restart Your Development Server
```bash
npm run dev
```

## Step 8: Test Google Sign-In
1. Go to http://localhost:5173/login
2. Click the "Google" button
3. You should see the Google sign-in popup

## For Production Deployment (Vercel/Netlify):
1. Add the environment variable `VITE_GOOGLE_CLIENT_ID` in your hosting platform:
   - **Vercel**: Settings > Environment Variables
   - **Netlify**: Site settings > Environment variables
   
2. Redeploy your application

## Troubleshooting:

### "redirect_uri_mismatch" error:
- Make sure ALL your domains are added in "Authorized redirect URIs"
- Include both http:// and https:// versions
- Don't forget the exact paths (/login, /signup)

### "origin_mismatch" error:
- Check "Authorized JavaScript origins"
- Make sure www.merry360x.com is added
- Don't add paths in origins (only domain)

### Google button not showing:
- Check browser console for errors
- Verify VITE_GOOGLE_CLIENT_ID is set correctly
- Make sure .env file is in the root directory
- Restart development server after changing .env

## Security Notes:
- Client ID is public and safe to expose
- Never commit your .env file to git
- .env is already in .gitignore

## Current Domain Configuration:
✓ Primary Domain: www.merry360x.com
✓ Login pages: /login and /signup
✓ Google OAuth configured for both pages
