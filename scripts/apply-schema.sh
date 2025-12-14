#!/bin/bash
# Apply Supabase schema to remote database

echo "🚀 Applying schema to Supabase cloud database..."

# Read the SQL file
SQL_FILE="supabase/migrations/20251213_init_schema.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Migration file not found: $SQL_FILE"
    exit 1
fi

# Execute the SQL via Supabase CLI
supabase db execute -f "$SQL_FILE" --project-ref aqrzvlwgkjwaqthsjxpt

echo "✅ Schema applied successfully!"
echo ""
echo "Next steps:"
echo "1. Create storage buckets (avatars, messages, stories)"
echo "2. Test the app: npm run dev"
