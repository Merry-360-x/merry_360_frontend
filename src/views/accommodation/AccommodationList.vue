<template>
  <MainLayout>
    <!-- Search Bar Section -->
    <div class="w-full py-12 bg-white dark:bg-gray-900" style="margin-top: 80px;">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="bg-white dark:bg-gray-800 rounded-[20px] md:rounded-[35px] shadow-2xl p-3 md:p-2 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0" style="min-height: 70px;">
          <div class="flex-1 px-2 md:px-6">
            <label class="block text-xs font-bold mb-1.5 text-text-secondary" style="font-family: Montserrat, sans-serif; font-size: 12px;">{{ t('nav.accommodations') }}</label>
            <input 
              v-model="searchQuery"
              type="text" 
              :placeholder="t('home.search')"
              class="w-full text-sm font-semibold focus:outline-none placeholder:text-text-muted bg-transparent text-text-primary"
              style="font-family: Montserrat, sans-serif; font-size: 14px;"
              @keyup.enter="performSearch"
            />
          </div>
          <button 
            @click="performSearch"
            class="w-full md:w-[54px] h-[54px] rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 flex-shrink-0 md:mr-2 shadow-lg"
            style="background: #FE4F4F;"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white dark:bg-gray-900 min-h-screen">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-text-brand-600 mb-2">{{ t('accommodationList.title') }}</h1>
        <p class="text-text-secondary text-sm sm:text-base md:text-lg">{{ t('accommodationList.subtitle') }}</p>
      </div>

      <!-- Filters and Search -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-4 sm:p-6 sticky top-24">
            <h3 class="font-semibold text-base sm:text-lg mb-4 text-text-primary">{{ t('accommodationList.filters') }}</h3>
            
            <!-- View Toggle -->
            <div class="mb-4 sm:mb-6">
              <div class="flex gap-2">
                <button 
                  @click="viewMode = 'list'"
                  :class="viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-secondary hover:bg-gray-300 dark:hover:bg-gray-600'"
                  class="flex-1 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
                <button 
                  @click="viewMode = 'map'"
                  :class="viewMode === 'map' ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-secondary hover:bg-gray-300 dark:hover:bg-gray-600'"
                  class="flex-1 py-2 rounded-button transition-colors"
                >
                  <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-4 sm:mb-6">
              <label class="block text-xs sm:text-sm font-medium mb-3 text-text-primary">{{ t('accommodationList.priceRangePerNight') }}</label>
              <div class="space-y-2">
                <input 
                  type="range" 
                  v-model="filters.maxPrice" 
                  min="0" 
                  max="500" 
                  class="w-full"
                />
                <div class="flex justify-between text-sm text-text-secondary">
                  <span>{{ currencyStore.formatPrice(0) }}</span>
                  <span class="font-semibold text-brand-600">{{ currencyStore.formatPrice(filters.maxPrice) }}</span>
                </div>
              </div>
            </div>

            <!-- Property Type -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-3 text-text-primary">{{ t('accommodationList.propertyType') }}</label>
              <div class="space-y-2">
                <label v-for="type in propertyTypes" :key="type" class="flex items-center">
                  <input 
                    type="checkbox" 
                    :value="type"
                    v-model="filters.propertyTypes"
                    class="rounded border-gray-300 text-brand-600 focus:ring-brand-500 mr-2"
                  />
                  <span class="text-sm text-text-secondary">{{ t(propertyTypeLabelKey[type] || type) }}</span>
                </label>
              </div>
            </div>

            <!-- Rating -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-3 text-text-primary">{{ t('accommodationList.minimumRating') }}</label>
              <div class="flex items-center gap-1">
                <button
                  v-for="i in 5"
                  :key="i"
                  type="button"
                  @click="filters.minRating = i"
                  class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  :class="i <= filters.minRating ? 'text-yellow-500' : 'text-text-muted'"
                  :aria-label="t('accommodationList.minimumRatingStars', { stars: i })"
                  :title="t('accommodationList.minimumRatingStars', { stars: i })"
                >
                  <svg
                    v-if="i <= filters.minRating"
                    class="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    aria-hidden="true"
                  >
                    <path d="M10 2.75l2.02 4.27 4.73.36-3.6 3.02 1.1 4.6L10 12.65 5.75 15l1.1-4.6-3.6-3.02 4.73-.36L10 2.75z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Amenities -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-3 text-text-primary">{{ t('accommodation.amenities') }}</label>
              <div class="space-y-2">
                <label v-for="amenity in amenities" :key="amenity" class="flex items-center">
                  <input 
                    type="checkbox" 
                    :value="amenity"
                    v-model="filters.amenities"
                    class="rounded border-gray-300 text-brand-600 focus:ring-brand-500 mr-2"
                  />
                  <span class="text-sm text-text-secondary">{{ amenity }}</span>
                </label>
              </div>
            </div>

            <!-- Sustainability Filter -->
            <div class="mb-4 sm:mb-6">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="filters.ecoFriendly"
                  class="rounded border-gray-300 text-brand-500 focus:ring-brand-500 mr-2"
                />
                <span class="text-sm font-medium text-brand-600">{{ t('accommodationList.ecoFriendlyOnly') }}</span>
              </label>
            </div>

            <button 
              @click="resetFilters"
              class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 text-text-brand-600 rounded-lg hover:border-brand-500 hover:text-brand-600 transition-all duration-200 font-medium text-sm"
            >
              {{ t('accommodationList.resetFilters') }}
            </button>
          </div>
        </div>

        <!-- Listings -->
        <div class="lg:col-span-4">
          <!-- Results Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <p class="text-text-secondary text-sm sm:text-base">
              <span class="font-semibold text-text-brand-600">{{ filteredAccommodations.length }}</span> {{ t('accommodationList.propertiesFound') }}
            </p>
            <select v-model="sortBy" class="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-text-primary text-sm sm:text-base">
              <option value="recommended">{{ t('accommodationList.sortRecommended') }}</option>
              <option value="price-low">{{ t('accommodationList.sortPriceLow') }}</option>
              <option value="price-high">{{ t('accommodationList.sortPriceHigh') }}</option>
              <option value="rating">{{ t('accommodationList.sortHighestRated') }}</option>
            </select>
          </div>

          <p class="text-text-secondary text-xs sm:text-sm mb-5">
            {{ t('accommodationList.groupingNote') }}
          </p>

          <div v-if="hasSearchSummary" class="mb-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-text-secondary">
            <span>{{ t('accommodationList.searchingFor') }}</span>
            <span v-if="searchQuery" class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{{ searchQuery }}</span>
            <span v-if="guestCount" class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{{ guestCount }} {{ t(guestCount === 1 ? 'accommodationList.guestSingular' : 'accommodationList.guestPlural') }}</span>
            <span v-if="checkIn" class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{{ t('accommodationList.checkInLabel') }} {{ checkIn }}</span>
            <span v-if="checkOut" class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{{ t('accommodationList.checkOutLabel') }} {{ checkOut }}</span>
          </div>

          <!-- Map View -->
          <div v-if="viewMode === 'map'" class="mb-6">
            <MapView 
              :properties="filteredAccommodations"
              @selectProperty="handlePropertySelect"
              @locationSearch="handleLocationSearch"
            />
          </div>

          <!-- List View -->
          <div v-if="viewMode === 'list'" class="space-y-4 sm:space-y-6">
            <div v-for="group in groupedAccommodations" :key="group.type" class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-base sm:text-lg font-semibold text-text-brand-600">{{ t(propertyTypeLabelKey[group.type] || group.type) }}</h3>
                <p class="text-xs sm:text-sm text-text-secondary">
                  {{ group.items.length }} {{ t(group.items.length === 1 ? 'accommodationList.listingSingular' : 'accommodationList.listingPlural') }}
                </p>
              </div>

              <div 
                v-for="accommodation in group.items" 
                :key="accommodation.id"
                @click="goToDetails(accommodation.id)"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-1"
              >
                <div class="grid md:grid-cols-3 gap-0">
                  <!-- Image -->
                  <div class="relative h-56 sm:h-64 md:h-auto">
                    <img loading="lazy" 
                      :src="accommodation.image" 
                      :alt="accommodation.name" 
                      class="w-full h-full object-cover"
                    />
                    <button 
                      @click.stop="toggleFavorite(accommodation.id)"
                      class="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <svg 
                        class="w-6 h-6" 
                        :class="accommodation.isFavorite ? 'text-brand-600 fill-current' : 'text-text-muted'"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </button>
                    <div v-if="accommodation.eco" class="absolute top-3 left-3 bg-success text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-10a4 4 0 100 8 4 4 0 000-8z"/>
                      </svg>
                      {{ t('accommodationList.eco') }}
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="md:col-span-2 p-6">
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <h3 class="text-xl font-semibold text-text-brand-600">{{ accommodation.name }}</h3>
                          <span class="inline-flex items-center px-2 py-1 bg-brand-500 bg-opacity-10 text-brand-600 text-xs font-semibold rounded">
                            {{ t(propertyTypeLabelKey[accommodation.type] || accommodation.type) }}
                          </span>
                        </div>
                        <p class="text-text-secondary text-sm flex items-center">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {{ accommodation.location }}
                        </p>
                      </div>
                      <div class="text-right">
                        <div class="flex items-center gap-1 mb-1">
                          <span class="text-lg font-bold text-text-brand-600">{{ accommodation.rating }}</span>
                            <svg class="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <p class="text-xs text-text-secondary">{{ t('accommodationList.reviewsCount', { count: accommodation.reviews }) }}</p>
                      </div>
                    </div>

                    <p class="text-text-secondary mb-4">{{ accommodation.description }}</p>

                    <!-- Amenities -->
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span 
                        v-for="amenity in accommodation.amenities.slice(0, 4)" 
                        :key="amenity"
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-text-secondary text-xs rounded"
                      >
                        {{ amenity }}
                      </span>
                      <span v-if="accommodation.amenities.length > 4" class="px-2 py-1 text-text-secondary text-xs">
                        {{ t('accommodationList.moreAmenities', { count: accommodation.amenities.length - 4 }) }}
                      </span>
                    </div>

                    <!-- Price and CTA -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <div class="flex items-baseline gap-1 flex-wrap">
                          <span class="text-xl sm:text-2xl font-bold text-brand-600">{{ currencyStore.formatPrice(accommodation.price) }}</span>
                          <span class="text-text-secondary text-sm sm:text-base whitespace-nowrap">{{ t('accommodationList.perNightShort') }}</span>
                        </div>
                        <p class="text-xs text-text-secondary">{{ t('accommodationList.includesTaxesAndFees') }}</p>
                      </div>
                      <div class="flex gap-2 w-full sm:w-auto">
                        <button 
                          @click.stop="addToCart(accommodation)"
                          class="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-brand-500 text-brand-600 rounded-lg hover:bg-brand-50 transition-all duration-200 font-medium text-sm sm:text-base flex items-center justify-center gap-1"
                        >
                          {{ t('accommodation.addToCart') }}
                        </button>
                        <button 
                          @click.stop="goToDetails(accommodation.id)"
                          class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-brand-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium text-sm sm:text-base transform hover:scale-105"
                        >
                          {{ t('accommodation.details') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredAccommodations.length === 0" class="text-center py-12 sm:py-16">
            <svg class="w-20 h-20 sm:w-24 sm:h-24 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <h3 class="text-lg sm:text-xl font-semibold text-text-brand-600 mb-2">{{ t('accommodationList.noPropertiesFound') }}</h3>
            <p class="text-text-secondary mb-4 text-sm sm:text-base">{{ t('accommodationList.adjustFilters') }}</p>
            <button @click="resetFilters" class="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium transform hover:scale-105">
              {{ t('accommodationList.resetFilters') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCurrencyStore } from '../../stores/currency'
import { useUserStore } from '../../stores/userStore'
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast.js'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import MapView from '../../components/common/MapView.vue'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()
const { success } = useToast()
const currencyStore = useCurrencyStore()
const userStore = useUserStore()
const { t } = useTranslation()

const viewMode = ref('list')
const sortBy = ref('recommended')
const searchQuery = ref('')
const loading = ref(true)
const guestCount = ref(null)
const checkIn = ref('')
const checkOut = ref('')

const buildSearchQuery = () => {
  const q = String(searchQuery.value || '').trim()
  const guests = guestCount.value
  const inDate = String(checkIn.value || '').trim()
  const outDate = String(checkOut.value || '').trim()

  return {
    ...(q ? { q } : {}),
    ...(Number.isFinite(guests) && guests > 0 ? { guests: String(guests) } : {}),
    ...(inDate ? { checkIn: inDate } : {}),
    ...(outDate ? { checkOut: outDate } : {})
  }
}

const goToDetails = (id) => {
  router.push({ path: `/accommodation/${id}`, query: buildSearchQuery() })
}

const hasSearchSummary = computed(() => {
  return Boolean(
    String(searchQuery.value || '').trim() ||
    guestCount.value ||
    String(checkIn.value || '').trim() ||
    String(checkOut.value || '').trim()
  )
})

const computeMatchScore = (acc, term) => {
  const q = String(term || '').trim().toLowerCase()
  if (!q) return 0

  const haystack = [acc?.name, acc?.location, acc?.type]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (!haystack) return 0

  // Lightweight ranking: phrase match > token match
  let score = 0
  if (haystack.includes(q)) score += 50

  const tokens = q.split(/\s+/).filter(Boolean)
  for (const token of tokens) {
    if (token.length < 2) continue
    if (haystack.includes(token)) score += 10
  }

  return score
}

const loadAccommodations = async (params = {}) => {
  loading.value = true
  try {
    const response = await api.accommodations.getAll(params)
    const term = String(params.q ?? params.search ?? '').trim()
    accommodations.value = response.data.map(acc => ({
      ...acc,
      eco: acc.ecoFriendly,
      isFavorite: false,
      matchScore: computeMatchScore(acc, term)
    }))
  } catch (error) {
    console.error('Failed to load accommodations:', error)
  } finally {
    loading.value = false
  }
}

const performSearch = async () => {
  const q = String(searchQuery.value || '').trim()
  const guests = guestCount.value
  const inDate = String(checkIn.value || '').trim()
  const outDate = String(checkOut.value || '').trim()

  const hasAnySearch = Boolean(
    q ||
    (Number.isFinite(guests) && guests > 0) ||
    inDate ||
    outDate
  )

  if (!hasAnySearch) return

  router.replace({
    query: buildSearchQuery()
  })

  await loadAccommodations({
    q: q || undefined,
    guests: Number.isFinite(guests) && guests > 0 ? guests : undefined,
    checkIn: inDate || undefined,
    checkOut: outDate || undefined
  })
}

const filters = ref({
  maxPrice: 500,
  propertyTypes: [],
  minRating: 0,
  amenities: [],
  ecoFriendly: false
})

const propertyTypes = ['Hotel', 'Motel', 'Resort', 'Lodge', 'Apartment', 'Villa', 'Guesthouse']
const propertyTypeLabelKey = {
  Hotel: 'accommodation.hotel',
  Motel: 'accommodation.motel',
  Resort: 'accommodation.resort',
  Lodge: 'accommodation.lodge',
  Apartment: 'accommodation.apartment',
  Villa: 'accommodation.villa',
  Guesthouse: 'accommodation.guesthouse',
  Other: 'accommodation.other'
}
const amenities = ['WiFi', 'Pool', 'Parking', 'Restaurant', 'Spa', 'Gym', 'Air Conditioning', 'Pet Friendly']

const accommodations = ref([])

// Load accommodations on mount
onMounted(async () => {
  const q = route.query.q != null ? String(route.query.q).trim() : ''
  const guests = route.query.guests != null && String(route.query.guests).trim()
    ? Number(route.query.guests)
    : null

  const inDate = route.query.checkIn != null ? String(route.query.checkIn).trim() : ''
  const outDate = route.query.checkOut != null ? String(route.query.checkOut).trim() : ''

  searchQuery.value = q
  guestCount.value = Number.isFinite(guests) && guests > 0 ? guests : null
  checkIn.value = inDate
  checkOut.value = outDate

  await loadAccommodations({
    q: q || undefined,
    guests: guestCount.value || undefined,
    checkIn: inDate || undefined,
    checkOut: outDate || undefined
  })
})

const filteredAccommodations = computed(() => {
  return accommodations.value.filter(acc => {
    if (acc.price > filters.value.maxPrice) return false
    if (filters.value.propertyTypes.length > 0 && !filters.value.propertyTypes.includes(acc.type)) return false
    if (acc.rating < filters.value.minRating) return false
    if (filters.value.ecoFriendly && !acc.eco) return false
    if (filters.value.amenities.length > 0) {
      const hasAllAmenities = filters.value.amenities.every(amenity => 
        acc.amenities.includes(amenity)
      )
      if (!hasAllAmenities) return false
    }
    return true
  })
})

const sortItems = (items) => {
  const sorted = [...items]

  switch (sortBy.value) {
    case 'price-low':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
    case 'price-high':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    default:
      // Recommended: use matchScore when searching, else fall back to newest
      return sorted.sort((a, b) => {
        const score = (b.matchScore || 0) - (a.matchScore || 0)
        if (score !== 0) return score
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0
        return bTime - aTime
      })
  }
}

const groupedAccommodations = computed(() => {
  const groups = new Map()

  for (const type of propertyTypes) {
    groups.set(type, [])
  }
  groups.set('Other', [])

  for (const acc of filteredAccommodations.value) {
    const type = propertyTypes.includes(acc.type) ? acc.type : 'Other'
    groups.get(type).push(acc)
  }

  return Array.from(groups.entries())
    .map(([type, list]) => ({ type, items: sortItems(list) }))
    .filter(group => group.items.length > 0)
})

const resetFilters = () => {
  filters.value = {
    maxPrice: 500,
    propertyTypes: [],
    minRating: 0,
    amenities: [],
    ecoFriendly: false
  }
}

const toggleFavorite = (id) => {
  const accommodation = accommodations.value.find(acc => acc.id === id)
  if (accommodation) {
    accommodation.isFavorite = !accommodation.isFavorite
  }
}

const handlePropertySelect = (property) => {
  goToDetails(property.id)
}

const handleLocationSearch = (location) => {
  console.log('Searching for location:', location)
  // Implement location-based search filtering here
}

const addToCart = (accommodation) => {
  const cartItem = {
    id: accommodation.id,
    type: 'accommodation',
    name: accommodation.name,
    location: accommodation.location,
    price: accommodation.price,
    image: accommodation.image,
    rating: accommodation.rating
  }
  userStore.addToCart(cartItem)
  success(t('common.addedToCart', { item: accommodation.name }))
}
</script>
