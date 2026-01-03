/**
 * Aggressive data pre-loading
 * Fetches critical data immediately on app boot for instant page loads
 */

import { supabaseApiAdapter } from './supabaseApiAdapter'

let preloadPromise = null
let isPreloaded = false

export const preloadCriticalData = () => {
  if (preloadPromise) return preloadPromise

  preloadPromise = (async () => {
    try {
      // Pre-fetch properties for instant homepage/accommodations load
      await Promise.all([
        supabaseApiAdapter.accommodations.getAll({ limit: 16 }),
        supabaseApiAdapter.tours?.getAll?.({ limit: 8 }).catch(() => {}),
      ])
      isPreloaded = true
      console.log('✅ Critical data preloaded')
    } catch (error) {
      console.warn('⚠️ Preload failed, will fetch on demand:', error)
    }
  })()

  return preloadPromise
}

export const isDataPreloaded = () => isPreloaded
