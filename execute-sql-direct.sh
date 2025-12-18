#!/bin/bash

# Direct SQL execution via Supabase pooler with environment variables
PGPASSWORD="Merry@360x@" psql \
  -h "aws-0-us-east-1.pooler.supabase.com" \
  -p 6543 \
  -U "postgres.aqrzvlwgkjwaqthsjxpt" \
  -d "postgres" \
  -f "supabase-host-applications-table.sql"
