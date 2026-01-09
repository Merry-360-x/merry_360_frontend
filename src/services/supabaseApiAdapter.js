/**
 * Supabase API Adapter
 *
 * Provides the same interface shape as `src/services/api.js`'s HTTP client
 * (api.accommodations.getAll, api.tours.getAll, etc.) but executes directly
 * against Supabase.
 */

import { supabase } from './supabase'
import { normalizePropertyType, mapPropertyRowToAccommodation } from './propertyMapper'
import { clearAccommodationCache, getAllCacheKey, getCachedAccommodations, setCachedAccommodations } from './accommodationCache'
import { markAsFetched, wasFetchedThisSession } from './memoryCache'

const inflightAccommodationGetAll = new Map()

// Minimal select for home page - ultra fast loading
const PROPERTIES_HOME_SELECT = [
  'id',
  'name',
  'property_type',
  'location',
  'city',
  'price_per_night',
  'bedrooms',
  'bathrooms',
  'main_image',
  'images',
  'rating',
  'reviews_count'
].join(',')

// Keep payload small for public listing pages. If some columns are missing in a
// given environment, we fall back to select('*') automatically.
const PROPERTIES_LIST_SELECT = [
  'id',
  'name',
  'description',
  'property_type',
  'location',
  'city',
  'country',
  'address',
  'price_per_night',
  'bedrooms',
  'bathrooms',
  'max_guests',
  'amenities',
  'images',
  'main_image',
  'available',
  'rating',
  'reviews_count',
  'created_at'
].join(',')

const isMissingColumnError = (error, columnHint = '') => {
  const msg = String(error?.message || '').toLowerCase()
  const code = String(error?.code || '')
  if (code === '42703') return true
  if (msg.includes('column') && msg.includes('does not exist')) return true
  if (columnHint && msg.includes(columnHint.toLowerCase())) return true
  return false
}

export const supabaseApiAdapter = {
  accommodations: {
    getAll: async (params = {}) => {
      const cacheKey = getAllCacheKey(params)
      const cached = getCachedAccommodations(params)

      // If we have fresh cached data, serve it instantly.
      if (cached?.data?.length && cached.isFresh) {
        // Only refresh in background if we haven't fetched this session
        if (!wasFetchedThisSession(cacheKey)) {
          markAsFetched(cacheKey)
          // Trigger background refresh but return immediately
          const bg = (async () => {
            try {
              const fresh = await buildAndExecuteQuery()
              const mapped = (fresh.data || []).map(mapPropertyRowToAccommodation)
              setCachedAccommodations(params, mapped)
            } catch (err) {
              console.warn('Background cache refresh failed:', err)
            }
          })()
        }
        return { data: cached.data }
      }

      // De-dupe concurrent requests with identical params.
      const existing = inflightAccommodationGetAll.get(cacheKey)
      if (existing) {
        // If we have stale cache, return it instantly while fetch completes
        if (cached?.data?.length) {
          return { data: cached.data }
        }
        return existing
      }

      const { search, q, guests, limit } = params || {}
      const termRaw = (q ?? search)
      const term = termRaw != null ? String(termRaw).trim() : ''
      const guestsCount = guests != null && String(guests).trim() ? Number(guests) : null

      const buildQuery = ({ includeAvailabilityFilter } = { includeAvailabilityFilter: true }) => {
        // Use minimal select for home page (limit 8) for ultra-fast loading
        const selectFields = limit === 8 ? PROPERTIES_HOME_SELECT : PROPERTIES_LIST_SELECT
        
        let query = supabase
          .from('properties')
          .select(selectFields)
          .order('created_at', { ascending: false })

        // Public pages should only show active listings, but some environments
        // store legacy rows with NULL availability (or lack the column).
        if (includeAvailabilityFilter) {
          query = query.or('available.is.null,available.eq.true')
        }

        if (term) {
          // Use separate filter conditions to avoid comma parsing issues in search terms
          // Replace commas with spaces for the OR query, or use a different approach
          const safeTerm = term.replace(/,/g, ' ')
          query = query.or(`name.ilike.%${safeTerm}%,location.ilike.%${safeTerm}%,city.ilike.%${safeTerm}%`)
        }

        if (Number.isFinite(guestsCount) && guestsCount > 0) {
          query = query.gte('max_guests', guestsCount)
        }

        if (limit) {
          query = query.limit(limit)
        } else {
          // Default limit to prevent large payloads - optimized for speed
          query = query.limit(30)
        }

        return query
      }

      const buildAndExecuteQuery = async () => {
        let data
        let error

        // First attempt: small select + availability filter.
        ;({ data, error } = await buildQuery({ includeAvailabilityFilter: true }))

        // Retry without availability filter if the column is missing.
        if (error && isMissingColumnError(error, 'available')) {
          ;({ data, error } = await buildQuery({ includeAvailabilityFilter: false }))
        }

        // If any selected column is missing, fall back to select('*').
        if (error && isMissingColumnError(error)) {
          const buildStarQuery = ({ includeAvailabilityFilter } = { includeAvailabilityFilter: true }) => {
            let query = supabase
              .from('properties')
              .select('*')
              .order('created_at', { ascending: false })

            if (includeAvailabilityFilter) {
              query = query.or('available.is.null,available.eq.true')
            }

            if (term) {
              // Use separate filter conditions to avoid comma parsing issues in search terms
              // Replace commas with spaces for the OR query, or use a different approach
              const safeTerm = term.replace(/,/g, ' ')
              query = query.or(`name.ilike.%${safeTerm}%,location.ilike.%${safeTerm}%,city.ilike.%${safeTerm}%`)
            }

            if (Number.isFinite(guestsCount) && guestsCount > 0) {
              query = query.gte('max_guests', guestsCount)
            }

            if (limit) {
              query = query.limit(limit)
            }

            return query
          }

          ;({ data, error } = await buildStarQuery({ includeAvailabilityFilter: true }))
          if (error && isMissingColumnError(error, 'available')) {
            ;({ data, error } = await buildStarQuery({ includeAvailabilityFilter: false }))
          }
        }

        if (error) throw error
        return { data }
      }

      const fetchPromise = (async () => {
        try {
          const result = await buildAndExecuteQuery()
          const mapped = (result.data || []).map(mapPropertyRowToAccommodation)
          setCachedAccommodations(params, mapped)
          markAsFetched(cacheKey)
          return { data: mapped }
        } finally {
          inflightAccommodationGetAll.delete(cacheKey)
        }
      })()

      inflightAccommodationGetAll.set(cacheKey, fetchPromise)

      // If we have stale cache, return it instantly (UI is already showing it)
      if (cached?.data?.length) {
        return { data: cached.data }
      }

      return fetchPromise
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      // Map to accommodation format and include host_id
      const mapped = mapPropertyRowToAccommodation(data)
      if (mapped && data.host_id) {
        mapped.host_id = data.host_id
      }
      
      return { data: mapped }
    },

    search: async (query) => {
      return supabaseApiAdapter.accommodations.getAll({ search: query })
    },

    getNearby: async () => {
      // No geo columns currently in schema; return latest available.
      return supabaseApiAdapter.accommodations.getAll({})
    },

    getReviews: async (id) => {
      // Reviews table is keyed to listings in some parts of the codebase; for
      // properties, we return an empty list unless a property_reviews table exists.
      return { data: [], accommodationId: id }
    },

    create: async (propertyData) => {
      // Get user auth - fast, cached operation
      const { data: auth } = await supabase.auth.getUser()
      const user = auth?.user
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Prepare data immediately (no async here)
      const pricePerNight = Number(propertyData.price_per_night ?? propertyData.price)
      const bedrooms = Number(propertyData.beds ?? propertyData.bedrooms ?? 1)
      const bathrooms = Number(propertyData.baths ?? propertyData.bathrooms ?? 1)
      const maxGuests = Number(propertyData.max_guests ?? propertyData.maxGuests ?? 2)

      const insertRow = {
        host_id: user.id,
        name: propertyData.name,
        description: propertyData.description || null,
        property_type: normalizePropertyType(propertyData.type || propertyData.property_type),
        location: propertyData.location,
        price_per_night: Number.isFinite(pricePerNight) ? pricePerNight : null,
        bedrooms: Number.isFinite(bedrooms) ? bedrooms : 1,
        bathrooms: Number.isFinite(bathrooms) ? bathrooms : 1,
        max_guests: Number.isFinite(maxGuests) ? maxGuests : 2,
        amenities: propertyData.amenities || [],
        images: propertyData.images || (propertyData.image ? [propertyData.image] : []),
        main_image: propertyData.image || propertyData.main_image || null,
        vr_tour_enabled: propertyData.vr_tour_enabled || false,
        vr_tour_url: propertyData.vr_tour_url || null,
        vr_tour_type: propertyData.vr_tour_type || null,
        latitude: propertyData.latitude || null,
        longitude: propertyData.longitude || null,
        available: true
      }

      // Insert directly with shorter timeout (15s instead of 30s)
      const insertPromise = supabase
        .from('properties')
        .insert([insertRow])
        .select('id, name')
        .single()

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout - please try again')), 15000)
      )

      const { data, error } = await Promise.race([insertPromise, timeoutPromise])

      if (error) {
        // Provide user-friendly error messages
        let errorMessage = error.message || 'Failed to create property'
        if (error.code === '23505') {
          errorMessage = 'A property with this name already exists'
        } else if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('denied') || error.message?.includes('RLS')) {
          errorMessage = 'Permission denied. Contact admin to get host access.'
        } else if (error.message?.includes('null value')) {
          errorMessage = 'Please fill in all required fields'
        }
        throw new Error(errorMessage)
      }

      if (!data) {
        throw new Error('Property creation failed. Please try again.')
      }

      // Clear cache asynchronously (don't wait)
      clearAccommodationCache()
      return { data: { id: data.id, name: data.name } }
    }
  },

  tours: {
    getAll: async (params = {}) => {
      const limit = params?.limit
      let query = supabase
        .from('tours')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false })

      if (limit) query = query.limit(limit)

      const { data, error } = await query
      if (error) throw error

      // Return shape consistent with existing pages that use tours.
      return {
        data: (data || []).map(t => ({
          id: t.id,
          title: t.name,
          destination: t.destination,
          days: t.duration_days,
          price: t.price,
          rating: t.rating || 0,
          reviews: t.reviews_count || 0,
          image: t.main_image
        }))
      }
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data }
    },

    search: async (query) => {
      const term = String(query || '').trim()
      let q = supabase
        .from('tours')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false })

      if (term) {
        // Use separate filter conditions to avoid comma parsing issues in search terms
        // Replace commas with spaces for the OR query
        const safeTerm = term.replace(/,/g, ' ')
        q = q.or(`name.ilike.%${safeTerm}%,destination.ilike.%${safeTerm}%`)
      }

      const { data, error } = await q
      if (error) throw error
      return { data }
    },

    create: async (tourData) => {
      const { data: auth } = await supabase.auth.getUser()
      const user = auth?.user
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Parse duration from string like "3 Days 2 Nights" to extract number of days
      const parseDurationDays = (duration) => {
        if (!duration) return null
        if (typeof duration === 'number') return duration
        if (typeof duration === 'string') {
          // Try to extract number from strings like "3 Days 2 Nights" or "3 Days"
          const match = duration.match(/(\d+)\s*(?:day|days)/i)
          if (match) return parseInt(match[1])
          // Try to parse as number
          const num = parseInt(duration)
          if (!isNaN(num)) return num
        }
        return null
      }

      // Map form data to database columns (only include valid columns)
      const imageArray = Array.isArray(tourData.images) 
        ? tourData.images.filter(Boolean)
        : (tourData.image ? [tourData.image] : (tourData.main_image ? [tourData.main_image] : []))
      const mainImg = tourData.main_image || tourData.image || (imageArray.length > 0 ? imageArray[0] : null)
      
      // Calculate duration_days from separate days and hours inputs
      const durationDays = tourData.duration_days !== undefined && tourData.duration_days !== null 
        ? Number(tourData.duration_days) 
        : (parseDurationDays(tourData.duration) || 0)
      const durationHours = tourData.duration_hours !== undefined && tourData.duration_hours !== null
        ? Number(tourData.duration_hours)
        : 0
      
      const insertData = {
        name: tourData.name || tourData.title || '',
        destination: tourData.destination || tourData.location || '',
        description: tourData.description || null,
        duration_days: durationDays,
        duration_hours: durationHours,
        price: Number.isFinite(tourData.price) ? Number(tourData.price) : null,
        category: tourData.category || null,
        main_image: mainImg,
        images: imageArray.length > 0 ? imageArray : null,
        available: tourData.available !== undefined ? tourData.available : true
      }
      
      // Remove null/undefined/empty values to avoid schema errors, but keep images as JSONB array
      Object.keys(insertData).forEach(key => {
        if (key === 'images') {
          // Keep images field - set to empty array if null (JSONB accepts empty array)
          if (insertData[key] === null || (Array.isArray(insertData[key]) && insertData[key].length === 0)) {
            insertData[key] = []
          }
        } else if (insertData[key] === null || insertData[key] === undefined || insertData[key] === '') {
          delete insertData[key]
        }
      })
      
      // Insert with 15s timeout
      const insertPromise = supabase
        .from('tours')
        .insert([insertData])
        .select('id, name')
        .single()

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout - please try again')), 15000)
      )

      const { data, error } = await Promise.race([insertPromise, timeoutPromise])

      if (error) {
        let errorMessage = error.message || 'Failed to create tour'
        if (error.code === '23505') {
          errorMessage = 'A tour with this name already exists'
        } else if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('RLS')) {
          errorMessage = 'Permission denied. Contact admin for access.'
        }
        throw new Error(errorMessage)
      }
      
      if (!data) {
        throw new Error('Tour creation failed. Please try again.')
      }
      
      return { data }
    },

    book: async (tourId, data) => {
      // Booking tours not implemented in DB adapter yet.
      return { data: { tourId, ...data } }
    }
  },

  transport: {
    getRoutes: async (params = {}) => {
      const limit = params?.limit

      // Some environments store transport routes separately; fall back gracefully.
      let query = supabase
        .from('transport_routes')
        .select('*')
        .order('created_at', { ascending: false })

      if (limit) query = query.limit(limit)

      const { data, error } = await query
      if (error) {
        // If the table doesn't exist, return an empty list.
        if (error.code === '42P01') return { data: [] }
        throw error
      }

      return { data: data || [] }
    },

    getVehicles: async (params = {}) => {
      const limit = params?.limit
      let query = supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })

      if (limit) query = query.limit(limit)

      const { data, error } = await query
      if (error) {
        if (error.code === '42P01') return { data: [] }
        throw error
      }

      return { data: data || [] }
    },

    create: async (transportData) => {
      console.log('🔍 [Transport Create] Starting transport creation...')
      console.log('📝 [Transport Create] Transport data:', JSON.stringify(transportData, null, 2))
      
      const { data: auth } = await supabase.auth.getUser()
      const user = auth?.user
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Map form data to database columns
      const imageArray = Array.isArray(transportData.images) 
        ? transportData.images.filter(Boolean)
        : (transportData.image ? [transportData.image] : [])
      const mainImg = transportData.main_image || transportData.image || (imageArray.length > 0 ? imageArray[0] : null)
      
      const insertData = {
        name: transportData.name || '',
        type: transportData.vehicle_type || transportData.type || null,
        description: transportData.description || null,
        capacity: Number.isFinite(transportData.capacity) ? Number(transportData.capacity) : null,
        price_per_day: Number.isFinite(transportData.price) ? Number(transportData.price) : null,
        license_plate: transportData.license_plate || null,
        driver_included: transportData.professional_driver || transportData.driver_included || false,
        duration_days: transportData.duration_days ? Number(transportData.duration_days) : 0,
        duration_hours: transportData.duration_hours ? Number(transportData.duration_hours) : 0,
        luggage_bags: transportData.luggage_bags ? Number(transportData.luggage_bags) : null,
        main_image: mainImg,
        images: imageArray.length > 0 ? imageArray : [],
        available: transportData.available !== undefined ? transportData.available : true
      }
      
      // Remove null/undefined values
      Object.keys(insertData).forEach(key => {
        if (key !== 'images' && (insertData[key] === null || insertData[key] === undefined || insertData[key] === '')) {
          delete insertData[key]
        }
      })

      // Insert with 15s timeout
      const insertPromise = supabase
        .from('vehicles')
        .insert([insertData])
        .select('id, name')
        .single()

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout - please try again')), 15000)
      )

      const { data, error } = await Promise.race([insertPromise, timeoutPromise])

      if (error) {
        let errorMessage = error.message || 'Failed to create transport service'
        if (error.code === '23505') {
          errorMessage = 'A transport service with this name already exists'
        } else if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('RLS')) {
          errorMessage = 'Permission denied. Contact admin for access.'
        }
        throw new Error(errorMessage)
      }
      
      if (!data) {
        throw new Error('Transport creation failed. Please try again.')
      }
      
      return { data }
    },

    book: async (data) => {
      return { data }
    }
  },

  stories: {
    getAll: async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === '42P01') return []
        throw error
      }

      return (data || []).map(s => ({
        ...s,
        date: s.created_at ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
      }))
    },

    create: async (storyData) => {
      const { data, error } = await supabase
        .from('stories')
        .insert([storyData])
        .select('*')
        .single()

      if (error) throw error
      return data
    },

    delete: async (storyId, opts = {}) => {
      const { userId, isAdmin } = opts || {}

      let q = supabase
        .from('stories')
        .delete()
        .eq('id', storyId)

      if (!isAdmin && userId) {
        q = q.eq('user_id', userId)
      }

      const { error } = await q
      if (error) throw error
      return { ok: true }
    }
  }
}

export default supabaseApiAdapter
