const PREFIX = 'merry360:accommodations:getAll:'
const DEFAULT_TTL_MS = 30 * 60 * 1000 // 30 minutes

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
    window.localStorage.setItem(
      key,
      JSON.stringify({ ts: Date.now(), data: Array.isArray(data) ? data : [] })
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
