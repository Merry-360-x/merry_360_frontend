-- Database Cleanup Script
-- Run this in Supabase SQL Editor to clean up unused tables/columns

-- 1. Check for unused tables (these might be old/test tables)
-- Run this query first to see what exists:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Drop old test/migration tracking tables if they exist
-- (Only run if you see these in your database)
-- DROP TABLE IF EXISTS _prisma_migrations CASCADE;
-- DROP TABLE IF EXISTS schema_migrations CASCADE;

-- 3. Clean up old sessions or expired data
DELETE FROM bookings 
WHERE status = 'cancelled' 
  AND created_at < NOW() - INTERVAL '90 days';

-- 4. Clean up orphaned wishlist items (where user no longer exists)
DELETE FROM wishlist 
WHERE user_id NOT IN (SELECT id FROM profiles);

-- 5. Clean up orphaned messages (where conversation no longer exists)
-- DELETE FROM messages 
-- WHERE conversation_id NOT IN (SELECT id FROM conversations);

-- 6. Update statistics
VACUUM ANALYZE;

-- 7. Reindex for performance
REINDEX DATABASE postgres;
