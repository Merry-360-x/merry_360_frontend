#!/bin/bash

echo "🔧 Fixing Production Environment Variables"
echo "=========================================="

# Remove old variables
echo "Step 1: Removing old VITE_SUPABASE_ANON_KEY..."
vercel env rm VITE_SUPABASE_ANON_KEY production -y

echo ""
echo "Step 2: Removing old VITE_SUPABASE_URL..."
vercel env rm VITE_SUPABASE_URL production -y

# Add correct variables
echo ""
echo "Step 3: Adding correct VITE_SUPABASE_URL..."
echo "https://gzmxelgcdpaeklmabszo.supabase.co" | vercel env add VITE_SUPABASE_URL production

echo ""
echo "Step 4: Adding correct VITE_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bXhlbGdjZHBhZWtsbWFic3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjIxOTEsImV4cCI6MjA4MTc5ODE5MX0.nPNTqN3O6eWouM_dPafFpa93YDn8iZDWBdDnS1ZJBb8" | vercel env add VITE_SUPABASE_ANON_KEY production

echo ""
echo "✅ Environment variables updated!"
echo ""
echo "Step 5: Deploying with new variables..."
vercel --prod --force

echo ""
echo "🎉 Done! Your production site should now work correctly."
