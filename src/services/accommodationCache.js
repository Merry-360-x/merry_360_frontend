const PREFIX = 'merry360:accommodations:getAll:'
const DEFAULT_TTL_MS = 30 * 60 * 1000 // 30 minutes

const MAX_CACHED_IMAGES = 3

const compactAccommodation = (acc) => {
  const imagesRaw = Array.isArray(acc?.images) ? acc.images : []
  const images = imagesRaw.filter(Boolean).slice(0, MAX_CACHED_IMAGES)
  const image = acc?.image || images[0] || acc?.main_image || null

  // Keep only fields needed for listing/search/filter UIs.
  return {
    id: acc?.id,
    title: acc?.title || acc?.name,
    name: acc?.name || acc?.title,
    location: acc?.location || acc?.city || '',
    city: acc?.city,
    type: acc?.type || acc?.property_type,
    property_type: acc?.property_type || acc?.type,
    price: acc?.price,
    beds: acc?.beds,
    baths: acc?.baths,
    area: acc?.area,
    rating: acc?.rating,
    reviews: acc?.reviews,
    amenities: Array.isArray(acc?.amenities) ? acc.amenities : [],
    ecoFriendly: Boolean(acc?.ecoFriendly),
    images,
    image,
    main_image: acc?.main_image,
    available: acc?.available
  }
}

const canUseStorage = () => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

const stableStringify = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return JSON.stringify(value)
  }

  const sorted = {}
  for (const key of Object.keys(value).sort()) {
    const v = value[key]
    if (v === undefined) continue
    sorted[key] = v
  }
  return JSON.stringify(sorted)
}

export const getAllCacheKey = (params = {}) => {
  return `${PREFIX}${stableStringify(params || {})}`
}

export const getCachedAccommodations = (params = {}, { ttlMs = DEFAULT_TTL_MS } = {}) => {
  if (!canUseStorage()) return null

  const key = getAllCacheKey(params)
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const ts = Number(parsed?.ts)
    const data = parsed?.data

    if (!Number.isFinite(ts) || !Array.isArray(data)) return null

    const age = Date.now() - ts
    return {
      key,
      ts,
      age,
      isFresh: age >= 0 && age <= ttlMs,
      data
    }
  } catch {
    return null
  }
}

export const setCachedAccommodations = (params = {}, data = []) => {
  if (!canUseStorage()) return

  const key = getAllCacheKey(params)
  try {
    const list = Array.isArray(data) ? data : []
    const compactList = list.map(compactAccommodation)
    window.localStorage.setItem(
      key,
      JSON.stringify({ ts: Date.now(), data: compactList })
    )
  } catch {
    // ignore quota / serialization errors
  }
}

export const clearAccommodationCache = () => {
  if (!canUseStorage()) return

  try {
    const keysToRemove = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith(PREFIX)) keysToRemove.push(k)
    }
    for (const k of keysToRemove) {
      window.localStorage.removeItem(k)
    }
  } catch {
    // ignore
  }
}
