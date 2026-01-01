-- Option B data migration: backfill tours/vehicles from listings and link existing bookings
--
-- This migration is safe to run multiple times:
-- - Inserts only when the target row does not exist.
-- - Updates bookings only when target FK column is null.

-- Backfill tours from listings
INSERT INTO public.tours (
  id,
  name,
  destination,
  duration_days,
  price,
  category,
  available,
  main_image,
  images,
  rating,
  reviews_count,
  created_at,
  updated_at
)
SELECT
  l.id,
  COALESCE(NULLIF(l.title, ''), 'Tour') AS name,
  NULLIF(l.location, '') AS destination,
  NULLIF((l.metadata->>'duration_days')::int, NULL) AS duration_days,
  l.price,
  COALESCE(NULLIF(l.category, ''), NULLIF(l.subcategory, ''), 'tour') AS category,
  COALESCE(l.availability, true) AS available,
  NULLIF(l.images[1], '') AS main_image,
  to_jsonb(l.images) AS images,
  l.rating,
  l.review_count,
  l.created_at,
  l.updated_at
FROM public.listings l
WHERE lower(COALESCE(l.category, '')) LIKE 'tour%'
  AND NOT EXISTS (SELECT 1 FROM public.tours t WHERE t.id = l.id);

-- Backfill vehicles from listings
INSERT INTO public.vehicles (
  id,
  name,
  type,
  capacity,
  price_per_day,
  license_plate,
  driver_included,
  available,
  created_at,
  updated_at
)
SELECT
  l.id,
  COALESCE(NULLIF(l.title, ''), 'Vehicle') AS name,
  COALESCE(NULLIF(l.subcategory, ''), NULLIF(l.category, ''), 'vehicle') AS type,
  l.capacity,
  l.price,
  NULLIF(l.metadata->>'license_plate', '') AS license_plate,
  COALESCE((l.metadata->>'driver_included')::boolean, false) AS driver_included,
  CASE
    WHEN lower(COALESCE(l.status, '')) = 'active' THEN true
    WHEN lower(COALESCE(l.availability::text, '')) IN ('true', 't', '1') THEN true
    ELSE false
  END AS available,
  l.created_at,
  l.updated_at
FROM public.listings l
WHERE lower(COALESCE(l.category, '')) IN ('transport', 'vehicle', 'vehicles', 'car', 'rental')
  AND NOT EXISTS (SELECT 1 FROM public.vehicles v WHERE v.id = l.id);

-- Link existing bookings to tours/vehicles based on listing_id match
-- This is best-effort and only runs when listing_id exists.
UPDATE public.bookings b
SET tour_id = b.listing_id
WHERE b.tour_id IS NULL
  AND b.listing_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.tours t WHERE t.id = b.listing_id);

UPDATE public.bookings b
SET vehicle_id = b.listing_id
WHERE b.vehicle_id IS NULL
  AND b.listing_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.vehicles v WHERE v.id = b.listing_id);
