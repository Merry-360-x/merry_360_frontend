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
      console.log('🚀 Preloading critical data with ultra-fast fetch...')
      const start = performance.now()
      
      // Pre-fetch properties with aggressive caching for instant load
      await Promise.allSettled([
        fastFetch.fetchAccommodations({ limit: 8, minimal: true }),
        fastFetch.fetchAccommodations({ limit: 20, minimal: false }),
        fastFetch.fetchAccommodations({ limit: 12, minimal: true })
      ])
      
      const end = performance.now()
      isPreloaded = true
      console.log(`✅ Critical data preloaded in ${Math.round(end - start)}ms`)
    } catch (error) {
      console.warn('⚠️ Preload failed, will fetch on demand:', error)
      isPreloaded = true
    }
  })()

  return preloadPromise
}

export const isDataPreloaded = () => isPreloaded

export const waitForPreload = () => preloadPromise || Promise.resolve()
