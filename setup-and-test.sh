#!/bin/bash

# Host Application Setup Helper
# This script guides you through the setup process

echo ""
echo "🚀 HOST APPLICATION SETUP"
echo "════════════════════════════════════"
echo ""
echo "The SQL has been copied to your clipboard!"
echo "The Supabase SQL Editor is opening in your browser..."
echo ""
echo "📋 STEPS TO COMPLETE:"
echo ""
echo "1. ✅ SQL Editor will open in browser"
echo "2. ✅ SQL is already in your clipboard"
echo "3. 📝 Paste (Cmd+V) into the SQL Editor"
echo "4. ▶️  Click 'Run' or press Cmd+Enter"
echo "5. ✅ Wait for 'Success. No rows returned'"
echo ""
echo "Then come back here and run:"
echo "  → node test-host-application.mjs"
echo ""
echo "════════════════════════════════════"
echo ""

# Wait a moment for browser to open
sleep 2

echo "✨ Waiting for you to run the SQL..."
echo ""
echo "When done, press Enter to test..."
read

# Run the test
echo ""
echo "🧪 Running test..."
echo ""
node test-host-application.mjs

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Now start the monitor:"
    echo "   node email-notification-service.mjs hosts"
    echo ""
else
    echo ""
    echo "⚠️  Test failed. Make sure you ran the SQL in Supabase."
    echo ""
fi
