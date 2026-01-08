import { onMounted, onBeforeUnmount } from 'vue'

/**
 * Composable to handle page visibility changes
 * Fixes issues with buttons becoming unclickable after tab switching
 */
export function usePageVisibility() {
  let visibilityHandler = null
  let focusHandler = null
  let blurHandler = null

  const restoreUIState = () => {
    // When page becomes visible again, ensure body scroll is restored
    // This fixes issues where body scroll lock wasn't released
    const body = document.body
    const html = document.documentElement
    
    // Check for open modals/dialogs
    const hasOpenModal = document.querySelector('.modal-open, .dialog-open, [data-modal-open="true"], [role="dialog"][aria-hidden="false"]')
    
    // Remove any lingering overflow locks if no modal is open
    if (!hasOpenModal && body.style.overflow === 'hidden') {
      body.style.overflow = ''
      html.style.overflow = ''
    }
    
    // Remove any pointer-events: none that might block clicks
    const blockedElements = document.querySelectorAll('[style*="pointer-events: none"]')
    blockedElements.forEach(el => {
      const style = el.getAttribute('style') || ''
      if (style.includes('pointer-events: none') && !el.classList.contains('disabled')) {
        el.style.pointerEvents = ''
      }
    })
    
    // Force a reflow to ensure DOM updates and buttons are clickable
    void body.offsetHeight
    
    // Dispatch a custom event to notify components
    window.dispatchEvent(new CustomEvent('pagevisible'))
  }

  onMounted(() => {
    // Handle visibility change (tab switching, window focus/blur)
    visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        restoreUIState()
      } else {
        // When page becomes hidden, dispatch event
        window.dispatchEvent(new CustomEvent('pagehidden'))
      }
    }
    
    document.addEventListener('visibilitychange', visibilityHandler)
    
    // Also handle window focus/blur for better compatibility
    focusHandler = () => {
      // When window regains focus, ensure UI is responsive
      restoreUIState()
      window.dispatchEvent(new CustomEvent('windowfocused'))
    }
    
    blurHandler = () => {
      window.dispatchEvent(new CustomEvent('windowblurred'))
    }
    
    window.addEventListener('focus', focusHandler)
    window.addEventListener('blur', blurHandler)
  })

  onBeforeUnmount(() => {
    if (visibilityHandler) {
      document.removeEventListener('visibilitychange', visibilityHandler)
    }
    if (focusHandler) {
      window.removeEventListener('focus', focusHandler)
    }
    if (blurHandler) {
      window.removeEventListener('blur', blurHandler)
    }
  })
}
