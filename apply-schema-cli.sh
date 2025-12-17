#!/bin/bash

echo "🔐 Database Schema Application Script"
echo "======================================"
echo ""
echo "To apply the schema via CLI, you need your database password."
echo ""
echo "📋 Steps to get your password:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/settings/database"
echo "2. Scroll to 'Database password' section"
echo "3. Click 'Reset database password' or view existing"
echo "4. Copy the password"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -sp "Enter your database password: " DB_PASSWORD
echo ""
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ No password provided. Exiting."
    exit 1
fi

echo "🚀 Connecting to database and applying schema..."
echo ""

# Try connection with transaction pooler (port 6543)
export PGPASSWORD="$DB_PASSWORD"
psql "postgresql://postgres.aqrzvlwgkjwaqthsjxpt:$DB_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres" \
  -f APPLY_THIS_SQL.sql 2>/dev/null

if [ $? -ne 0 ]; then
    echo "⚠️  Pooler connection failed. Trying direct connection (port 5432)..."
    psql "postgresql://postgres:$DB_PASSWORD@db.aqrzvlwgkjwaqthsjxpt.supabase.co:5432/postgres" \
      -f APPLY_THIS_SQL.sql
    exit_code=$?
else
    exit_code=0
fi

if [ $exit_code -eq 0 ]; then
    echo ""
    echo "✅ Schema applied successfully!"
    echo ""
    echo "📊 Next steps:"
    echo "   1. Verify tables: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/editor"
    echo "   2. Test admin panel: www.merry360x.com/admin/properties"
    echo "   3. Test loyalty points: Login → check points persist"
    echo ""
else
    echo ""
    echo "❌ Error applying schema. Try the dashboard method:"
    echo ""
    echo "1. Go to: https://supabase.com/dashboard/project/aqrzvlwgkjwaqthsjxpt/sql/new"
    echo "2. Copy all content from APPLY_THIS_SQL.sql"
    echo "3. Paste in editor"
    echo "4. Click RUN"
    echo ""
fi

# Clear password from env
unset PGPASSWORD
