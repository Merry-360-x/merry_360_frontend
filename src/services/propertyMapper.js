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
  
  // Handle images array - could be JSONB array or string array
  let images = []
  if (Array.isArray(row.images)) {
    images = row.images.filter(img => img && typeof img === 'string' && img.trim())
  } else if (Array.isArray(row.additional_images)) {
    images = row.additional_images.filter(img => img && typeof img === 'string' && img.trim())
  }
  
  // Combine main_image with images array, removing duplicates
  const allImagesSet = new Set()
  if (mainImage && typeof mainImage === 'string' && mainImage.trim()) {
    allImagesSet.add(mainImage.trim())
  }
  images.forEach(img => {
    if (img && typeof img === 'string' && img.trim()) {
      allImagesSet.add(img.trim())
    }
  })
  
  const allImages = Array.from(allImagesSet).filter(Boolean)
  const fallbackImage = allImages[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'

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
    images: allImages.length > 0 ? allImages : [fallbackImage], // Always return array with at least fallback
    main_image: allImages[0] || fallbackImage, // Ensure main_image is set
    beds,
    baths,
    area,
    ecoFriendly: false,
    vrTourEnabled: row.vr_tour_enabled || false,
    vrTourUrl: row.vr_tour_url || null,
    vrTourType: row.vr_tour_type || null,
    latitude: row.latitude || null,
    longitude: row.longitude || null,
    createdAt: row.created_at || null,
    host_id: row.host_id || null
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
  // If profiles object exists (from join), use it
  const profiles = row?.profiles
  if (profiles) {
    const fullName = `${profiles.first_name || ''} ${profiles.last_name || ''}`.trim()
    return fullName || profiles.email || 'Unknown Host'
  }
  
  // Otherwise, just return the host_id or Unknown
  return row?.host_id ? `Host ID: ${row.host_id}` : 'Unknown Host'
}
