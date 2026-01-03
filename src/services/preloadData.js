/**
 * Aggressive data pre-loading
 * Fetches critical data immediately on app boot for instant page loads
 */

import { supabaseApiAdapter } from './supabaseApiAdapter'
import { getCachedAccommodations } from './accommodationCache'

let preloadPromise = null
let isPreloaded = false

export const preloadCriticalData = () => {
  if (preloadPromise) return preloadPromise

  // Check if we already have cached data - if so, we're already "preloaded"
  const cached = getCachedAccommodations({ limit: 8 })
  if (cached?.data?.length) {
    isPreloaded = true
    console.log('✅ Data already cached, instant load ready')
    return Promise.resolve()
  }

  preloadPromise = (async () => {
    try {
      console.log('🚀 Preloading critical data...')
      const start = performance.now()
      
      // Pre-fetch properties for instant homepage/accommodations load
      await Promise.all([
        supabaseApiAdapter.accommodations.getAll({ limit: 8 }),
        supabaseApiAdapter.tours?.getAll?.({ limit: 8 }).catch(() => {}),
      ])
      
      const end = performance.now()
      isPreloaded = true
      console.log(`✅ Critical data preloaded in ${Math.round(end - start)}ms`)
    } catch (error) {
      console.warn('⚠️ Preload failed, will fetch on demand:', error)
    }
  })()

  return preloadPromise
}

export const isDataPreloaded = () => isPreloaded

export const waitForPreload = () => preloadPromise || Promise.resolve()
