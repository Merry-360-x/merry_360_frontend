-- ============================================
-- Fix RLS Policies - Run this in Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/gzmxelgcdpaeklmabszo/editor
-- ============================================

-- Fix notifications policies - allow users to create notifications
DROP POLICY IF EXISTS "Users can create own notifications" ON public.notifications;
CREATE POLICY "Users can create own notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Fix loyalty_transactions policies - allow users to create transactions
DROP POLICY IF EXISTS "System can create loyalty transactions" ON public.loyalty_transactions;
CREATE POLICY "System can create loyalty transactions"
    ON public.loyalty_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Fix wishlist policies - split into specific operations
DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlist;

DROP POLICY IF EXISTS "Users can insert to wishlist" ON public.wishlist;
CREATE POLICY "Users can insert to wishlist"
    ON public.wishlist FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from wishlist" ON public.wishlist;
CREATE POLICY "Users can delete from wishlist"
    ON public.wishlist FOR DELETE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update wishlist" ON public.wishlist;
CREATE POLICY "Users can update wishlist"
    ON public.wishlist FOR UPDATE
    USING (auth.uid() = user_id);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('notifications', 'loyalty_transactions', 'wishlist')
ORDER BY tablename, policyname;
