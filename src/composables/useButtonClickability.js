import { onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * Composable to ensure buttons are always clickable
 * Fixes z-index and pointer-events issues that can make buttons unresponsive
 * Also handles tab switching issues with Vue reactivity
 */
export function useButtonClickability() {
  let intervalId = null

  const ensureButtonsClickable = () => {
    // Find all buttons that might be blocked
    const buttons = document.querySelectorAll('button, [role="button"], a[href], .cursor-pointer, input[type="submit"]')
    
    buttons.forEach(button => {
      // Skip disabled buttons
      if (button.disabled || button.classList.contains('disabled')) return
      
      // Ensure buttons have proper pointer-events
      const computedStyle = window.getComputedStyle(button)
      if (computedStyle.pointerEvents === 'none') {
        button.style.pointerEvents = 'auto'
      }
      
      // Ensure proper z-index for interactive elements
      if (computedStyle.position === 'static') {
        button.style.position = 'relative'
      }
      
      // Remove any overlay that might be blocking clicks
      const rect = button.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return // Skip invisible buttons
      
      const elementAtPoint = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      )
      
      if (elementAtPoint && elementAtPoint !== button && !button.contains(elementAtPoint)) {
        // Check if there's an invisible overlay blocking the button
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

  // Force Vue to re-render components after tab switch
  const forceReactivityRefresh = async () => {
    // Force a DOM reflow
    void document.body.offsetHeight
    
    // Wait for Vue's next tick
    await nextTick()
    
    // Trigger a global resize event which many components listen for
    window.dispatchEvent(new Event('resize'))
    
    // Run button fix after Vue has updated
    setTimeout(ensureButtonsClickable, 50)
    setTimeout(ensureButtonsClickable, 200)
    setTimeout(ensureButtonsClickable, 500)
  }

  let handleVisibilityChange = null
  let handleFocus = null
  let handlePageShow = null

  onMounted(() => {
    // Run immediately
    ensureButtonsClickable()
    
    // Run periodically to catch any dynamic changes (every 500ms for better responsiveness)
    intervalId = setInterval(ensureButtonsClickable, 500)
    
    // Handle visibility change (tab switching)
    handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        await forceReactivityRefresh()
      }
    }
    
    // Handle window focus
    handleFocus = async () => {
      await forceReactivityRefresh()
    }
    
    // Handle page show (back/forward navigation)
    handlePageShow = async (event) => {
      if (event.persisted) {
        // Page was restored from cache
        await forceReactivityRefresh()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('pageshow', handlePageShow)
    
    // Also listen for custom events
    window.addEventListener('pagevisible', forceReactivityRefresh)
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
    if (handlePageShow) {
      window.removeEventListener('pageshow', handlePageShow)
    }
    window.removeEventListener('pagevisible', forceReactivityRefresh)
  })
}
