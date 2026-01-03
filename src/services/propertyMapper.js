/**
 * Property mapping utilities
 *
 * Keeps formatting of property/accommodation data consistent across:
 * - public pages (Home, AccommodationList/Detail)
 * - staff/host portals
 * - admin views
 */

export function normalizePropertyType(rawType) {
  const value = String(rawType || '').trim()
  if (!value) return 'Accommodation'

  const normalized = value
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const map = {
    hotel: 'Hotel',
    motel: 'Motel',
    resort: 'Resort',
    lodge: 'Lodge',
    apartment: 'Apartment',
    villa: 'Villa',
    guesthouse: 'Guesthouse',
    'guest house': 'Guesthouse',
    'guest-house': 'Guesthouse'
  }

  return map[normalized] || value.charAt(0).toUpperCase() + value.slice(1)
}

export function mapPropertyRowToAccommodation(row) {
  if (!row) return null

  return {
    id: row.id,
    name: row.name,
    type: normalizePropertyType(row.property_type),
    location: row.city || row.location,
    price: row.price_per_night,
    rating: row.rating ?? 0,
    reviews: row.reviews_count ?? 0,
    description: row.description || '',
    amenities: row.amenities || [],
    image: row.main_image || row.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
    images: row.images || (row.main_image ? [row.main_image] : []),
    ecoFriendly: false,
    createdAt: row.created_at || null
  }
}

export function mapPropertyRowForPortals(row) {
  if (!row) return null

  const image = row.main_image || row.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'

  return {
    ...row,
    property_type: normalizePropertyType(row.property_type),
    location: row.city || row.location,
    main_image: row.main_image || image,
    images: Array.isArray(row.images) && row.images.length ? row.images : [image]
  }
}

export function getHostLabel(row) {
  const profiles = row?.profiles
  if (!profiles) return 'Unknown Host'

  const fullName = `${profiles.first_name || ''} ${profiles.last_name || ''}`.trim()
  return fullName || profiles.email || 'Unknown Host'
}
