<template>
  <MainLayout>
    <!-- Header Search (aligned with Home) -->
    <section class="bg-gray-50 dark:bg-gray-900 pt-10 pb-6">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow-card border border-gray-200/60 dark:border-gray-700 p-3">
            <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div class="relative flex-1 px-2 md:px-4">
                <label class="block text-xs font-semibold mb-1 text-text-secondary">{{ t('nav.accommodations') }}</label>
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('home.search')"
                  class="w-full text-sm font-semibold focus:outline-none placeholder:text-text-muted bg-transparent text-text-primary"
                  @focus="onSearchFocus"
                  @blur="onSearchBlur"
                  @keydown.down.prevent="highlightNextSuggestion"
                  @keydown.up.prevent="highlightPrevSuggestion"
                  @keydown.enter.prevent="onSearchEnter"
                />

                <div
                  v-if="isSearchFocused && searchSuggestions.length"
                  class="absolute left-2 right-2 md:left-4 md:right-4 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-card z-50 overflow-hidden"
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
                class="hidden md:flex w-11 h-11 rounded-xl bg-brand-500 text-white items-center justify-center hover:bg-brand-600 transition-colors flex-shrink-0"
                :aria-label="t('home.search')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white dark:bg-gray-900 min-h-screen">
      <!-- Search Summary Badge -->
      <div v-if="hasSearchSummary" class="mb-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-200 dark:border-brand-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              <h3 class="font-semibold text-brand-700 dark:text-brand-300">{{ t('accommodationList.searchResults') }}</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-if="searchQuery" class="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-sm border border-brand-300 dark:border-brand-700">
                <svg class="w-4 h-4 mr-1.5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <strong class="text-brand-700 dark:text-brand-300">{{ searchQuery }}</strong>
              </span>
              <span v-if="guestCount" class="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-sm border border-brand-300 dark:border-brand-700">
                <svg class="w-4 h-4 mr-1.5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <strong class="text-brand-700 dark:text-brand-300">{{ guestCount }} {{ guestCount === 1 ? 'guest' : 'guests' }}</strong>
              </span>
              <span v-if="checkIn && checkOut" class="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-sm border border-brand-300 dark:border-brand-700">
                <svg class="w-4 h-4 mr-1.5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <strong class="text-brand-700 dark:text-brand-300">{{ formatDateShort(checkIn) }} - {{ formatDateShort(checkOut) }}</strong>
              </span>
            </div>
          </div>
          <button 
            @click="clearSearch" 
            class="ml-4 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 p-1 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
            title="Clear filters"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-sm text-brand-600 dark:text-brand-400 mt-2">
          {{ t('accommodationList.showing') }} <strong>{{ filteredAccommodations.length }}</strong> {{ filteredAccommodations.length === 1 ? 'property' : 'properties' }}
        </p>
      </div>

      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-text-brand-600 mb-2">{{ t('accommodationList.title') }}</h1>
        <p class="text-text-secondary text-sm sm:text-base md:text-lg">{{ t('accommodationList.subtitle') }}</p>
      </div>

      <!-- Filters and Search -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <!-- Filters Sidebar (hidden on mobile) -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-4 sm:p-6 sticky top-24">
            <h3 class="font-semibold text-base sm:text-lg mb-4 text-text-primary">{{ t('accommodationList.filters') }}</h3>
            
            <!-- View Toggle -->
            <div class="mb-4 sm:mb-6">
              <div class="flex gap-2">
                <button 
                  @click="viewMode = 'list'"
                  :class="viewMode === 'list' ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-secondary hover:bg-gray-300 dark:hover:bg-gray-600'"
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
                  :max="priceRangeMax"
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
        <div class="col-span-1 lg:col-span-4">
          <!-- Loading Spinner -->
          <div v-if="loading && !accommodations.length" class="flex flex-col items-center justify-center py-20">
            <div class="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            <h2 class="text-xl font-semibold text-text-primary mb-2">Loading Properties</h2>
            <p class="text-text-secondary">Finding the best accommodations for you...</p>
          </div>

          <!-- Results Header -->
          <div v-else>
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
              :selectedPropertyId="selectedMapPropertyId"
              @selectProperty="handleMapSelect"
              @openDetails="handleMapOpenDetails"
              @locationSearch="handleLocationSearch"
            />
          </div>

          <!-- Grid View (2 rows x 5 columns) -->
          <div v-if="viewMode === 'list'">
            <!-- Loading State -->
            <div v-if="loading" class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
              <PropertyCardSkeleton v-for="n in 10" :key="`skeleton-${n}`" />
            </div>
            
            <!-- Loaded State: Grid Layout -->
            <div v-else class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
              <PropertyCard
                v-for="property in filteredAccommodations"
                :key="property.id"
                :property="property"
                @click="goToDetails(property.id)"
              />
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredAccommodations.length === 0" class="text-center py-12 sm:py-16">
            <svg class="w-20 h-20 sm:w-24 sm:h-24 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <h3 class="text-lg sm:text-xl font-semibold text-text-brand-600 mb-2">{{ t('accommodationList.noPropertiesFound') }}</h3>
            <p class="text-text-secondary mb-4 text-sm sm:text-base">{{ t('accommodationList.adjustFilters') }}</p>
            <button @click="resetFilters" class="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all duration-200 font-medium transform hover:scale-105">
              {{ t('accommodationList.resetFilters') }}
            </button>
          </div>
          </div><!-- Close v-else -->
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCurrencyStore } from '../../stores/currency'
import { useUserStore } from '../../stores/userStore'
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast.js'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import MapView from '../../components/common/MapView.vue'
import PropertyCard from '@/components/common/PropertyCard.vue'
import PropertyCardSkeleton from '@/components/common/PropertyCardSkeleton.vue'
import api from '../../services/api'
import { getCachedAccommodations, setCachedAccommodations } from '@/services/accommodationCache'
import fastFetch from '@/services/fastFetch'

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
const selectedMapPropertyId = ref(null)
const checkOut = ref('')

const isSearchFocused = ref(false)
const highlightedSuggestionIndex = ref(-1)

const normalizeForSuggestions = (value) => String(value || '').trim()
const buildSuggestionList = (rows, query, fields) => {
  const q = String(query || '').trim().toLowerCase()
  if (q.length < 2) return []

  const results = []
  const seen = new Set()

  for (const row of rows || []) {
    for (const field of fields) {
      const raw = normalizeForSuggestions(row?.[field])
      if (!raw) continue
      const key = raw.toLowerCase()
      if (seen.has(key)) continue

      const lower = key
      if (!lower.includes(q)) continue

      const score = lower.startsWith(q) ? 2 : 1
      results.push({ value: raw, score })
      seen.add(key)
    }
  }

  results.sort((a, b) => (b.score - a.score) || a.value.localeCompare(b.value))
  return results.slice(0, 6).map(r => r.value)
}

const searchSuggestions = computed(() => {
  return buildSuggestionList(accommodations.value || [], searchQuery.value, ['name', 'location', 'type'])
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

const applySuggestion = async (suggestion) => {
  searchQuery.value = suggestion
  isSearchFocused.value = false
  highlightedSuggestionIndex.value = -1
  await performSearch()
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

const onSearchEnter = async () => {
  if (isSearchFocused.value && highlightedSuggestionIndex.value >= 0) {
    const suggestion = searchSuggestions.value[highlightedSuggestionIndex.value]
    if (suggestion) {
      await applySuggestion(suggestion)
      return
    }
  }

  await performSearch()
}

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

const applyLoadedAccommodations = (list, term = '') => {
  const safeList = Array.isArray(list) ? list : []
  accommodations.value = safeList.map(acc => ({
    ...acc,
    eco: acc.ecoFriendly,
    isFavorite: false,
    matchScore: computeMatchScore(acc, term)
  }))
}

const loadAccommodations = async (params = {}) => {
  const term = String(params.q ?? params.search ?? '').trim()
  
  try {
    loading.value = true
    
    // Ultra-fast fetch with smart caching
    const result = await fastFetch.fetchAccommodations({ 
      ...params, 
      limit: params.limit || 30,
      minimal: false // Full details for listing page
    })
    
    const list = result.data || []
    
    if (list.length) {
      applyLoadedAccommodations(list, term)
      
      // Prefetch next batch in background
      if (list.length >= 20) {
        setTimeout(() => fastFetch.prefetchNextPage(params), 500)
      }
    }
    
    loading.value = false
  } catch (error) {
    console.error('Failed to load accommodations:', error)
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

const priceRangeMax = computed(() => {
  const list = accommodations.value || []
  if (!list.length) return 500

  let max = 0
  for (const acc of list) {
    const price = Number(acc?.price)
    if (Number.isFinite(price) && price > max) max = price
  }

  return max > 0 ? max : 500
})

const hasInitializedPriceFilter = ref(false)
watch(
  () => (accommodations.value || []).length,
  (len) => {
    if (hasInitializedPriceFilter.value) return
    if (!len) return
    filters.value.maxPrice = priceRangeMax.value
    hasInitializedPriceFilter.value = true
  }
)

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
    // Price filter
    if (acc.price > filters.value.maxPrice) return false
    
    // Property type filter
    if (filters.value.propertyTypes.length > 0 && !filters.value.propertyTypes.includes(acc.type)) return false
    
    // Rating filter
    if (acc.rating < filters.value.minRating) return false
    
    // Eco-friendly filter
    if (filters.value.ecoFriendly && !acc.eco) return false
    
    // Amenities filter
    if (filters.value.amenities.length > 0) {
      const hasAllAmenities = filters.value.amenities.every(amenity => 
        acc.amenities.includes(amenity)
      )
      if (!hasAllAmenities) return false
    }
    
    // Guest capacity filter (from search params)
    if (guestCount.value && Number.isFinite(guestCount.value)) {
      const maxGuests = Number(acc.guests || acc.maxGuests || acc.capacity || 2)
      if (maxGuests < guestCount.value) return false
    }
    
    // Location filter (from search params)
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const location = String(acc.location || '').toLowerCase()
      const name = String(acc.name || '').toLowerCase()
      const city = String(acc.city || '').toLowerCase()
      
      const matchesLocation = location.includes(query) || 
                             name.includes(query) || 
                             city.includes(query)
      
      if (!matchesLocation) return false
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

// Format date for display
const formatDateShort = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Clear all search parameters
const clearSearch = () => {
  searchQuery.value = ''
  guestCount.value = null
  checkIn.value = ''
  checkOut.value = ''
  router.replace({ query: {} })
  loadAccommodations()
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
    maxPrice: priceRangeMax.value,
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

const handleMapSelect = (property) => {
  selectedMapPropertyId.value = property?.id ?? null
}

const handleMapOpenDetails = (property) => {
  if (!property?.id) return
  goToDetails(property.id)
}

const handleLocationSearch = (location) => {
  console.log('Searching for location:', location)
  // Implement location-based search filtering here
}

watch(viewMode, (mode) => {
  if (mode !== 'map') selectedMapPropertyId.value = null
})

watch(
  () => filteredAccommodations.value,
  (list) => {
    if (!selectedMapPropertyId.value) return
    const stillExists = list.some((p) => String(p?.id) === String(selectedMapPropertyId.value))
    if (!stillExists) selectedMapPropertyId.value = null
  },
  { deep: true }
)

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

// Initialize: Load accommodations on mount
onMounted(async () => {
  const q = String(route.query.q || route.query.search || '').trim()
  const guests = route.query.guests ? parseInt(route.query.guests, 10) : null
  const inDate = String(route.query.checkIn || '').trim()
  const outDate = String(route.query.checkOut || '').trim()

  if (q) searchQuery.value = q
  if (Number.isFinite(guests) && guests > 0) guestCount.value = guests
  if (inDate) checkIn.value = inDate
  if (outDate) checkOut.value = outDate

  await loadAccommodations({
    q: q || undefined,
    guests: guests || undefined,
    checkIn: inDate || undefined,
    checkOut: outDate || undefined
  })
})

// Watch for route changes
watch(() => route.query, (newQuery) => {
  const q = String(newQuery.q || newQuery.search || '').trim()
  const guests = newQuery.guests ? parseInt(newQuery.guests, 10) : null
  const inDate = String(newQuery.checkIn || '').trim()
  const outDate = String(newQuery.checkOut || '').trim()

  if (q) searchQuery.value = q
  if (Number.isFinite(guests) && guests > 0) guestCount.value = guests
  if (inDate) checkIn.value = inDate
  if (outDate) checkOut.value = outDate

  loadAccommodations({
    q: q || undefined,
    guests: guests || undefined,
    checkIn: inDate || undefined,
    checkOut: outDate || undefined
  })
}, { deep: true })</script>