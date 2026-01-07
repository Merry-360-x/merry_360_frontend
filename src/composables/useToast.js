import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

function normalizeToastMessage(rawMessage, type) {
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

  // For error toasts, avoid showing technical error details
  if (type === 'error') {
    const looksTechnical = /(unknown api|\bapi\b|endpoint|supabase|database|\bsql\b|stack|trace)/i.test(text)
    if (looksTechnical || /unknown error/i.test(text)) {
      return 'An error occurred. Please try again.'
    }

    // Strip appended details like "Failed to load X: <internal message>"
    if (text.includes(':')) {
      const head = text.split(':')[0].trim()
      if (/^(failed|error)/i.test(head)) text = head
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
