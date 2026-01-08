/**
 * Aggressive data pre-loading
 * Fetches critical data immediately on app boot for instant page loads
 * Now using ultra-fast fetching with in-memory caching
 */

import fastFetch from './fastFetch'

let preloadPromise = null
let isPreloaded = false

export const preloadCriticalData = () => {
  if (preloadPromise) return preloadPromise

  preloadPromise = (async () => {
    try {
      // Pre-fetch properties with aggressive caching for instant load
      await Promise.allSettled([
        fastFetch.fetchAccommodations({ limit: 8, minimal: true }),
        fastFetch.fetchAccommodations({ limit: 20, minimal: false }),
        fastFetch.fetchAccommodations({ limit: 12, minimal: true })
      ])
      
      isPreloaded = true
    } catch (error) {
      // Silently handle preload failures - will fetch on demand
      isPreloaded = true
    }
  })()

  return preloadPromise
}

export const isDataPreloaded = () => isPreloaded

export const waitForPreload = () => preloadPromise || Promise.resolve()
