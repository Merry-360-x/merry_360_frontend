#!/bin/bash

# ================================================
# AUTOMATED DATABASE SETUP FOR MERRY360X
# ================================================

echo "🔧 MERRY360X DATABASE SETUP"
echo "================================================"
echo ""
echo "I'm opening your Supabase SQL Editor..."
echo ""
echo "📋 INSTRUCTIONS:"
echo "1. The SQL editor will open in your browser"
echo "2. Copy the SQL from COMPLETE_DATABASE_SETUP.sql (already in clipboard!)"
echo "3. Paste it into the SQL editor"
echo "4. Click 'RUN' button"
echo "5. Wait for completion message"
echo ""
echo "================================================"
echo ""

# Copy SQL to clipboard
cat COMPLETE_DATABASE_SETUP.sql | pbcopy
echo "✅ SQL copied to clipboard!"
echo ""

# Open Supabase SQL Editor
open "https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/sql/new"

echo "🌐 Browser opened!"
echo ""
echo "⏳ Waiting for you to run the SQL..."
echo "   Press ENTER when done to verify..."
read

echo ""
echo "🔍 Verifying database setup..."
echo ""

# Run verification
node verify-database.mjs

echo ""
echo "================================================"
echo "✅ SETUP COMPLETE!"
echo "================================================"
