#!/bin/bash
echo "🔧 Updating Vercel Environment Variables..."
echo ""

# Remove old variables (will prompt for confirmation)
echo "Step 1: Removing old VITE_SUPABASE_URL..."
vercel env rm VITE_SUPABASE_URL production --yes

echo ""
echo "Step 2: Removing old VITE_SUPABASE_ANON_KEY..."
vercel env rm VITE_SUPABASE_ANON_KEY production --yes

echo ""
echo "Step 3: Adding correct VITE_SUPABASE_URL..."
echo "https://gzmxelgcdpaeklmabszo.supabase.co" | vercel env add VITE_SUPABASE_URL production

echo ""
echo "Step 4: Adding correct VITE_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMDQzNzAsImV4cCI6MjA0OTc4MDM3MH0.Oi3xCmPCYEjykOrLEp2AxBE8kzewy0nDNlbcGkuKL1w" | vercel env add VITE_SUPABASE_ANON_KEY production

echo ""
echo "✅ Environment variables updated!"
echo "Now deploying with new variables..."
echo ""

vercel --prod

echo ""
echo "🎉 Done! Check the deployment to verify Google OAuth works."
