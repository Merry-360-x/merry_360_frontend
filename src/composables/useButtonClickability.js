import { onMounted, onBeforeUnmount } from 'vue'

/**
 * Composable to ensure buttons are always clickable
 * Fixes z-index and pointer-events issues that can make buttons unresponsive
 */
export function useButtonClickability() {
  let intervalId = null

  const ensureButtonsClickable = () => {
    // Find all buttons that might be blocked
    const buttons = document.querySelectorAll('button, [role="button"], a[href], .cursor-pointer')
    
    buttons.forEach(button => {
      // Ensure buttons have proper pointer-events
      if (button.style.pointerEvents === 'none' && !button.disabled && !button.classList.contains('disabled')) {
        button.style.pointerEvents = 'auto'
      }
      
      // Ensure buttons have proper z-index if they're interactive
      const computedStyle = window.getComputedStyle(button)
      if (computedStyle.pointerEvents === 'none' && !button.disabled) {
        button.style.pointerEvents = 'auto'
        button.style.zIndex = '1'
      }
      
      // Remove any overlay that might be blocking clicks
      const rect = button.getBoundingClientRect()
      const elementAtPoint = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      )
      
      if (elementAtPoint && elementAtPoint !== button && !button.contains(elementAtPoint)) {
        // Check if there's an invisible overlay
        const overlay = elementAtPoint.closest('.overlay, .backdrop, [data-overlay]')
        if (overlay && overlay.style.pointerEvents !== 'none') {
          // Don't block if it's a modal overlay
          if (!overlay.closest('[role="dialog"], .modal, .dialog')) {
            overlay.style.pointerEvents = 'none'
          }
        }
      }
    })
  }

  let handleVisibilityChange = null
  let handleFocus = null

  onMounted(() => {
    // Run immediately
    ensureButtonsClickable()
    
    // Run periodically to catch any dynamic changes
    intervalId = setInterval(ensureButtonsClickable, 1000)
    
    // Also run on visibility change
    handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(ensureButtonsClickable, 100)
      }
    }
    
    handleFocus = () => {
      ensureButtonsClickable()
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
  })

  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
    if (handleVisibilityChange) {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    if (handleFocus) {
      window.removeEventListener('focus', handleFocus)
    }
  })
}
