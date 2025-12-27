#!/bin/bash
set -e

DB_PASSWORD="HF8Q97jsSj0LS3n1"
POOLER_HOST="aws-0-eu-central-1.pooler.supabase.com"
POOLER_PORT="6543"
DB_NAME="postgres"
PROJECT_REF="gzmxelgcdpaeklmabszo"
DB_USER="postgres.${PROJECT_REF}"

SQL="DROP POLICY IF EXISTS \"Allow admins to update any profile\" ON profiles;
CREATE POLICY \"Allow admins to update any profile\" ON profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));"

echo "🔧 Attempting to fix RLS policies via pooler..."
echo "Pooler: $POOLER_HOST:$POOLER_PORT"
echo "User: $DB_USER"
echo ""

export PGPASSWORD="$DB_PASSWORD"
psql "postgresql://${DB_USER}:${DB_PASSWORD}@${POOLER_HOST}:${POOLER_PORT}/${DB_NAME}?sslmode=require" -c "$SQL"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ RLS policy updated successfully!"
else
  echo ""
  echo "❌ Failed to update RLS policy"
  exit 1
fi
