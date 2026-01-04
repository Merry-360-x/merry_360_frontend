<template>
  <MainLayout>
    <!-- Airbnb-style Hero + Search -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <video 
          autoplay 
          muted 
          loop 
          playsinline 
          loading="lazy"
          preload="metadata"
          poster="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
          class="w-full h-full object-cover"
        >
          <source src="/videos/Merry.mp4" type="video/mp4">
        </video>
        <div class="absolute inset-0 bg-black/40"></div>
      </div>

      <div class="relative z-10 container mx-auto px-3 sm:px-4">
        <div class="min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center py-12 sm:py-20">
          <h1 class="text-2xl sm:text-3xl md:text-5xl font-semibold text-white text-center max-w-3xl px-4">
            {{ t('home.findProperty') }}
          </h1>

          <div class="mt-6 sm:mt-8 w-full max-w-4xl px-2 sm:px-0">
            <div class="bg-white dark:bg-gray-800 backdrop-blur rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
                <!-- Location -->
                <div class="md:col-span-1">
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('accommodation.location') }}</label>
                  <input
                    v-model="searchQuery.location"
                    type="text"
                    :placeholder="t('search.whereGoing')"
                    class="w-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-gray-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[48px] px-4 rounded-xl border border-gray-300 dark:border-gray-600"
                  />
                </div>

                <!-- Check In -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('search.checkIn') }}</label>
                  <input
                    v-model="searchQuery.checkIn"
                    type="date"
                    :min="minCheckInDate"
                    class="w-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer min-h-[48px] px-4 rounded-xl border border-gray-300 dark:border-gray-600"
                  />
                </div>

                <!-- Check Out -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('search.checkOut') }}</label>
                  <input
                    v-model="searchQuery.checkOut"
                    type="date"
                    :min="minCheckOutDate"
                    class="w-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer min-h-[48px] px-4 rounded-xl border border-gray-300 dark:border-gray-600"
                  />
                </div>

                <!-- Guests + Search -->
                <div class="relative" ref="guestSelectorContainer">
                  <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('accommodation.guests') }}</label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click.stop="toggleGuestSelector"
                      class="flex-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer flex items-center justify-between border border-gray-300 dark:border-gray-600 rounded-xl px-4 min-h-[48px] hover:border-brand-500 transition-colors"
                    >
                      <span class="truncate">{{ guestSummary }}</span>
                      <svg class="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform flex-shrink-0 ml-2" :class="{ 'rotate-180': showGuestSelector }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    <button
                      type="button"
                      @click="handleSearch"
                      class="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 active:scale-95 transition-all shadow-lg flex-shrink-0"
                      :aria-label="t('home.search')"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </button>
                  </div>

                  <!-- Guest Selector Dropdown -->
                  <div v-if="showGuestSelector" @click.stop class="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl p-4 min-w-[320px] z-[100] border border-gray-200 dark:border-gray-700 shadow-xl">
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-semibold text-text-primary">{{ t('accommodation.adults') }}</div>
                          <div class="text-xs text-text-muted">{{ t('accommodation.adultsDesc') }}</div>
                        </div>
                        <div class="flex items-center gap-3">
                          <button
                            @click="decrementGuests('adults')"
                            :disabled="guestCounts.adults <= 1"
                            class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <span class="w-8 text-center font-semibold">{{ guestCounts.adults }}</span>
                          <button
                            @click="incrementGuests('adults')"
                            class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-semibold text-text-primary">{{ t('accommodation.children') }}</div>
                          <div class="text-xs text-text-muted">{{ t('accommodation.childrenDesc') }}</div>
                        </div>
                        <div class="flex items-center gap-3">
                          <button
                            @click="decrementGuests('children')"
                            :disabled="guestCounts.children <= 0"
                            class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <span class="w-8 text-center font-semibold">{{ guestCounts.children }}</span>
                          <button
                            @click="incrementGuests('children')"
                            class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-semibold text-text-primary">{{ t('accommodation.infants') }}</div>
                          <div class="text-xs text-text-muted">{{ t('accommodation.infantsDesc') }}</div>
                        </div>
                        <div class="flex items-center gap-3">
                          <button
                            @click="decrementGuests('infants')"
                            :disabled="guestCounts.infants <= 0"
                            class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <span class="w-8 text-center font-semibold">{{ guestCounts.infants }}</span>
                          <button
                            @click="incrementGuests('infants')"
                            class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Primary Listings (Airbnb-style grid) -->
    <section class="bg-white dark:bg-gray-900">
      <div class="container mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-end justify-between mb-4 sm:mb-6">
            <div>
              <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-text-primary">{{ t('home.latestProperties') }}</h2>
              <p class="text-text-secondary text-xs sm:text-sm mt-1">{{ t('home.browseDesc') }}</p>
            </div>
            <router-link to="/accommodations" class="text-sm font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap">
              {{ t('home.browseMore') }}
            </router-link>
          </div>
          <div v-if="isLoading" class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
            <PropertyCardSkeleton v-for="n in 10" :key="`skeleton-${n}`" />
          </div>
          <div v-else class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
            <PropertyCard v-for="property in latestProperties" :key="property.id" :property="property" />
          </div>
        </div>
      </div>
    </section>

    <!-- Hosting CTA (kept, simplified) -->
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <div class="relative overflow-hidden rounded-xl sm:rounded-2xl max-w-7xl mx-auto min-h-[200px] sm:min-h-[300px]">
          <img
            loading="lazy"
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
            alt="Try Hosting"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="relative p-6 sm:p-8 md:p-12 max-w-2xl">
            <h2 class="text-xl sm:text-2xl md:text-4xl font-semibold text-white">{{ t('home.tryHosting') }}</h2>
            <p class="mt-2 sm:mt-3 text-white/90 text-xs sm:text-sm md:text-base">{{ t('home.tryHostingDesc') }}</p>
            <router-link
              to="/become-host"
              class="mt-4 sm:mt-6 inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 active:scale-95 transition-all shadow-lg"
            >
              {{ t('home.tryHosting') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import PropertyCard from '@/components/common/PropertyCard.vue'
import PropertyCardSkeleton from '@/components/common/PropertyCardSkeleton.vue'
import { useTranslation } from '@/composables/useTranslation'
import api from '@/services/api'
import { getCachedAccommodations, setCachedAccommodations } from '@/services/accommodationCache'
import { waitForPreload } from '@/services/preloadData'
import fastFetch from '@/services/fastFetch'

const router = useRouter()
const { t } = useTranslation()

const showGuestSelector = ref(false)
const guestSelectorContainer = ref(null)

// Toggle guest selector
const toggleGuestSelector = () => {
  showGuestSelector.value = !showGuestSelector.value
}

// Close guest selector when clicking outside
const handleClickOutside = (event) => {
  if (guestSelectorContainer.value && !guestSelectorContainer.value.contains(event.target)) {
    showGuestSelector.value = false
  }
}

// Add and remove event listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const searchQuery = ref({
  location: '',
  checkIn: '',
  checkOut: '',
  guests: ''
})

const guestCounts = ref({
  adults: 1,
  children: 0,
  infants: 0
})

const minCheckInDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const minCheckOutDate = computed(() => {
  if (searchQuery.value.checkIn) {
    const checkIn = new Date(searchQuery.value.checkIn)
    checkIn.setDate(checkIn.getDate() + 1)
    return checkIn.toISOString().split('T')[0]
  }
  return minCheckInDate.value
})

const guestSummary = computed(() => {
  const total = guestCounts.value.adults + guestCounts.value.children + guestCounts.value.infants
  if (total === 0) return t('accommodation.guests')
  const parts = []
  if (guestCounts.value.adults > 0) parts.push(`${guestCounts.value.adults} adult${guestCounts.value.adults > 1 ? 's' : ''}`)
  if (guestCounts.value.children > 0) parts.push(`${guestCounts.value.children} child${guestCounts.value.children > 1 ? 'ren' : ''}`)
  if (guestCounts.value.infants > 0) parts.push(`${guestCounts.value.infants} infant${guestCounts.value.infants > 1 ? 's' : ''}`)
  return parts.join(', ')
})

const incrementGuests = (type) => {
  guestCounts.value[type]++
}

const decrementGuests = (type) => {
  if (guestCounts.value[type] > 0) {
    if (type === 'adults' && guestCounts.value[type] === 1) return
    guestCounts.value[type]--
  }
}

const latestProperties = ref([])
const nearbyProperties = ref([])
const topRatedProperties = ref([])
const featuredProperties = ref([])
const isLoading = ref(true)
const sectionsLoaded = ref(false)

const extractAccommodations = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

const loadHomeProperties = async () => {
  try {
    // Ultra-fast fetch with aggressive caching - fetch 10 for 2x5 grid
    const result = await fastFetch.fetchAccommodations({ limit: 10, minimal: true })
    const all = result.data || []
    
    if (all.length === 0) {
      isLoading.value = false
      return
    }
    
    const take = (start, count) => all.slice(start, start + count)
    
    // Show first 10 immediately for 2x5 grid
    latestProperties.value = take(0, 10)
    isLoading.value = false
    
    // Progressive load other sections (non-blocking)
    setTimeout(() => {
      nearbyProperties.value = take(0, 10)
      featuredProperties.value = all.length > 4 ? take(0, 4) : []
      topRatedProperties.value = [...all]
        .sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0))
        .slice(0, 4)
      sectionsLoaded.value = true
      
      // Prefetch more data for accommodations page
      fastFetch.prefetchNextPage({ limit: 20 })
    }, 50)
    
  } catch (error) {
    console.error('Failed to load home properties:', error)
    isLoading.value = false
  }
}

const buildSearchQuery = () => {
  const q = String(searchQuery.value.location || '').trim()
  const guests = (Number(guestCounts.value.adults) || 0) + (Number(guestCounts.value.children) || 0)
  const checkIn = String(searchQuery.value.checkIn || '').trim()
  const checkOut = String(searchQuery.value.checkOut || '').trim()

  return {
    ...(q ? { q } : {}),
    ...(guests ? { guests: String(guests) } : {}),
    ...(checkIn ? { checkIn } : {}),
    ...(checkOut ? { checkOut } : {})
  }
}

const handleSearch = () => {
  router.push({
    path: '/accommodations',
    query: buildSearchQuery()
  })
}

// Hero Video Carousel
onMounted(async () => {
  // Wait for preload to complete (or return immediately if already cached)
  await waitForPreload()
  await loadHomeProperties()
})
</script>

<style scoped></style>
