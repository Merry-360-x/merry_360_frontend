<template>
  <nav 
    v-if="showBottomNav" 
    class="relative bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 lg:hidden app-safe-area-bottom"
    style="padding-bottom: max(env(safe-area-inset-bottom), 12px);"
  >
    <div class="flex items-center justify-around px-2 pt-2">
      <router-link 
        to="/" 
        class="flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors min-w-[60px] no-select"
        :class="$route.path === '/' ? 'text-brand-500' : 'text-gray-600 dark:text-gray-400'"
        exact
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        <span class="text-xs font-medium">{{ t('nav.home') }}</span>
      </router-link>

      <router-link 
        to="/accommodations" 
        class="flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors min-w-[60px] no-select"
        :class="$route.path.includes('/accommodations') ? 'text-brand-500' : 'text-gray-600 dark:text-gray-400'"
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <span class="text-xs font-medium">{{ t('nav.stays') }}</span>
      </router-link>

      <router-link 
        to="/tours" 
        class="flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors min-w-[60px] no-select"
        :class="$route.path.includes('/tours') ? 'text-brand-500' : 'text-gray-600 dark:text-gray-400'"
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="text-xs font-medium">{{ t('nav.tours') }}</span>
      </router-link>

      <router-link 
        to="/dashboard/watchlist" 
        class="flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors min-w-[60px] no-select relative"
        :class="$route.path.includes('/watchlist') ? 'text-brand-500' : 'text-gray-600 dark:text-gray-400'"
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
        <span class="text-xs font-medium">{{ t('nav.saved') }}</span>
      </router-link>

      <router-link 
        to="/profile" 
        class="flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors min-w-[60px] no-select"
        :class="$route.path.includes('/profile') ? 'text-brand-500' : 'text-gray-600 dark:text-gray-400'"
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <span class="text-xs font-medium">{{ t('nav.profile') }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTranslation } from '../../composables/useTranslation'

const route = useRoute()
const { t } = useTranslation()

// Hide bottom nav on certain pages
const showBottomNav = computed(() => {
  const hideOnRoutes = ['/login', '/signup', '/admin', '/staff', '/host', '/vendor']
  return !hideOnRoutes.some(path => route.path.startsWith(path))
})
</script>

<style scoped>
/* Add haptic feedback on touch */
nav a:active {
  transform: scale(0.95);
}
</style>
