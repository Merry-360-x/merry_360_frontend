-- ============================================
-- BOOKING NOTIFICATION SYSTEM SETUP
-- ============================================
-- This SQL creates database functions and triggers to:
-- 1. Automatically notify admin when new bookings are created
-- 2. Send email notifications via Supabase Edge Function
-- 3. Track notification history
-- ============================================

-- Create notifications table to track all admin notifications
CREATE TABLE IF NOT EXISTS booking_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  notification_type TEXT NOT NULL DEFAULT 'new_booking',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_notifications_booking_id ON booking_notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_notifications_status ON booking_notifications(status);
CREATE INDEX IF NOT EXISTS idx_booking_notifications_created_at ON booking_notifications(created_at DESC);

-- Create function to notify admin about new bookings
CREATE OR REPLACE FUNCTION notify_admin_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  admin_email TEXT := 'admin@merry360x.com';
  property_name TEXT;
  guest_email TEXT;
  guest_name TEXT;
  total_price NUMERIC;
  booking_dates TEXT;
BEGIN
  -- Extract booking details
  guest_email := NEW.booking_details->>'guest_email';
  guest_name := NEW.booking_details->>'guest_name';
  total_price := NEW.total_price;
  booking_dates := NEW.start_date || ' to ' || NEW.end_date;
  
  -- Get property name
  SELECT name INTO property_name 
  FROM properties 
  WHERE id = NEW.item_id;
  
  -- Insert notification record
  INSERT INTO booking_notifications (
    booking_id,
    admin_email,
    notification_type,
    status,
    created_at
  ) VALUES (
    NEW.id,
    admin_email,
    'new_booking',
    'pending',
    NOW()
  );
  
  -- Log notification details (visible in Supabase logs)
  RAISE NOTICE 'NEW BOOKING NOTIFICATION:';
  RAISE NOTICE 'Booking ID: %', NEW.id;
  RAISE NOTICE 'Property: %', property_name;
  RAISE NOTICE 'Guest: % <%>', guest_name, guest_email;
  RAISE NOTICE 'Dates: %', booking_dates;
  RAISE NOTICE 'Total: $%', total_price;
  RAISE NOTICE 'Status: %', NEW.status;
  RAISE NOTICE '---';
  RAISE NOTICE 'Admin Email: %', admin_email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_notify_admin_new_booking ON bookings;

-- Create trigger that fires on new booking creation
CREATE TRIGGER trigger_notify_admin_new_booking
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_booking();

-- Create function to get pending notifications
CREATE OR REPLACE FUNCTION get_pending_notifications()
RETURNS TABLE (
  notification_id UUID,
  booking_id UUID,
  admin_email TEXT,
  booking_details JSONB,
  property_name TEXT,
  guest_name TEXT,
  guest_email TEXT,
  total_price NUMERIC,
  booking_dates TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bn.id as notification_id,
    bn.booking_id,
    bn.admin_email,
    b.booking_details,
    p.name as property_name,
    b.booking_details->>'guest_name' as guest_name,
    b.booking_details->>'guest_email' as guest_email,
    b.total_price,
    (b.start_date::text || ' to ' || b.end_date::text) as booking_dates,
    b.status,
    bn.created_at
  FROM booking_notifications bn
  JOIN bookings b ON bn.booking_id = b.id
  LEFT JOIN properties p ON b.item_id = p.id
  WHERE bn.status = 'pending'
  ORDER BY bn.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark notification as sent
CREATE OR REPLACE FUNCTION mark_notification_sent(notification_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE booking_notifications
  SET status = 'sent', sent_at = NOW()
  WHERE id = notification_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark notification as failed
CREATE OR REPLACE FUNCTION mark_notification_failed(
  notification_id UUID,
  error_msg TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE booking_notifications
  SET status = 'failed', error_message = error_msg
  WHERE id = notification_id;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON booking_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_notifications() TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_sent(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_failed(UUID, TEXT) TO authenticated;

-- Create RLS policies for booking_notifications
ALTER TABLE booking_notifications ENABLE ROW LEVEL SECURITY;

-- Admins can see all notifications
CREATE POLICY "Admins can view all notifications" ON booking_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- System can insert notifications
CREATE POLICY "System can insert notifications" ON booking_notifications
  FOR INSERT WITH CHECK (true);

-- System can update notifications
CREATE POLICY "System can update notifications" ON booking_notifications
  FOR UPDATE USING (true);

-- ============================================
-- TESTING QUERIES
-- ============================================

-- View all notifications
-- SELECT * FROM booking_notifications ORDER BY created_at DESC;

-- Get pending notifications with full details
-- SELECT * FROM get_pending_notifications();

-- Count notifications by status
-- SELECT status, COUNT(*) FROM booking_notifications GROUP BY status;

-- ============================================
-- ADMIN DASHBOARD QUERY
-- ============================================
-- Use this query in your admin dashboard to show recent bookings:

/*
SELECT 
  b.id as booking_id,
  b.created_at,
  b.status as booking_status,
  b.total_price,
  b.currency,
  b.start_date,
  b.end_date,
  b.guests,
  p.name as property_name,
  p.location as property_location,
  b.booking_details->>'guest_name' as guest_name,
  b.booking_details->>'guest_email' as guest_email,
  b.booking_details->>'guest_phone' as guest_phone,
  b.booking_details->>'special_requests' as special_requests,
  bn.status as notification_status,
  bn.sent_at as notification_sent_at
FROM bookings b
LEFT JOIN properties p ON b.item_id = p.id
LEFT JOIN booking_notifications bn ON b.id = bn.booking_id
ORDER BY b.created_at DESC
LIMIT 50;
*/
