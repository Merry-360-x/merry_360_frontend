<template>
  <MainLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile top bar -->
    <div class="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          class="p-2 rounded-lg hover:bg-gray-100 text-text-primary"
          @click="isSidebarOpen = true"
          aria-label="Open menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center overflow-hidden">
            <span class="text-white font-bold">{{ portalInitial }}</span>
          </div>
          <span class="font-bold text-text-primary">{{ portalTitle }}</span>
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

      <!-- Vendor Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 min-h-screen transform transition-transform duration-200 md:static md:translate-x-0 md:sticky md:top-0"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-xl">{{ portalInitial }}</span>
            </div>
            <span class="text-xl font-bold">{{ portalTitle }}</span>
          </div>
        </div>
        <nav class="p-4 space-y-1">
          <button type="button" class="w-full flex items-center px-4 py-3 bg-brand-500 text-white rounded-button" @click="isSidebarOpen = false">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </button>
          <button type="button" class="w-full flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button" @click="isSidebarOpen = false">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            My Listings
          </button>
          <button type="button" class="w-full flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button" @click="isSidebarOpen = false">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Calendar
          </button>
          <button type="button" class="w-full flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button" @click="isSidebarOpen = false">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Revenue
          </button>
          <button type="button" class="w-full flex items-center px-4 py-3 text-text-secondary hover:bg-gray-50 rounded-button" @click="isSidebarOpen = false">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Settings
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
        <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{{ pageTitle }}</h1>
            <p class="text-text-secondary">Manage your properties and bookings</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button class="w-full sm:w-auto" variant="secondary" @click="$router.push('/vendor/create-property')">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Add Property
            </Button>
            <Button class="w-full sm:w-auto" variant="secondary" @click="$router.push('/vendor/create-tour')">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Add Tour
            </Button>
            <Button class="w-full sm:w-auto" variant="primary" @click="$router.push('/vendor/create-transport')">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              Add Transport
            </Button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Total Bookings</p>
                <p class="text-2xl sm:text-3xl font-bold">0</p>
                <p class="text-text-secondary text-sm mt-1">No bookings yet</p>
              </div>
              <div class="w-12 h-12 bg-brand-500 bg-opacity-10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Revenue</p>
                <p class="text-2xl sm:text-3xl font-bold">$0</p>
                <p class="text-text-secondary text-sm mt-1">This month</p>
              </div>
              <div class="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Avg. Rating</p>
                <p class="text-2xl sm:text-3xl font-bold">N/A</p>
                <p class="text-text-secondary text-sm mt-1">No reviews yet</p>
              </div>
              <div class="w-12 h-12 bg-success bg-opacity-10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-secondary text-sm mb-1">Properties</p>
                <p class="text-2xl sm:text-3xl font-bold">0</p>
                <p class="text-text-secondary text-sm mt-1">No active listings</p>
              </div>
              <div class="w-12 h-12 bg-warning bg-opacity-10 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
          </Card>
        </div>

        <!-- My Listings -->
        <Card padding="lg">
          <h2 class="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">My Listings</h2>
          <div class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <h3 class="text-xl font-semibold text-text-brand-600 mb-2">No listings yet</h3>
            <p class="text-text-secondary mb-4">Create your first property listing to start earning.</p>
            <Button variant="primary" @click="$router.push('/vendor/create-property')">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create First Listing
            </Button>
          </div>
        </Card>
      </main>
    </div>
  </div>
  </MainLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../../stores/userStore'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'

const userStore = useUserStore()

const isSidebarOpen = ref(false)

const isHost = computed(() => userStore.user?.role === 'host')
const portalInitial = computed(() => (isHost.value ? 'H' : 'V'))
const portalTitle = computed(() => (isHost.value ? 'Host Portal' : 'Vendor Portal'))
const pageTitle = computed(() => (isHost.value ? 'Host Dashboard' : 'Vendor Dashboard'))
</script>
