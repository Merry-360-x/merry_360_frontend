<template>
  <MainLayout>
    <!-- Header Search (aligned with Home) -->
    <section class="bg-gray-50 dark:bg-gray-900 pt-6 pb-4">
      <div class="container mx-auto px-3">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white dark:bg-gray-800 backdrop-blur rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3">
            <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div class="relative flex-1">
                <label class="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">Transport</label>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search transport services"
                  class="w-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[48px] px-4 rounded-xl border border-gray-300 dark:border-gray-600"
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
              <button
                type="button"
                @click="performSearch"
                class="w-full md:w-auto h-12 px-6 md:px-4 rounded-xl bg-brand-500 text-white flex items-center justify-center gap-2 hover:bg-brand-600 active:scale-95 transition-all shadow-lg font-medium"
                aria-label="Search transport"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span class="md:hidden">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white dark:bg-gray-900 min-h-screen">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-text-brand-600 mb-2">Transportation Services</h1>
        <p class="text-text-secondary text-sm sm:text-base md:text-lg">Get around Rwanda with ease</p>
      </div>

      <div v-if="loading" class="py-16 text-center text-text-secondary">
        Loading vehicles...
      </div>

      <div v-else-if="filteredVehicles.length === 0" class="py-16 text-center text-text-secondary">
        No vehicles available right now.
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mb-12">
        <Card
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          hover
          clickable
          padding="lg"
          class="text-left"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="text-base sm:text-lg font-semibold text-text-brand-600 truncate">{{ vehicle.name }}</h3>
              <p class="text-text-secondary text-xs sm:text-sm truncate">{{ vehicle.type || 'Vehicle' }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg sm:text-2xl font-bold text-brand-600">{{ currencyStore.formatPrice(vehicle.price_per_day || 0) }}</p>
              <p class="text-xs text-text-muted">/ day</p>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between text-xs sm:text-sm text-text-secondary">
            <span>{{ Number(vehicle.capacity || 0) > 0 ? `${vehicle.capacity} seats` : '—' }}</span>
            <span v-if="vehicle.driver_included" class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-900">Driver included</span>
          </div>

          <div class="mt-4">
            <Button variant="primary" class="w-full" @click.stop="bookVehicle(vehicle)">Add to cart</Button>
          </div>
        </Card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'
import { useUserStore } from '@/stores/userStore'
import { useCurrencyStore } from '@/stores/currency'
import { subscribeToTable } from '@/services/supabase'

const searchQuery = ref('')

const { success, error: toastError } = useToast()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()

const vehicles = ref([])
const loading = ref(true)

const isSearchFocused = ref(false)
const highlightedSuggestionIndex = ref(-1)

const baseSuggestions = ['Taxi', 'Shuttle', 'Car Rental']

const normalizeForSuggestions = (value) => String(value || '').trim()
const buildSuggestionList = (rows, query) => {
  const q = String(query || '').trim().toLowerCase()
  if (q.length < 2) return []

  const results = []
  const seen = new Set()

  for (const row of rows || []) {
    const candidates = [normalizeForSuggestions(row?.name), normalizeForSuggestions(row?.type)].filter(Boolean)
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

const searchSuggestions = computed(() => {
  const vehicleSuggestions = buildSuggestionList(vehicles.value || [], searchQuery.value)
  if (vehicleSuggestions.length) return vehicleSuggestions

  const q = String(searchQuery.value || '').trim().toLowerCase()
  if (q.length < 2) return []
  return baseSuggestions
    .filter((s) => s.toLowerCase().includes(q))
    .sort((a, b) => {
      const aKey = a.toLowerCase()
      const bKey = b.toLowerCase()
      const aScore = aKey.startsWith(q) ? 2 : 1
      const bScore = bKey.startsWith(q) ? 2 : 1
      return (bScore - aScore) || a.localeCompare(b)
    })
    .slice(0, 6)
})

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
  performSearch()
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
  performSearch()
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching transport for:', searchQuery.value)
  }
}

const filteredVehicles = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase()
  if (!q) return vehicles.value || []
  return (vehicles.value || []).filter(v => {
    const name = String(v?.name || '').toLowerCase()
    const type = String(v?.type || '').toLowerCase()
    const plate = String(v?.license_plate || '').toLowerCase()
    return name.includes(q) || type.includes(q) || plate.includes(q)
  })
})

const loadVehicles = async () => {
  try {
    loading.value = true
    const response = await api.transport.getVehicles({})
    vehicles.value = Array.isArray(response?.data) ? response.data : []
  } catch (err) {
    console.error('Error loading vehicles:', err)
    vehicles.value = []
    toastError(err)
  } finally {
    loading.value = false
  }
}

const bookVehicle = (vehicle) => {
  const item = {
    id: vehicle.id,
    type: 'transport',
    service: 'vehicle',
    name: vehicle.name,
    price: vehicle.price_per_day ?? 0,
    duration: 'per day',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80'
  }
  userStore.addToCart(item)
  success(`Added ${item.name} to cart`)
}

let vehiclesRealtime = null
let vehiclesRealtimeTimer = null

onMounted(() => {
  loadVehicles()

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
