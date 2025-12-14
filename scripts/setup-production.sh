#!/bin/bash
# Quick Setup Script for Production Database

echo "🚀 PRODUCTION DATABASE SETUP"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}This script will guide you through setting up your production database.${NC}"
echo ""

# Check if dev server is running
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Dev server is running${NC}"
else
    echo -e "${YELLOW}⚠️  Dev server not detected. Start it with: npm run dev${NC}"
fi

echo ""
echo "📋 SETUP CHECKLIST:"
echo "-------------------"
echo ""

# Step 1
echo -e "${YELLOW}Step 1: Apply Database Schema${NC}"
echo "   Open this link in your browser:"
echo "   👉 https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/sql/new"
echo ""
echo "   Then:"
echo "   1. Open APPLY_THIS_SQL.sql in your editor"
echo "   2. Copy ALL the SQL code"
echo "   3. Paste into Supabase SQL Editor"
echo "   4. Click RUN button"
echo ""
read -p "Press ENTER when you've completed Step 1..."

# Test database
echo ""
echo "Testing database connection..."
node scripts/test-integration.js | grep -E "(conversations table|messages table|payments table)" > /tmp/db_test.txt

if grep -q "exists" /tmp/db_test.txt; then
    echo -e "${GREEN}✅ Database tables detected!${NC}"
else
    echo -e "${RED}❌ Tables not found. Make sure you ran the SQL in Supabase.${NC}"
    echo ""
    echo "Need help? Check PRODUCTION_SETUP.md"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Create Storage Buckets${NC}"
echo "   Open this link in your browser:"
echo "   👉 https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/storage/buckets"
echo ""
echo "   Create these 3 PUBLIC buckets:"
echo "   1. avatars"
echo "   2. messages"
echo "   3. stories"
echo ""
read -p "Press ENTER when you've completed Step 2..."

# Test buckets
echo ""
echo "Testing storage buckets..."
node scripts/test-integration.js | grep -E "Storage bucket" > /tmp/bucket_test.txt

if grep -q "exists" /tmp/bucket_test.txt; then
    echo -e "${GREEN}✅ Storage buckets detected!${NC}"
else
    echo -e "${YELLOW}⚠️  Some buckets might be missing. Double-check Supabase.${NC}"
fi

echo ""
echo -e "${YELLOW}Step 3 (Optional): Enable Realtime${NC}"
echo "   Open this link in your browser:"
echo "   👉 https://app.supabase.com/project/aqrzvlwgkjwaqthsjxpt/settings/realtime"
echo ""
echo "   Toggle ON for these tables:"
echo "   • messages"
echo "   • conversations"
echo ""
read -p "Press ENTER to skip or when done..."

echo ""
echo "================================"
echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:5173"
echo "2. Click 'Sign Up'"
echo "3. Create your first real user account"
echo "4. Test features: profile, bookings, messages"
echo ""
echo "Full guide: PRODUCTION_SETUP.md"
echo ""
