#!/bin/bash

# Supabase Database Schema Applier
# This script applies APPLY_THIS_SQL.sql to your Supabase database

echo "🚀 Applying database schema to Supabase..."
echo ""

# Supabase project details
PROJECT_REF="aqrzvlwgkjwaqthsjxpt"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcnp2bHdna2p3YXF0aHNqeHB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MDAwOSwiZXhwIjoyMDgxMDQ2MDA5fQ.wgtCbgMA2fQPQEt-NkwjmbaH54FqrF7c5MqdOML2LW0"

# Read SQL file
SQL_CONTENT=$(cat APPLY_THIS_SQL.sql)

# Split SQL into individual statements and execute each
echo "📤 Executing SQL statements..."
echo ""

# Split by semicolons and filter out comments and empty lines
IFS=';' read -ra STATEMENTS <<< "$SQL_CONTENT"

success_count=0
error_count=0
total=0

for statement in "${STATEMENTS[@]}"; do
    # Clean statement
    clean_statement=$(echo "$statement" | sed '/^--/d' | sed '/^$/d' | xargs)
    
    # Skip if empty
    if [ -z "$clean_statement" ]; then
        continue
    fi
    
    ((total++))
    
    # Execute via PostgREST
    response=$(curl -s -w "\n%{http_code}" -X POST \
      "https://${PROJECT_REF}.supabase.co/rest/v1/rpc/query" \
      -H "apikey: ${SERVICE_ROLE_KEY}" \
      -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=representation" \
      -d "{\"query\": \"${clean_statement};\"}")
    
    http_code=$(echo "$response" | tail -1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "✅ Statement $total executed"
        ((success_count++))
    else
        echo "⚠️  Statement $total: error $http_code"
        ((error_count++))
    fi
done

echo ""
echo "📊 Results: $success_count success, $error_count errors out of $total statements"

echo ""
if [ $success_count -gt 0 ]; then
    echo "✅ Schema application complete!"
    echo ""
    echo "📊 Next steps:"
    echo "   1. Visit: https://supabase.com/dashboard/project/${PROJECT_REF}/editor"
    echo "   2. Check tables: profiles, properties, bookings, etc."
    echo "   3. Test admin panel: www.merry360x.com/admin/properties"
else
    echo "⚠️  Could not execute via API"
    echo ""
    echo "🔧 Use Supabase Dashboard instead:"
    echo "   1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new"
    echo "   2. Copy/paste APPLY_THIS_SQL.sql"
    echo "   3. Click RUN"
fi
