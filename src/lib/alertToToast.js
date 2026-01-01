import { useToast } from '../composables/useToast'

function guessToastType(message) {
  const text = String(message || '').toLowerCase()

  // error-ish
  if (
    text.includes('fail') ||
    text.includes('error') ||
    text.includes('denied') ||
    text.includes('incorrect') ||
    text.includes('not allowed') ||
    text.includes('forbidden')
  ) {
    return 'error'
  }

  // success-ish
  if (
    text.includes('success') ||
    text.includes('submitted') ||
    text.includes('saved') ||
    text.includes('updated') ||
    text.includes('created') ||
    text.includes('approved')
  ) {
    return 'success'
  }

  // warning-ish
  if (text.includes('please') || text.includes('login') || text.includes('required')) {
    return 'warning'
  }

  return 'info'
}

export function initAlertToToast() {
  if (typeof window === 'undefined') return

  // Prevent double-init
  if (window.__MERRY360_ALERT_TO_TOAST__) return
  window.__MERRY360_ALERT_TO_TOAST__ = true

  const nativeAlert = window.alert?.bind(window)
  const { showToast } = useToast()

  window.alert = (message) => {
    try {
      const type = guessToastType(message)
      showToast(String(message ?? ''), type, 3500)
    } catch (err) {
      // Fallback to native alert if something goes wrong
      if (nativeAlert) nativeAlert(String(message ?? ''))
    }
  }
}
