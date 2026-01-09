/**
 * Composable for determining the correct dashboard path based on user role
 * 
 * Usage:
 *   import { useDashboardPath } from '@/composables/useDashboardPath'
 *   const { dashboardPath, goToDashboard } = useDashboardPath()
 */

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

export function useDashboardPath() {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()

  /**
   * Determines dashboard path based on:
   * 1. Current route path (if already in a dashboard context)
   * 2. User's role from the store
   */
  const dashboardPath = computed(() => {
    // If we're already in a dashboard context, stay in it
    if (route.path.startsWith('/admin')) return '/admin'
    if (route.path.startsWith('/staff')) return '/staff'
    if (route.path.startsWith('/host')) return '/host'
    if (route.path.startsWith('/vendor')) return '/vendor'

    // Otherwise, determine by user role
    const role = userStore.user?.role
    switch (role) {
      case 'admin':
        return '/admin'
      case 'staff':
        return '/staff'
      case 'host':
        return '/host'
      case 'vendor':
        return '/vendor'
      default:
        return '/profile'
    }
  })

  /**
   * Navigate to the appropriate dashboard
   */
  const goToDashboard = () => {
    router.push(dashboardPath.value)
  }

  /**
   * Get the dashboard name for display
   */
  const dashboardName = computed(() => {
    const path = dashboardPath.value
    if (path === '/admin') return 'Admin Dashboard'
    if (path === '/staff') return 'Staff Dashboard'
    if (path === '/host') return 'Host Dashboard'
    if (path === '/vendor') return 'Vendor Dashboard'
    return 'Profile'
  })

  return {
    dashboardPath,
    dashboardName,
    goToDashboard
  }
}

export default useDashboardPath
