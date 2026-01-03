<template>
  <MainLayout>
    <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <!-- Mobile top bar -->
      <div class="md:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary"
            @click="isSidebarOpen = true"
            :aria-label="t('common.openMenu')"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold">M</span>
            </div>
            <span class="font-bold text-text-primary">{{ t('admin.title') }}</span>
          </div>

          <div class="w-10" />
        </div>
      </div>

      <div class="flex min-w-0">
        <!-- Mobile overlay -->
        <div
          v-if="isSidebarOpen"
          class="fixed inset-0 z-40 bg-black/50 md:hidden"
          @click="isSidebarOpen = false"
        />

        <!-- Admin Sidebar -->
        <aside
          class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transform transition-transform duration-200 md:static md:translate-x-0 md:sticky md:top-0"
          :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-xl">M</span>
              </div>
              <span class="text-xl font-bold text-text-primary">{{ t('admin.panel') }}</span>
            </div>
          </div>
          <nav class="p-4 space-y-1">
            <router-link 
              to="/admin" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              {{ t('admin.dashboard') }}
            </router-link>
            <router-link 
              to="/admin/accommodations" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/accommodations' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              {{ t('admin.accommodations') }}
            </router-link>
            <router-link 
              to="/admin/properties" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/properties' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2M8 6a2 2 0 012-2h4a2 2 0 012 2M8 6h8"></path>
              </svg>
              {{ t('admin.properties') }}
            </router-link>
            <router-link 
              to="/admin/tours" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/tours' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ t('admin.tours') }}
            </router-link>
            <router-link 
              to="/admin/transport" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/transport' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              {{ t('admin.transport') }}
            </router-link>
            <router-link 
              to="/admin/payments" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/payments' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {{ t('admin.payments') }}
            </router-link>
            <router-link 
              to="/admin/users" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/users' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              {{ t('admin.users') }}
            </router-link>
            <router-link 
              to="/admin/host-applications" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/host-applications' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              {{ t('admin.hostApplications') }}
            </router-link>
            <router-link 
              to="/admin/analytics" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/analytics' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              {{ t('admin.analytics') }}
            </router-link>
            <router-link 
              to="/admin/live-support" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/live-support' ? 'bg-brand-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              Live Support
            </router-link>

            <!-- Divider -->
            <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>
            
            <!-- Create Section -->
            <div class="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Create New
            </div>

            <router-link 
              to="/admin/create-tour" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/create-tour' ? 'bg-green-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create Tour
            </router-link>

            <router-link 
              to="/admin/create-transport" 
              class="flex items-center px-4 py-3 rounded-button transition-colors"
              :class="$route.path === '/admin/create-transport' ? 'bg-purple-500 text-white' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700'"
              @click="isSidebarOpen = false"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create Transport
            </router-link>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0 p-4 md:p-8">
          <slot />
        </main>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from './MainLayout.vue'
import { useTranslation } from '../../composables/useTranslation'

const isSidebarOpen = ref(false)
const { t } = useTranslation()
</script>
