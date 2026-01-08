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
          query = query.or(`name.ilike.%${term}%,location.ilike.%${term}%,city.ilike.%${term}%`)
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
              query = query.or(`name.ilike.%${term}%,location.ilike.%${term}%,city.ilike.%${term}%`)
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
      return { data: mapPropertyRowToAccommodation(data) }
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
      console.log('🔍 [Property Create] Starting property creation...')
      console.log('📝 [Property Create] Property data:', JSON.stringify(propertyData, null, 2))
      
      const { data: auth } = await supabase.auth.getUser()
      const user = auth?.user
      if (!user) {
        console.error('❌ [Property Create] User not authenticated')
        throw new Error('Not authenticated')
      }
      console.log('✅ [Property Create] User authenticated:', user.email)

      const insertRow = {
        host_id: user.id,
        name: propertyData.name,
        description: propertyData.description || null,
        property_type: normalizePropertyType(propertyData.type || propertyData.property_type),
        location: propertyData.location,
        price_per_night: propertyData.price,
        bedrooms: propertyData.beds ?? propertyData.bedrooms ?? 1,
        bathrooms: propertyData.baths ?? propertyData.bathrooms ?? 1,
        max_guests: propertyData.max_guests ?? propertyData.maxGuests ?? 2,
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
      
      console.log('📤 [Property Create] Inserting into database:', JSON.stringify(insertRow, null, 2))

      const { data, error } = await supabase
        .from('properties')
        .insert([insertRow])
        .select('*')
        .single()

      if (error) {
        console.error('❌ [Property Create] Database error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      console.log('✅ [Property Create] Property created successfully!', data.id)
      // New listings should appear immediately on public pages.
      clearAccommodationCache()
      return { data: mapPropertyRowToAccommodation(data) }
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
        q = q.or(`name.ilike.%${term}%,destination.ilike.%${term}%`)
      }

      const { data, error } = await q
      if (error) throw error
      return { data }
    },

    create: async (tourData) => {
      console.log('🔍 [Tours Create] Starting tour creation...')
      console.log('📝 [Tours Create] Tour data:', JSON.stringify(tourData, null, 2))
      
      const { data: auth } = await supabase.auth.getUser()
      const user = auth?.user
      if (!user) {
        console.error('❌ [Tours Create] User not authenticated')
        throw new Error('Not authenticated')
      }
      console.log('✅ [Tours Create] User authenticated:', user.email)

      // Prepare tour data with user_id
      const insertData = {
        ...tourData,
        user_id: user.id,
        created_at: new Date().toISOString()
      }
      console.log('📤 [Tours Create] Inserting into database:', JSON.stringify(insertData, null, 2))

      const { data, error } = await supabase
        .from('tours')
        .insert([insertData])
        .select('*')
        .single()

      if (error) {
        console.error('❌ [Tours Create] Database error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      
      console.log('✅ [Tours Create] Tour created successfully!', data.id)
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
        console.error('❌ [Transport Create] User not authenticated')
        throw new Error('Not authenticated')
      }
      console.log('✅ [Transport Create] User authenticated:', user.email)

      // Prepare transport data with user_id
      const insertData = {
        ...transportData,
        user_id: user.id,
        created_at: new Date().toISOString()
      }
      console.log('📤 [Transport Create] Inserting into database:', JSON.stringify(insertData, null, 2))

      const { data, error } = await supabase
        .from('vehicles')
        .insert([insertData])
        .select('*')
        .single()

      if (error) {
        console.error('❌ [Transport Create] Database error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      
      console.log('✅ [Transport Create] Transport created successfully!', data.id)
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
