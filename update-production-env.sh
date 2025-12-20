#!/bin/bash

echo "🔧 Updating Vercel Production Environment Variables"
echo "=================================================="

# Remove old variables if they exist
echo "Removing old Supabase variables..."
vercel env rm VITE_SUPABASE_URL production -y 2>/dev/null || true
vercel env rm VITE_SUPABASE_ANON_KEY production -y 2>/dev/null || true

echo ""
echo "Adding correct Supabase variables..."

# Add VITE_SUPABASE_URL
echo "https://gzmxelgcdpaeklmabszo.supabase.co" | vercel env add VITE_SUPABASE_URL production

# Add VITE_SUPABASE_ANON_KEY
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMDQzNzAsImV4cCI6MjA0OTc4MDM3MH0.Oi3xCmPCYEjykOrLEp2AxBE8kzewy0nDNlbcGkuKL1w" | vercel env add VITE_SUPABASE_ANON_KEY production

echo ""
echo "✅ Environment variables updated!"
echo ""
echo "Now deploying to production..."
