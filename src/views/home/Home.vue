<template>
  <MainLayout>
    <!-- Airbnb-style Hero + Search -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <video autoplay muted loop playsinline class="w-full h-full object-cover">
          <source src="/videos/Merry.mp4" type="video/mp4">
        </video>
        <div class="absolute inset-0 bg-black/40"></div>
      </div>

      <div class="relative z-10 container mx-auto px-4">
        <div class="min-h-[70vh] flex flex-col items-center justify-center py-20">
          <h1 class="text-3xl md:text-5xl font-semibold text-white text-center max-w-3xl">
            {{ t('home.findProperty') }}
          </h1>

          <div class="mt-8 w-full max-w-4xl">
            <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow-card border border-gray-200/60 dark:border-gray-700 p-3">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <!-- Location -->
                <div class="md:col-span-1">
                  <label class="block text-xs font-semibold text-text-secondary mb-1">{{ t('accommodation.location') }}</label>
                  <input
                    v-model="searchQuery.location"
                    type="text"
                    :placeholder="t('search.whereGoing')"
                    class="w-full text-sm font-semibold focus:outline-none placeholder:text-text-muted bg-transparent text-text-primary"
                  />
                </div>

                <!-- Check In -->
                <div>
                  <label class="block text-xs font-semibold text-text-secondary mb-1">{{ t('search.checkIn') }}</label>
                  <input
                    v-model="searchQuery.checkIn"
                    type="date"
                    :min="minCheckInDate"
                    class="w-full text-sm font-semibold focus:outline-none bg-transparent text-text-primary cursor-pointer"
                  />
                </div>

                <!-- Check Out -->
                <div>
                  <label class="block text-xs font-semibold text-text-secondary mb-1">{{ t('search.checkOut') }}</label>
                  <input
                    v-model="searchQuery.checkOut"
                    type="date"
                    :min="minCheckOutDate"
                    class="w-full text-sm font-semibold focus:outline-none bg-transparent text-text-primary cursor-pointer"
                  />
                </div>

                <!-- Guests + Search -->
                <div class="relative">
                  <label class="block text-xs font-semibold text-text-secondary mb-1">{{ t('accommodation.guests') }}</label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="showGuestSelector = !showGuestSelector"
                      class="flex-1 text-sm font-semibold focus:outline-none bg-transparent text-text-primary text-left cursor-pointer flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2"
                    >
                      <span class="truncate">{{ guestSummary }}</span>
                      <svg class="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    <button
                      type="button"
                      @click="handleSearch"
                      class="w-11 h-11 rounded-xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors"
                      :aria-label="t('home.search')"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </button>
                  </div>

                  <!-- Guest Selector Dropdown -->
                  <div v-if="showGuestSelector" class="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl p-4 w-full z-50 border border-gray-200 dark:border-gray-700 shadow-card">
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
      <div class="container mx-auto px-4 py-10">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-end justify-between mb-6">
            <div>
              <h2 class="text-2xl md:text-3xl font-semibold text-text-primary">{{ t('home.latestProperties') }}</h2>
              <p class="text-text-secondary text-sm mt-1">{{ t('home.browseDesc') }}</p>
            </div>
            <router-link to="/accommodations" class="text-sm font-semibold text-brand-600 hover:text-brand-700">
              {{ t('home.browseMore') }}
            </router-link>
          </div>
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <div class="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            <p class="text-text-secondary">Loading properties...</p>
          </div>
          <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <PropertyCard v-for="property in latestProperties" :key="property.id" :property="property" />
          </div>
        </div>
      </div>
    </section>

    <!-- Hosting CTA (kept, simplified) -->
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4 py-10">
        <div class="relative overflow-hidden rounded-2xl max-w-7xl mx-auto">
          <img
            loading="lazy"
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
            alt="Try Hosting"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="relative p-8 md:p-12 max-w-2xl">
            <h2 class="text-2xl md:text-4xl font-semibold text-white">{{ t('home.tryHosting') }}</h2>
            <p class="mt-3 text-white/90 text-sm md:text-base">{{ t('home.tryHostingDesc') }}</p>
            <router-link
              to="/become-host"
              class="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import PropertyCard from '@/components/common/PropertyCard.vue'
import { useTranslation } from '@/composables/useTranslation'
import api from '@/services/api'
import { getCachedAccommodations, setCachedAccommodations } from '@/services/accommodationCache'
import { waitForPreload } from '@/services/preloadData'

const router = useRouter()
const { t } = useTranslation()

const showGuestSelector = ref(false)

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

const extractAccommodations = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

const loadHomeProperties = async () => {
  const params = { limit: 16 }
  
  // Always check cache first for instant display
  const cached = getCachedAccommodations(params)
  if (cached?.data?.length) {
    const all = cached.data
    const take = (start, count) => all.slice(start, start + count)
    const fallback = (items) => (items.length ? items : take(0, 4))

    latestProperties.value = fallback(take(0, 4))
    nearbyProperties.value = fallback(take(4, 4))
    featuredProperties.value = fallback(take(8, 4))
    topRatedProperties.value = [...all]
      .sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0))
      .slice(0, 4)
    isLoading.value = false

    // Background refresh only if stale
    if (!cached.isFresh) {
      api.accommodations.getAll(params)
        .then((fresh) => {
          const freshList = extractAccommodations(fresh)
          if (freshList.length) {
            setCachedAccommodations(params, freshList)
            const t2 = (start, count) => freshList.slice(start, start + count)
            const fb2 = (items) => (items.length ? items : t2(0, 4))

            latestProperties.value = fb2(t2(0, 4))
            nearbyProperties.value = fb2(t2(4, 4))
            featuredProperties.value = fb2(t2(8, 4))
            topRatedProperties.value = [...freshList]
              .sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0))
              .slice(0, 4)
          }
        })
        .catch(() => {})
    }
    return
  }

  // No cache - fetch fresh data
  isLoading.value = true
  try {
    const response = await api.accommodations.getAll(params)
    const all = extractAccommodations(response)
    if (all.length) {
      setCachedAccommodations(params, all)

      const take = (start, count) => all.slice(start, start + count)
      const fallback = (items) => (items.length ? items : take(0, 4))

      latestProperties.value = fallback(take(0, 4))
      nearbyProperties.value = fallback(take(4, 4))
      featuredProperties.value = fallback(take(8, 4))
      topRatedProperties.value = [...all]
        .sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0))
        .slice(0, 4)
    }
  } catch (error) {
    console.error('Failed to load home properties:', error)
  } finally {
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
