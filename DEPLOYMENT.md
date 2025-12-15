# Merry360X Deployment Guide

## 🚀 Quick Deployment Options

Your application is ready to deploy! Choose one of these platforms:

---

## Option 1: Vercel (Recommended - Easiest)

### Via GitHub (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import `merry_360_frontend` repository
5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click "Deploy"
7. ✅ Done! Your app will be live at `https://merry-360-frontend.vercel.app`

### Via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /Users/davy/merry_360_frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: merry-360-frontend
# - Directory: ./
# - Override settings? No

# Production deployment
vercel --prod
```

**Deployment Time:** ~2 minutes  
**URL Format:** `https://your-project.vercel.app`

---

## Option 2: Netlify

### Via GitHub
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "Add new site" > "Import an existing project"
4. Choose GitHub and select `merry_360_frontend`
5. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy site"
7. ✅ Done! Live at `https://your-site.netlify.app`

### Via CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd /Users/davy/merry_360_frontend
netlify init

# Follow prompts, then:
netlify deploy --prod
```

**Deployment Time:** ~2 minutes  
**URL Format:** `https://your-site.netlify.app`

---

## Option 3: GitHub Pages

### Setup
```bash
cd /Users/davy/merry_360_frontend

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy script to package.json
# (See below)

# Build and deploy
npm run deploy
```

### Add to package.json
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  },
  "homepage": "https://Merry-360-x.github.io/merry_360_frontend"
}
```

### GitHub Settings
1. Go to repository Settings
2. Pages section
3. Source: Deploy from branch `gh-pages`
4. ✅ Live at `https://Merry-360-x.github.io/merry_360_frontend`

**Deployment Time:** ~3 minutes  
**Note:** Requires base URL configuration in vite.config.js

---

## Option 4: Railway

### Via GitHub
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `merry_360_frontend`
6. Railway auto-detects Vite
7. ✅ Deployed automatically

**Deployment Time:** ~3 minutes  
**URL Format:** `https://your-project.up.railway.app`

---

## Option 5: Render

### Via GitHub
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New Static Site"
4. Connect `merry_360_frontend`
5. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
6. Click "Create Static Site"
7. ✅ Done!

**Deployment Time:** ~3 minutes  
**URL Format:** `https://your-site.onrender.com`

---

## 🎯 Recommended: Vercel

**Why Vercel?**
- ✅ Fastest deployment (1-click)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Preview deployments for PRs
- ✅ Built for Vite/React/Vue
- ✅ Free tier generous
- ✅ Custom domains easy

---

## 🔧 Pre-Deployment Checklist

### 1. Build Test
```bash
npm run build
```
Should complete without errors.

### 2. Preview Build
```bash
npm run preview
```
Test at http://localhost:4173

### 3. Environment Variables
If using real APIs (not mocks), add to platform:
```
VITE_API_URL=https://api.yourdomain.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_USE_FIREBASE=false
VITE_USE_SUPABASE=false
```

### 4. Custom Domain (Optional)
After deployment, add custom domain:
- Vercel: Settings > Domains
- Netlify: Site settings > Domain management
- Add DNS records as instructed

---

## 📦 Build Output

Your built app will be in `/dist`:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── public assets (videos, images, etc.)
```

**Size:** ~500KB (gzipped)  
**Load Time:** <2 seconds

---

## 🚀 Quick Deploy Command (Vercel)

```bash
# One command to deploy
npx vercel --prod
```

That's it! Your app will be live in minutes.

---

## 🌐 After Deployment

### Update GitHub README
Add your live URL:
```markdown
## 🌐 Live Demo
Visit the live application: https://your-app.vercel.app
```

### Test Checklist
- [ ] Homepage loads
- [ ] Authentication works
- [ ] Property creation works
- [ ] Dark mode works
- [ ] Language switching works
- [ ] All routes accessible
- [ ] Mobile responsive
- [ ] Performance good (Lighthouse)

---

## 💡 Tips

1. **Automatic Deployments:** Connect GitHub to auto-deploy on push to main
2. **Environment Branches:** 
   - `main` → Production
   - `dev` → Staging/Preview
3. **Analytics:** Add Vercel Analytics or Google Analytics
4. **Monitoring:** Set up error tracking (Sentry)
5. **SEO:** Add meta tags for social sharing

---

## 🎉 Your App is Ready to Go Live!

Choose Vercel for fastest deployment (recommended) or any other platform. All configuration files are included!
