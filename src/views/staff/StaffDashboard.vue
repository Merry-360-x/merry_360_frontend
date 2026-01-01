<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div class="flex">
        <!-- Staff Sidebar -->
        <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0 transition-colors duration-200">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  v-if="userStore.user?.avatar_url"
                  :src="userStore.user.avatar_url"
                  alt="Staff photo"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-white font-bold text-xl">{{ portalInitial }}</span>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ portalTitle }}</span>
            </div>
          </div>
          <nav class="p-4 space-y-1">
            <router-link 
              :to="dashboardPath" 
              class="flex items-center px-4 py-3 rounded-lg transition-colors"
              :class="$route.path === dashboardPath ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Dashboard
            </router-link>
            <router-link 
              :to="propertiesPath" 
              class="flex items-center px-4 py-3 rounded-lg transition-colors"
              :class="$route.path === propertiesPath ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              My Properties
            </router-link>
            <router-link 
              :to="addPropertyPath" 
              class="flex items-center px-4 py-3 rounded-lg transition-colors"
              :class="$route.path === addPropertyPath ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Property
            </router-link>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-8">
          <div class="mb-8">
            <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ dashboardTitle }}</h1>
            <p class="text-gray-600 dark:text-gray-400">Manage your listings and bookings</p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-1">My Properties</p>
                  <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.properties }}</p>
                  <p class="text-green-600 dark:text-green-400 text-sm mt-1">Active listings</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Bookings</p>
                  <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.bookings }}</p>
                  <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">This month</p>
                </div>
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-1">Revenue</p>
                  <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">${{ stats.revenue.toLocaleString() }}</p>
                  <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">From your properties</p>
                </div>
                <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors duration-200">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
            <div class="flex flex-wrap gap-4">
              <router-link 
                :to="addPropertyPath"
                class="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add New Property
              </router-link>
              <router-link 
                :to="propertiesPath"
                class="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                View All Properties
              </router-link>
            </div>
          </div>

          <!-- Recent Properties -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">My Recent Properties</h2>
            
            <div v-if="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p class="text-gray-600 dark:text-gray-400 mt-2">Loading properties...</p>
            </div>
            
            <div v-else-if="properties.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No properties yet</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Start by adding your first property</p>
              <router-link 
                :to="addPropertyPath"
                class="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add First Property
              </router-link>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="property in properties.slice(0, 6)" 
                :key="property.id"
                class="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <img 
                  :src="property.image || property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'"
                  :alt="property.title"
                  class="w-full h-40 object-cover"
                />
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ property.title }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ property.location }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-blue-600 dark:text-blue-400 font-bold">${{ property.price }}/night</span>
                    <span 
                      class="px-2 py-1 text-xs rounded-full"
                      :class="property.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'"
                    >
                      {{ property.status || 'active' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase } from '../../services/supabase'
import { useUserStore } from '../../stores/userStore'

const route = useRoute()
const userStore = useUserStore()

const isHostPortal = computed(() => String(route.path || '').startsWith('/host'))
const portalTitle = computed(() => (isHostPortal.value ? 'Host Portal' : 'Staff Portal'))
const portalInitial = computed(() => (isHostPortal.value ? 'H' : 'S'))
const dashboardTitle = computed(() => (isHostPortal.value ? 'Host Dashboard' : 'Staff Dashboard'))

const basePath = computed(() => (isHostPortal.value ? '/host' : '/staff'))
const dashboardPath = computed(() => basePath.value)
const propertiesPath = computed(() => `${basePath.value}/properties`)
const addPropertyPath = computed(() => `${basePath.value}/add-property`)

const loading = ref(true)
const properties = ref([])
const stats = ref({
  properties: 0,
  bookings: 0,
  revenue: 0
})

onMounted(async () => {
  await loadStaffData()
})

async function loadStaffData() {
  try {
    const userId = userStore.user?.id
    if (!userId) {
      loading.value = false
      return
    }

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [propertiesCountRes, recentPropertiesRes, bookingsRes] = await Promise.all([
      supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('host_id', userId),

      supabase
        .from('properties')
        .select('id,name,location,price_per_night,images,main_image,available,created_at')
        .eq('host_id', userId)
        .order('created_at', { ascending: false })
        .limit(6),

      // Bookings for this staff's properties (this month, paid)
      // Uses FK join bookings.property_id -> properties.id.
      supabase
        .from('bookings')
        .select('total_price, properties!inner(host_id)', { count: 'exact' })
        .eq('properties.host_id', userId)
        .eq('payment_status', 'paid')
        .gte('created_at', monthStart)
    ])

    if (propertiesCountRes.error) throw propertiesCountRes.error
    if (recentPropertiesRes.error) throw recentPropertiesRes.error
    if (bookingsRes.error) throw bookingsRes.error

    properties.value = (recentPropertiesRes.data || []).map((row) => ({
      id: row.id,
      title: row.name || 'Untitled Property',
      location: row.location || '',
      price: row.price_per_night ?? 0,
      images: row.images || [],
      image: row.main_image || row.images?.[0] || null,
      status: row.available === false ? 'inactive' : 'active'
    }))

    const bookingsCount = bookingsRes.count || 0
    const totalRevenue = (bookingsRes.data || []).reduce(
      (sum, b) => sum + Number(b?.total_price || 0),
      0
    )

    stats.value = {
      properties: propertiesCountRes.count || 0,
      bookings: bookingsCount,
      revenue: totalRevenue
    }

  } catch (error) {
    console.error('Error loading staff data:', error)
  } finally {
    loading.value = false
  }
}
</script>
