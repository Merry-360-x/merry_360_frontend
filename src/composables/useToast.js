import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

function toUserFacingErrorMessage(raw) {
  // Accept Error objects, Supabase/PostgREST errors, strings, etc.
  const err = raw && typeof raw === 'object' ? raw : null
  const message = err
    ? String(err.message ?? '').trim()
    : String(raw ?? '').trim()

  const code = err && err.code != null ? String(err.code) : ''
  const details = err && err.details != null ? String(err.details) : ''
  const hint = err && err.hint != null ? String(err.hint) : ''

  const hay = `${message} ${details} ${hint}`.toLowerCase()

  if (!message && !details && !hint) {
    return 'An error occurred. Please try again.'
  }

  // Local stub (missing env) and other config issues
  if (hay.includes('supabase is not configured') || hay.includes('missing vite_supabase_url') || hay.includes('missing vite_supabase_anon_key')) {
    return "This app can't reach the database right now (Supabase config is missing)."
  }

  // Auth
  if (hay.includes('not authenticated') || hay.includes('jwt') && hay.includes('expired') || hay.includes('invalid login')) {
    return 'Please log in and try again.'
  }

  // RLS / permissions
  if (
    hay.includes('row-level security') ||
    hay.includes('permission denied') ||
    hay.includes('not allowed') ||
    code === '42501'
  ) {
    return "You don't have permission to do that. If you're logged in, your account may not have access."
  }

  // Missing table / column (schema mismatch)
  if (code === '42P01' || hay.includes('relation') && hay.includes('does not exist')) {
    return "This feature isn't available yet (missing database table)."
  }
  if (code === '42703' || hay.includes('column') && hay.includes('does not exist')) {
    return "The app and database are out of sync (a required field is missing)."
  }

  // Network
  if (hay.includes('failed to fetch') || hay.includes('networkerror') || hay.includes('network error')) {
    return 'Network error. Check your connection and try again.'
  }
  if (hay.includes('timeout') || hay.includes('timed out')) {
    return 'Request timed out. Please try again.'
  }

  // Default: keep the message but strip overly technical prefixes
  let text = message || details || hint
  text = text.replace(/^error\s*:?\s*/i, '').trim()
  text = text.replace(/^failed\s*to\s*/i, 'Failed to ').trim()
  return text || 'An error occurred. Please try again.'
}

function normalizeToastMessage(rawMessage, type) {
  // If we were given an Error/Supabase error object, normalize it cleanly.
  if (type === 'error' && rawMessage && typeof rawMessage === 'object') {
    return toUserFacingErrorMessage(rawMessage)
  }

  let text = String(rawMessage ?? '').replace(/\s+/g, ' ').trim()

  // Remove leading status emojis/icons that read as "developer-ish"
  text = text.replace(/^[✅❌⚠️ℹ️🟢🔴🔄]+\s*/u, '').trim()

  // Remove backend/implementation wording that users don't care about
  text = text
    .replace(/\bchanges saved to database\b\.?/gi, '')
    .replace(/\bsaved to database\b\!?\.?/gi, '')
    .replace(/\bfound in database\b/gi, 'found')
    .replace(/\bin the database\b\.?/gi, '')
    .replace(/\bin database\b\.?/gi, '')
    .trim()

  // For error toasts, explain technical details instead of hiding them.
  if (type === 'error') {
    const looksTechnical = /(unknown api|\bapi\b|endpoint|supabase|database|\bsql\b|stack|trace)/i.test(text)
    if (looksTechnical || /unknown error/i.test(text)) {
      return toUserFacingErrorMessage(text)
    }
  }

  // A couple of common verbose warning patterns
  text = text.replace(/\.\s*please add .* in the database\.?/i, '.')

  text = text.replace(/\s+/g, ' ').trim()

  if (!text) {
    return type === 'error' ? 'An error occurred. Please try again.' : 'Done.'
  }

  // Ensure truncated "Failed to ..." reads cleanly
  if (type === 'error' && /^failed to\b/i.test(text) && !/[.!?]$/.test(text)) {
    text = `${text}.`
  }

  return text
}

export function useToast() {
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = toastId++
    const normalizedMessage = normalizeToastMessage(message, type)
    const toast = {
      id,
      message: normalizedMessage,
      type,
      duration,
      visible: true
    }
    
    toasts.value.push(toast)
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (message, duration) => {
    return addToast(message, 'success', duration)
  }
  
  const error = (message, duration) => {
    return addToast(message, 'error', duration)
  }
  
  const warning = (message, duration) => {
    return addToast(message, 'warning', duration)
  }
  
  const info = (message, duration) => {
    return addToast(message, 'info', duration)
  }

  // Backwards-compatible API used across the app
  // showToast(message, type?, duration?)
  const showToast = (message, type = 'success', duration = 3000) => {
    return addToast(message, type, duration)
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    showToast
  }
}
