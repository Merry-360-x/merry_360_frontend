# Production Setup Guide for Merry360

## 🎯 Overview
This guide will help you make all features work in production on **www.merry360x.com**

---

## 📋 Required Services & Setup

### 1. ✅ Google OAuth (Already Configured)
Follow the `GOOGLE_OAUTH_SETUP.md` guide to:
- Get Google Client ID
- Add authorized domains
- Update environment variable

**Environment Variable:**
```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

---

### 2. 🔐 Authentication Backend (Choose One)

#### Option A: Supabase (Recommended - Easiest)
**Why:** Free tier, handles auth, database, storage, real-time features

**Setup Steps:**
1. Go to https://supabase.com
2. Create a new project (name it "Merry360")
3. Get your credentials from Project Settings > API
4. Update `.env`:
```env
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Enable Google OAuth in Supabase:
   - Go to Authentication > Providers
   - Enable Google
   - Add your Google Client ID and Secret
   - Add redirect URL: https://your-project.supabase.co/auth/v1/callback

**Features Enabled:**
- ✅ User authentication (email/password)
- ✅ Google OAuth
- ✅ User profiles
- ✅ Database for bookings, properties, reviews
- ✅ Real-time messaging
- ✅ File storage for images

#### Option B: Firebase
**Setup Steps:**
1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable Authentication > Email/Password and Google
4. Get your config from Project Settings
5. Update `.env`:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

#### Option C: Custom Backend API
Build your own backend using:
- Node.js + Express
- Python + FastAPI
- Ruby on Rails
- etc.

Update `.env`:
```env
VITE_API_BASE_URL=https://api.merry360x.com
VITE_USE_MOCK_API=false
```

---

### 3. 🗺️ Google Maps API
**Required for:** Property location maps, directions

**Setup Steps:**
1. Go to https://console.cloud.google.com (same as OAuth)
2. Enable "Maps JavaScript API" and "Maps Embed API"
3. Create API key with restrictions:
   - HTTP referrers: www.merry360x.com/*
4. Update `.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your-maps-api-key
```

**Cost:** $200 free credit monthly (enough for small apps)

---

### 4. 💳 Payment Processing

#### Stripe (Recommended)
**Setup Steps:**
1. Create account at https://stripe.com
2. Get your publishable key from Dashboard > Developers > API keys
3. Update `.env`:
```env
VITE_USE_STRIPE=true
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
```

**Features:**
- Credit/debit cards
- Mobile payments (Apple Pay, Google Pay)
- International currencies

#### PayPal
```env
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
```

---

### 5. 📸 Image Upload & Storage

#### Option A: Cloudinary (Easiest)
**Setup Steps:**
1. Create account at https://cloudinary.com (free tier: 25GB storage)
2. Get credentials from Dashboard
3. Update `.env`:
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset
```

4. Create upload preset in Cloudinary:
   - Settings > Upload > Add upload preset
   - Signing Mode: Unsigned
   - Folder: merry360-uploads

**Features:**
- Automatic image optimization
- Thumbnail generation
- CDN delivery
- Image transformations

#### Option B: Use Supabase Storage
Already included if using Supabase for auth

---

### 6. 🤖 AI Concierge (Optional)

#### OpenAI Integration
**Setup Steps:**
1. Create account at https://platform.openai.com
2. Create API key
3. Set up backend proxy (don't expose key in frontend!)

**Backend endpoint needed:**
```
POST /api/ai/chat
Body: { message: "user question" }
```

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub (already done ✅)
2. Go to https://vercel.com
3. Import your GitHub repository: `Merry-360-x/merry_360_frontend`
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add all environment variables from `.env`
6. Add custom domain: www.merry360x.com
7. Deploy!

### Netlify
1. Go to https://netlify.com
2. New site from Git
3. Connect GitHub repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables
6. Add custom domain
7. Deploy!

---

## 📝 Complete Environment Variables Checklist

Copy this to your production environment:

```env
# App
VITE_APP_NAME=Merry360
VITE_APP_ENV=production

# API
VITE_API_BASE_URL=https://api.merry360x.com
VITE_USE_MOCK_API=false

# Google Services
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
VITE_GOOGLE_MAPS_API_KEY=your-maps-api-key

# Authentication (Choose One)
# Option 1: Supabase
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Option 2: Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Payments
VITE_USE_STRIPE=true
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_PAYPAL_CLIENT_ID=your-paypal-id

# Image Storage
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset

# Features
VITE_ENABLE_CRYPTO_PAYMENTS=false
VITE_ENABLE_AI_CONCIERGE=true
```

---

## 🎯 Quick Start (Minimum Viable)

**To get started quickly with basic functionality:**

1. **Authentication:** Set up Supabase (30 minutes)
   - Sign up, create project, copy credentials
   - Enables login, signup, user profiles

2. **Google OAuth:** Follow GOOGLE_OAUTH_SETUP.md (15 minutes)
   - Get Client ID, add authorized domains

3. **Deploy:** Push to Vercel/Netlify (15 minutes)
   - Connect GitHub, add environment variables
   - Add custom domain www.merry360x.com

**Total Time: ~1 hour for basic working app**

---

## 🔒 Security Checklist

- [ ] All environment variables set in production (not in code)
- [ ] Google OAuth authorized domains configured
- [ ] Stripe/PayPal webhook secrets configured (if using payments)
- [ ] API rate limiting enabled
- [ ] CORS configured correctly
- [ ] HTTPS enforced (automatic with Vercel/Netlify)
- [ ] Database row-level security enabled (Supabase)

---

## 📊 Cost Estimate (Monthly)

**Free Tier (Good for MVP):**
- Hosting (Vercel/Netlify): $0
- Supabase: $0 (500MB database, 1GB storage)
- Google Maps: $0 (25,000 loads/month included)
- Cloudinary: $0 (25GB storage, 25GB bandwidth)
- **Total: $0/month**

**Paid Tier (Growing App):**
- Hosting: $20/month (Pro plan)
- Supabase: $25/month (Pro plan)
- Google Maps: ~$10-50/month
- Cloudinary: $0-89/month
- Stripe: 2.9% + $0.30 per transaction
- **Total: ~$55-200/month + transaction fees**

---

## 🆘 Support

For help with specific services:
- Supabase: https://supabase.com/docs
- Firebase: https://firebase.google.com/docs
- Vercel: https://vercel.com/docs
- Stripe: https://stripe.com/docs
- Google Cloud: https://console.cloud.google.com

---

## ✅ Testing Production

After deployment:
1. Test Google OAuth login
2. Create test booking
3. Upload test image
4. Test payment flow (use Stripe test mode)
5. Test on mobile devices
6. Test in different browsers
7. Check Google Maps display
8. Test search and filters

---

## 🎉 You're Ready!

Once you complete the setup above, all features will work in production on www.merry360x.com!
