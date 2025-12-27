#!/bin/bash
set -e

# Connection details
DB_PASSWORD="HF8Q97jsSj0LS3n1"
DB_HOST="db.gzmxelgcdpaeklmabszo.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

# SQL to execute
SQL="DROP POLICY IF EXISTS \"Allow admins to update any profile\" ON profiles;
CREATE POLICY \"Allow admins to update any profile\" ON profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));"

echo "🔧 Attempting to fix RLS policies..."
echo "Host: $DB_HOST"
echo "Database: $DB_NAME"
echo ""

# Try direct connection
export PGPASSWORD="$DB_PASSWORD"
psql "host=$DB_HOST port=$DB_PORT dbname=$DB_NAME user=$DB_USER sslmode=require" -c "$SQL"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ RLS policy updated successfully!"
else
  echo ""
  echo "❌ Failed to update RLS policy"
  exit 1
fi
