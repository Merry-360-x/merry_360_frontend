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

  const normalizedType = normalizePropertyType(row.property_type ?? row.type ?? row.category)
  const location = row.city || row.location || row.address || ''
  const price = row.price_per_night ?? row.price ?? row.pricePerNight ?? 0
  const mainImage = row.main_image || row.image || row.mainImage || null
  const images = Array.isArray(row.images) ? row.images : (Array.isArray(row.additional_images) ? row.additional_images : [])
  const fallbackImage = mainImage || images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'

  const beds = row.bedrooms ?? row.beds ?? row.bed_count ?? 1
  const baths = row.bathrooms ?? row.baths ?? row.bath_count ?? 1
  const area = row.area ?? row.square_feet ?? row.size_sqft ?? row.size ?? 0

  return {
    id: row.id,
    name: row.name,
    // UI components in the codebase sometimes expect `title`
    title: row.name,
    type: normalizedType,
    location,
    price,
    rating: row.rating ?? 0,
    reviews: row.reviews_count ?? 0,
    description: row.description || '',
    amenities: row.amenities || [],
    image: fallbackImage,
    images: images?.length ? images : (mainImage ? [mainImage] : [fallbackImage]),
    beds,
    baths,
    area,
    ecoFriendly: false,
    vrTourEnabled: row.vr_tour_enabled || false,
    vrTourUrl: row.vr_tour_url || null,
    vrTourType: row.vr_tour_type || null,
    latitude: row.latitude || null,
    longitude: row.longitude || null,
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
