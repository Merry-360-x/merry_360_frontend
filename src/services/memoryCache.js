/**
 * In-Memory Cache - Ultra-fast data access (nanoseconds vs localStorage milliseconds)
 * Data persists for entire browser session
 */

const memoryCache = new Map()
let sessionId = Date.now() // Unique per page load

// Track what we've already fetched this session
const fetchedThisSession = new Set()

export const getFromMemory = (key) => {
  return memoryCache.get(key)
}

export const setInMemory = (key, value) => {
  memoryCache.set(key, {
    data: value,
    timestamp: Date.now(),
    sessionId
  })
}

export const hasInMemory = (key) => {
  return memoryCache.has(key)
}

export const clearMemory = () => {
  memoryCache.clear()
  fetchedThisSession.clear()
}

// Track if we already fetched this data in current session
export const markAsFetched = (key) => {
  fetchedThisSession.add(key)
}

export const wasFetchedThisSession = (key) => {
  return fetchedThisSession.has(key)
}

// Get all cached keys
export const getMemoryCacheKeys = () => {
  return Array.from(memoryCache.keys())
}

// Get cache stats
export const getMemoryCacheStats = () => {
  return {
    size: memoryCache.size,
    sessionId,
    keys: Array.from(memoryCache.keys()),
    fetchedKeys: Array.from(fetchedThisSession)
  }
}
