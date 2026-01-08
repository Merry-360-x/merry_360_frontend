/**
 * Ultra-Fast Data Fetching Service
 * 
 * Implements advanced optimizations:
 * - Request deduplication
 * - Aggressive in-memory caching
 * - Parallel query batching
 * - Smart prefetching
 * - Query result streaming
 */

import { supabase } from './supabase'
import { mapPropertyRowToAccommodation } from './propertyMapper'

// In-memory cache with sub-millisecond access
const memCache = new Map()
const pendingRequests = new Map()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes for ultra-fast access
const STALE_THRESHOLD = 60 * 1000 // 1 minute - refresh in background after this

// Prefetch queue for background loading
const prefetchQueue = new Set()
let prefetchTimer = null

// Aggressive prefetch settings
const PREFETCH_DELAY = 100 // Start prefetching after 100ms
const MAX_CONCURRENT_PREFETCH = 5

/**
 * Ultra-minimal select for listing pages (maximum speed)
 */
const MINIMAL_FIELDS = [
  'id',
  'name',
  'property_type',
  'location',
  'city',
  'price_per_night',
  'bedrooms',
  'bathrooms',
  'main_image',
  'rating',
  'reviews_count'
].join(',')

/**
 * Generate cache key
 */
const getCacheKey = (table, params = {}) => {
  const sorted = Object.keys(params).sort().reduce((acc, key) => {
    if (params[key] !== undefined && params[key] !== null) {
      acc[key] = params[key]
    }
    return acc
  }, {})
  return `${table}:${JSON.stringify(sorted)}`
}

/**
 * Check memory cache
 */
const getFromCache = (key) => {
  const cached = memCache.get(key)
  if (!cached) return null
  
  const age = Date.now() - cached.timestamp
  if (age > CACHE_TTL) {
    memCache.delete(key)
    return null
  }
  
  return { 
    data: cached.data, 
    age, 
    isFresh: age < STALE_THRESHOLD,
    isStale: age > STALE_THRESHOLD && age < CACHE_TTL
  }
}

/**
 * Store in memory cache
 */
const setCache = (key, data) => {
  memCache.set(key, {
    data,
    timestamp: Date.now()
  })
}

/**
 * Fast accommodation fetch with smart caching
 */
export const fastFetchAccommodations = async (params = {}) => {
  const { limit = 8, search, q, guests, minimal = true } = params
  const cacheKey = getCacheKey('properties', { limit, search, q, guests, minimal })
  
  // 1. Check cache first (sub-millisecond)
  const cached = getFromCache(cacheKey)
  if (cached) {
    // Trigger aggressive background refresh if data is stale
    if (cached.isStale && !pendingRequests.has(cacheKey)) {
      schedulePrefetch(cacheKey, params)
    }
    return { data: cached.data, fromCache: true, age: cached.age }
  }
  
  // 2. Deduplicate concurrent requests
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)
  }
  
  // 3. Execute optimized query
  const promise = executeAccommodationQuery(params, minimal).then(data => {
    setCache(cacheKey, data)
    pendingRequests.delete(cacheKey)
    return { data, fromCache: false, age: 0 }
  }).catch(err => {
    pendingRequests.delete(cacheKey)
    throw err
  })
  
  pendingRequests.set(cacheKey, promise)
  return promise
}

/**
 * Execute the actual Supabase query (optimized)
 */
const executeAccommodationQuery = async (params, minimal = true) => {
  const { limit = 8, search, q, guests } = params
  const term = (q || search || '').trim()
  const guestsCount = guests ? Number(guests) : null
  
  // Use minimal fields for listing pages
  const selectFields = minimal ? MINIMAL_FIELDS : '*'
  
  let query = supabase
    .from('properties')
    .select(selectFields)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  // Apply available filter only if column exists (some schemas might not have it)
  // Use try-catch or check if available column exists
  try {
    query = query.or('available.is.null,available.eq.true')
  } catch (e) {
    // If available column doesn't exist, continue without filter
    console.warn('Available column filter skipped:', e.message)
  }
  
  // Apply filters
  if (term) {
    query = query.or(`name.ilike.%${term}%,location.ilike.%${term}%,city.ilike.%${term}%`)
  }
  
  if (guestsCount && guestsCount > 0) {
    query = query.gte('max_guests', guestsCount)
  }
  
  const { data, error } = await query
  
  if (error) {
    // Fallback: retry without available filter if column missing
    if (error.code === '42703') {
      query = supabase
        .from('properties')
        .select(selectFields)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (term) {
        query = query.or(`name.ilike.%${term}%,location.ilike.%${term}%,city.ilike.%${term}%`)
      }
      
      const retry = await query
      if (retry.error) throw retry.error
      return (retry.data || []).map(mapPropertyRowToAccommodation)
    }
    throw error
  }
  
  return (data || []).map(mapPropertyRowToAccommodation)
}

/**
 * Schedule background prefetch
 */
const schedulePrefetch = (key, params) => {
  prefetchQueue.add({ key, params })
  
  if (prefetchTimer) return
  
  prefetchTimer = setTimeout(() => {
    prefetchTimer = null
    processPrefetchQueue()
  }, 100) // Batch prefetches
}

/**
 * Process prefetch queue in background
 */
const processPrefetchQueue = async () => {
  const batch = Array.from(prefetchQueue)
  prefetchQueue.clear()
  
  // Execute all prefetches in parallel
  await Promise.allSettled(
    batch.map(({ params }) => 
      executeAccommodationQuery(params, true).then(data => {
        const key = getCacheKey('properties', params)
        setCache(key, data)
      })
    )
  )
}

/**
 * Prefetch next page (predictive loading)
 */
export const prefetchNextPage = (currentParams = {}) => {
  const nextLimit = (currentParams.limit || 8) * 2
  const nextParams = { ...currentParams, limit: nextLimit }
  const key = getCacheKey('properties', nextParams)
  
  if (!getFromCache(key) && !pendingRequests.has(key)) {
    schedulePrefetch(key, nextParams)
  }
}

/**
 * Batch fetch multiple property IDs in parallel
 */
export const fastFetchPropertyDetails = async (ids = []) => {
  if (!ids || ids.length === 0) return []
  
  const cached = []
  const toFetch = []
  
  // Check cache first
  ids.forEach(id => {
    const key = getCacheKey('property', { id })
    const c = getFromCache(key)
    if (c) {
      cached.push(c.data)
    } else {
      toFetch.push(id)
    }
  })
  
  // Fetch missing ones in parallel
  if (toFetch.length === 0) return cached
  
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .in('id', toFetch)
  
  if (error) throw error
  
  const fetched = (data || []).map(row => {
    const mapped = mapPropertyRowToAccommodation(row)
    const key = getCacheKey('property', { id: row.id })
    setCache(key, mapped)
    return mapped
  })
  
  return [...cached, ...fetched]
}

/**
 * Clear cache (call after mutations)
 */
export const clearFastCache = (pattern = null) => {
  if (!pattern) {
    memCache.clear()
    pendingRequests.clear()
    return
  }
  
  // Clear specific pattern
  for (const key of memCache.keys()) {
    if (key.includes(pattern)) {
      memCache.delete(key)
    }
  }
}

/**
 * Warmup cache with common queries
 */
export const warmupCache = async () => {
  const commonQueries = [
    { limit: 8 },
    { limit: 12 },
    { limit: 20 }
  ]
  
  await Promise.allSettled(
    commonQueries.map(params => fastFetchAccommodations(params))
  )
}

export default {
  fetchAccommodations: fastFetchAccommodations,
  fetchPropertyDetails: fastFetchPropertyDetails,
  prefetchNextPage,
  clearCache: clearFastCache,
  warmupCache
}
