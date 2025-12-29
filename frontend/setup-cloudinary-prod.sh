#!/bin/bash

# This script sets Cloudinary environment variables and redeploys to production

echo "🚀 Setting up Cloudinary for production..."
echo ""

# Try to remove existing variables (user can cancel if they don't exist)
echo "Step 1: Removing old variables (if any)..."
echo "n" | vercel env rm VITE_CLOUDINARY_CLOUD_NAME production 2>/dev/null || true
echo "n" | vercel env rm VITE_CLOUDINARY_UPLOAD_PRESET production 2>/dev/null || true

echo ""
echo "Step 2: Adding new variables..."

# Add VITE_CLOUDINARY_CLOUD_NAME
echo "Adding VITE_CLOUDINARY_CLOUD_NAME..."
echo -e "n\ndml5w7t0u" | vercel env add VITE_CLOUDINARY_CLOUD_NAME production || {
  echo "⚠️  Variable already exists. Please update manually at:"
  echo "   https://vercel.com/das-48ca2629/merry-360-frontend/settings/environment-variables"
}

# Add VITE_CLOUDINARY_UPLOAD_PRESET  
echo "Adding VITE_CLOUDINARY_UPLOAD_PRESET..."
echo -e "n\nml_default" | vercel env add VITE_CLOUDINARY_UPLOAD_PRESET production || {
  echo "⚠️  Variable already exists. Please update manually at:"
  echo "   https://vercel.com/das-48ca2629/merry-360-frontend/settings/environment-variables"
}

echo ""
echo "✅ Environment variables configured!"
echo ""
echo "Step 3: Redeploying to production..."
vercel --prod

echo ""
echo "🎉 Done! Your site should now support profile picture uploads."
