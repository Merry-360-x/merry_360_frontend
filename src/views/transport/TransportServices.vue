<template>
  <MainLayout>
    <!-- Hero Section with Search -->
    <section class="relative bg-gradient-to-br from-brand-50 to-white dark:from-gray-900 dark:to-gray-900 py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold mb-3 text-text-primary">{{ t('transport.title') }}</h1>
          <p class="text-base md:text-lg text-text-secondary">{{ t('transport.subtitle') }}</p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-3xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 flex flex-col md:flex-row gap-3">
            <!-- Route Search -->
            <div class="relative flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <svg class="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <input 
                v-model="searchQuery"
                type="text" 
                :placeholder="t('transport.searchPlaceholder')"
                class="flex-1 bg-transparent text-sm font-medium text-text-primary focus:outline-none placeholder:text-text-muted"
                @focus="onSearchFocus"
                @blur="onSearchBlur"
                @keydown.down.prevent="highlightNextSuggestion"
                @keydown.up.prevent="highlightPrevSuggestion"
                @keydown.enter.prevent="onSearchEnter"
              />

              <div
                v-if="isSearchFocused && searchSuggestions.length"
                class="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-card z-50 overflow-hidden"
                role="listbox"
              >
                <button
                  v-for="(suggestion, idx) in searchSuggestions"
                  :key="suggestion"
                  type="button"
                  class="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  :class="idx === highlightedSuggestionIndex ? 'bg-gray-50 dark:bg-gray-900' : ''"
                  @mousedown.prevent="applySuggestion(suggestion)"
                  role="option"
                  :aria-selected="idx === highlightedSuggestionIndex"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>

            <!-- Vehicle Type Filter -->
            <select 
              v-model="vehicleFilter"
              class="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm font-medium text-text-primary focus:outline-none cursor-pointer"
            >
              <option value="">{{ t('transport.allVehicles') }}</option>
              <option value="taxi">{{ t('transport.taxi') }}</option>
              <option value="shuttle">{{ t('transport.shuttle') }}</option>
              <option value="rental">{{ t('transport.carRental') }}</option>
            </select>

            <!-- Search Button -->
            <button 
              @click="applySearch"
              class="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              {{ t('common.search') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Cards -->
    <section class="py-12 md:py-16 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <!-- Taxi Service -->
          <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div class="p-8 text-center">
              <div class="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-text-brand-600 mb-2">{{ t('transport.taxi') }}</h3>
              <p class="text-sm text-text-secondary mb-4">{{ t('transport.taxiDesc') }}</p>
              <button @click="bookService('taxi')" class="w-full px-5 py-2.5 bg-brand-500 text-sm text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors">
                {{ t('accommodation.addToCart') }}
              </button>
            </div>
          </div>

          <!-- Shuttle Service -->
          <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div class="p-8 text-center">
              <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-text-brand-600 mb-2">{{ t('transport.shuttle') }}</h3>
              <p class="text-sm text-text-secondary mb-4">{{ t('transport.shuttleDesc') }}</p>
              <button @click="bookService('shuttle')" class="w-full px-5 py-2.5 bg-brand-500 text-sm text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors">
                {{ t('accommodation.addToCart') }}
              </button>
            </div>
          </div>

          <!-- Car Rental -->
          <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div class="p-8 text-center">
              <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-text-brand-600 mb-2">{{ t('transport.carRental') }}</h3>
              <p class="text-sm text-text-secondary mb-4">{{ t('transport.carRentalDesc') }}</p>
              <button @click="browseCars" class="w-full px-5 py-2.5 border-2 border-brand-500 text-sm text-brand-600 rounded-xl font-semibold hover:bg-brand-600 hover:text-white transition-colors">
                {{ t('transport.browseCars') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Popular Routes Section -->
        <div class="mt-12">
          <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-text-brand-600 mb-6 text-center">{{ t('transport.popularRoutes') }}</h2>
          <div v-if="filteredRoutes.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-text-secondary">{{ t('transport.noRoutesFound') }}</p>
          </div>
          <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div v-for="route in filteredRoutes" :key="route.id" class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 text-text-brand-600 font-semibold mb-2">
                    <svg class="w-5 h-5 text-text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="3"></circle>
                    </svg>
                    {{ route.from }}
                  </div>
                  <div class="flex items-center gap-2 text-text-secondary">
                    <svg class="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    {{ route.to }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-brand-600">{{ currencyStore.formatPrice(route.price) }}</div>
                  <div class="text-xs text-text-muted">{{ route.duration }}</div>
                </div>
              </div>
              <button @click="bookRoute(route)" class="w-full px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors">
                {{ t('accommodation.addToCart') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Vehicles (from Supabase) -->
        <div class="mt-12">
          <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-text-brand-600 mb-6 text-center">{{ t('transport.allVehicles') }}</h2>

          <div v-if="vehiclesLoading" class="text-center py-10 text-text-secondary">
            Loading vehicles...
          </div>

          <div v-else-if="filteredVehicles.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-text-secondary">No vehicles available right now.</p>
          </div>

          <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div
              v-for="vehicle in filteredVehicles"
              :key="vehicle.id"
              class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <!-- Vehicle Image -->
              <div class="relative h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img 
                  :src="optimizeVehicleImage(vehicle.main_image || (Array.isArray(vehicle.images) && vehicle.images.length > 0 ? vehicle.images[0] : null))"
                  :alt="vehicle.name || 'Vehicle'"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  @error="handleVehicleImageError"
                />
                <div v-if="vehicle.driver_included" class="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                  Driver Included
                </div>
              </div>
              
              <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <p class="font-semibold text-text-brand-600">{{ vehicle.name }}</p>
                    <p class="text-sm text-text-secondary">{{ vehicle.type || 'Vehicle' }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-brand-600">{{ currencyStore.formatPrice(vehicle.price_per_day || vehicle.price || 0) }}</div>
                    <div class="text-xs text-text-muted">/ day</div>
                  </div>
                </div>

                <div class="flex items-center justify-between text-sm text-text-secondary mb-4">
                  <span>{{ Number(vehicle.capacity || 0) > 0 ? `${vehicle.capacity} seats` : '—' }}</span>
                </div>

                <button
                  @click="bookVehicle(vehicle)"
                  class="w-full px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors"
                >
                  {{ t('accommodation.addToCart') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-text-brand-600">{{ t('transport.feature247Title') }}</h4>
            <p class="text-sm text-text-secondary">{{ t('transport.feature247Desc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-text-brand-600">{{ t('transport.featureDriversTitle') }}</h4>
            <p class="text-sm text-text-secondary">{{ t('transport.featureDriversDesc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-text-brand-600">{{ t('transport.featurePricesTitle') }}</h4>
            <p class="text-sm text-text-secondary">{{ t('transport.featurePricesDesc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-text-brand-600">{{ t('transport.featureBookingTitle') }}</h4>
            <p class="text-sm text-text-secondary">{{ t('transport.featureBookingDesc') }}</p>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast'
import MainLayout from '../../components/layout/MainLayout.vue'
import api from '@/services/api'
import { subscribeToTable } from '@/services/supabase'
import { optimizeImageUrl } from '@/services/imageOptimization'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()
const { success, error: toastError } = useToast()
const searchQuery = ref('')
const vehicleFilter = ref('')

const isSearchFocused = ref(false)
const highlightedSuggestionIndex = ref(-1)

const normalizeForSuggestions = (value) => String(value || '').trim()
const buildSuggestionList = (rows, query) => {
  const q = String(query || '').trim().toLowerCase()
  if (q.length < 2) return []

  const results = []
  const seen = new Set()

  for (const row of rows || []) {
    const candidates = [
      normalizeForSuggestions(row?.from),
      normalizeForSuggestions(row?.to),
      row?.from && row?.to ? `${normalizeForSuggestions(row.from)} → ${normalizeForSuggestions(row.to)}` : ''
    ].filter(Boolean)

    for (const raw of candidates) {
      const key = raw.toLowerCase()
      if (seen.has(key)) continue
      if (!key.includes(q)) continue
      results.push({ value: raw, score: key.startsWith(q) ? 2 : 1 })
      seen.add(key)
    }
  }

  results.sort((a, b) => (b.score - a.score) || a.value.localeCompare(b.value))
  return results.slice(0, 6).map(r => r.value)
}

const popularRoutes = ref([])

const loadPopularRoutes = async () => {
  try {
    // Try to load routes from database if available
    const res = await api.transport.getRoutes({ limit: 10 })
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      popularRoutes.value = res.data.map(route => ({
        id: route.id,
        from: route.from || route.origin || 'Kigali',
        to: route.to || route.destination || '',
        price: Number(route.price) || 0,
        duration: route.duration || route.estimated_duration || '',
        vehicle: route.vehicle_type || route.vehicle || 'shuttle'
      }))
    } else {
      // Fallback: empty array - routes will be loaded from vehicles if needed
      popularRoutes.value = []
    }
  } catch (error) {
    console.error('Failed to load popular routes:', error)
    popularRoutes.value = []
  }
}

const vehicles = ref([])
const vehiclesLoading = ref(true)

const loadVehicles = async () => {
  try {
    vehiclesLoading.value = true
    const response = await api.transport.getVehicles({})
    vehicles.value = Array.isArray(response?.data) ? response.data : []
  } catch (err) {
    console.error('Error loading vehicles:', err)
    vehicles.value = []
    toastError(err)
  } finally {
    vehiclesLoading.value = false
  }
}

const filteredVehicles = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase()
  const typeFilter = String(vehicleFilter.value || '').trim().toLowerCase()

  return (vehicles.value || []).filter((v) => {
    // Type filter (best-effort mapping)
    if (typeFilter) {
      const t = String(v?.type || '').toLowerCase()
      if (!t.includes(typeFilter)) return false
    }

    if (!q) return true
    const name = String(v?.name || '').toLowerCase()
    const t = String(v?.type || '').toLowerCase()
    const plate = String(v?.license_plate || '').toLowerCase()
    return name.includes(q) || t.includes(q) || plate.includes(q)
  })
})

const filteredRoutes = computed(() => {
  let filtered = popularRoutes.value

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (route) =>
        route.from.toLowerCase().includes(query) ||
        route.to.toLowerCase().includes(query)
    )
  }

  if (vehicleFilter.value) {
    filtered = filtered.filter((route) => route.vehicle === vehicleFilter.value)
  }

  return filtered
})

const searchSuggestions = computed(() => buildSuggestionList(popularRoutes.value || [], searchQuery.value))

const onSearchFocus = () => {
  isSearchFocused.value = true
}

const onSearchBlur = () => {
  window.setTimeout(() => {
    isSearchFocused.value = false
    highlightedSuggestionIndex.value = -1
  }, 120)
}

const applySuggestion = (suggestion) => {
  searchQuery.value = suggestion
  isSearchFocused.value = false
  highlightedSuggestionIndex.value = -1
  applySearch()
}

const highlightNextSuggestion = () => {
  if (!isSearchFocused.value || !searchSuggestions.value.length) return
  const next = highlightedSuggestionIndex.value + 1
  highlightedSuggestionIndex.value = next >= searchSuggestions.value.length ? 0 : next
}

const highlightPrevSuggestion = () => {
  if (!isSearchFocused.value || !searchSuggestions.value.length) return
  const prev = highlightedSuggestionIndex.value - 1
  highlightedSuggestionIndex.value = prev < 0 ? searchSuggestions.value.length - 1 : prev
}

const onSearchEnter = () => {
  if (isSearchFocused.value && highlightedSuggestionIndex.value >= 0) {
    const suggestion = searchSuggestions.value[highlightedSuggestionIndex.value]
    if (suggestion) {
      applySuggestion(suggestion)
      return
    }
  }
  applySearch()
}

const applySearch = () => {
  console.log('Search applied:', filteredRoutes.value.length, 'routes found')
}

const bookService = (type) => {
  const serviceName = type === 'taxi'
    ? t('transport.taxi')
    : type === 'shuttle'
      ? t('transport.shuttle')
      : t('transport.carRental')

  const serviceItem = {
    id: Date.now(),
    type: 'transport',
    service: type,
    name: serviceName,
    price: type === 'taxi' ? 5000 : type === 'shuttle' ? 3000 : 50000,
    image: null
  }
  userStore.addToCart(serviceItem)
  success(t('common.addedToCart', { item: serviceItem.name }))
}

const browseCars = () => {
  alert(t('transport.carRentalCatalogComingSoon'))
}

const optimizeVehicleImage = (url) => {
  if (!url) return ''
  return optimizeImageUrl(url, {
    width: 400,
    quality: 'auto:eco'
  })
}

const handleVehicleImageError = (event) => {
  // Set a default placeholder if image fails
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="16"%3EVehicle%3C/text%3E%3C/svg%3E'
}

const bookRoute = (route) => {
  const routeItem = {
    id: route.id || Date.now(),
    type: 'transport',
    service: 'route',
    name: `${route.from} → ${route.to}`,
    price: route.price,
    duration: route.duration,
    image: null // Routes don't have images
  }
  userStore.addToCart(routeItem)
  success(t('common.addedToCart', { item: `${route.from} → ${route.to}` }))
}

const bookVehicle = (vehicle) => {
  router.push({ name: 'transport-detail', params: { id: vehicle.id } })
}

let vehiclesRealtime = null
let vehiclesRealtimeTimer = null

onMounted(async () => {
  await Promise.all([
    loadVehicles(),
    loadPopularRoutes()
  ])

  vehiclesRealtime = subscribeToTable({
    table: 'vehicles',
    callback: () => {
      if (vehiclesRealtimeTimer) window.clearTimeout(vehiclesRealtimeTimer)
      vehiclesRealtimeTimer = window.setTimeout(() => {
        loadVehicles()
      }, 300)
    }
  })
})

onBeforeUnmount(() => {
  if (vehiclesRealtimeTimer) window.clearTimeout(vehiclesRealtimeTimer)
  if (vehiclesRealtime && typeof vehiclesRealtime.unsubscribe === 'function') {
    vehiclesRealtime.unsubscribe()
  }
})
</script>
