<template>
  <MainLayout>
    <!-- Search Bar Section -->
    <div class="w-full py-12 bg-white dark:bg-gray-900" style="margin-top: 80px;">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="bg-white dark:bg-gray-800 rounded-[20px] md:rounded-[35px] shadow-2xl p-3 md:p-2 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0" style="min-height: 70px;">
          <div class="flex-1 px-2 md:px-6">
            <label class="block text-xs font-bold mb-1.5 dark:text-gray-200" style="font-family: Montserrat, sans-serif; color: #484848; font-size: 12px;">{{ t('nav.accommodations') }}</label>
            <input 
              v-model="searchQuery"
              type="text" 
              :placeholder="t('home.search')"
              class="w-full text-sm font-semibold focus:outline-none placeholder-gray-400 bg-transparent dark:text-gray-200"
              style="font-family: Montserrat, sans-serif; color: #484848; font-size: 14px;"
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
        <h1 class="text-2xl sm:text-3xl font-bold text-text-brand-600 dark:text-white mb-2">Find Your Perfect Stay</h1>
        <p class="text-text-secondary dark:text-gray-300 text-sm sm:text-base md:text-lg">Discover amazing accommodations across Rwanda and Africa</p>
      </div>

      <!-- Filters and Search -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card p-4 sm:p-6 sticky top-24">
            <h3 class="font-semibold text-base sm:text-lg mb-4 dark:text-white">Filters</h3>
            
            <!-- View Toggle -->
            <div class="mb-4 sm:mb-6">
              <div class="flex gap-2">
                <button 
                  @click="viewMode = 'list'"
                  :class="viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-text-brand-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'"
                  class="flex-1 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
                <button 
                  @click="viewMode = 'map'"
                  :class="viewMode === 'map' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-text-brand-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'"
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
              <label class="block text-xs sm:text-sm font-medium mb-3">Price Range (per night)</label>
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
              <label class="block text-sm font-medium mb-3">Property Type</label>
              <div class="space-y-2">
                <label v-for="type in propertyTypes" :key="type" class="flex items-center">
                  <input 
                    type="checkbox" 
                    :value="type"
                    v-model="filters.propertyTypes"
                    class="rounded border-gray-300 text-brand-600 focus:ring-brand-500 mr-2"
                  />
                  <span class="text-sm">{{ type }}</span>
                </label>
              </div>
            </div>

            <!-- Rating -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-3">Minimum Rating</label>
              <div class="flex gap-2">
                <button
                  v-for="rating in [3, 4, 4.5]"
                  :key="rating"
                  @click="filters.minRating = rating"
                  :class="filters.minRating === rating ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-text-brand-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'"
                  class="flex-1 py-2 px-3 rounded-button text-sm transition-colors"
                >
                  {{ rating }}+⭐
                </button>
              </div>
            </div>

            <!-- Amenities -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-3">Amenities</label>
              <div class="space-y-2">
                <label v-for="amenity in amenities" :key="amenity" class="flex items-center">
                  <input 
                    type="checkbox" 
                    :value="amenity"
                    v-model="filters.amenities"
                    class="rounded border-gray-300 text-brand-600 focus:ring-brand-500 mr-2"
                  />
                  <span class="text-sm">{{ amenity }}</span>
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
                <span class="text-sm font-medium text-brand-600">Eco-Friendly Only</span>
              </label>
            </div>

            <button 
              @click="resetFilters"
              class="w-full px-4 py-2 border-2 border-gray-300 text-text-brand-600 rounded-lg hover:border-brand-500 hover:text-brand-600 transition-all duration-200 font-medium text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Listings -->
        <div class="lg:col-span-4">
          <!-- Results Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <p class="text-text-secondary text-sm sm:text-base">
              <span class="font-semibold text-text-brand-600">{{ filteredAccommodations.length }}</span> properties found
            </p>
            <select v-model="sortBy" class="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 text-sm sm:text-base">
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
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
            <div 
              v-for="accommodation in sortedAccommodations" 
              :key="accommodation.id"
              @click="router.push(`/accommodation/${accommodation.id}`)"
              class="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-1"
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
                    class="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <svg 
                      class="w-6 h-6" 
                      :class="accommodation.isFavorite ? 'text-brand-600 fill-current' : 'text-gray-400 dark:text-gray-500'"
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
                    Eco
                  </div>
                </div>

                <!-- Content -->
                <div class="md:col-span-2 p-6">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="text-xl font-semibold text-text-brand-600">{{ accommodation.name }}</h3>
                        <span class="inline-flex items-center px-2 py-1 bg-brand-500 bg-opacity-10 text-brand-600 text-xs font-semibold rounded">
                          {{ accommodation.type }}
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
                        <span class="text-yellow-500">⭐</span>
                      </div>
                      <p class="text-xs text-text-secondary">{{ accommodation.reviews }} reviews</p>
                    </div>
                  </div>

                  <p class="text-text-secondary mb-4">{{ accommodation.description }}</p>

                  <!-- Amenities -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span 
                      v-for="amenity in accommodation.amenities.slice(0, 4)" 
                      :key="amenity"
                      class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 text-xs rounded"
                    >
                      {{ amenity }}
                    </span>
                    <span v-if="accommodation.amenities.length > 4" class="px-2 py-1 text-text-secondary text-xs">
                      +{{ accommodation.amenities.length - 4 }} more
                    </span>
                  </div>

                  <!-- Price and CTA -->
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-4 border-t border-gray-100">
                    <div>
                      <div class="flex items-baseline gap-1 flex-wrap">
                        <span class="text-xl sm:text-2xl font-bold text-brand-600">{{ currencyStore.formatPrice(accommodation.price) }}</span>
                        <span class="text-text-secondary text-sm sm:text-base whitespace-nowrap">/night</span>
                      </div>
                      <p class="text-xs text-text-secondary">Includes taxes and fees</p>
                    </div>
                    <div class="flex gap-2 w-full sm:w-auto">
                      <button 
                        @click.stop="addToCart(accommodation)"
                        class="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-brand-500 text-brand-600 rounded-lg hover:bg-brand-50 transition-all duration-200 font-medium text-sm sm:text-base flex items-center justify-center gap-1"
                      >
                        {{ t('accommodation.addToCart') }}
                      </button>
                      <button 
                        @click.stop="router.push(`/accommodation/${accommodation.id}`)"
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

          <!-- Empty State -->
          <div v-if="filteredAccommodations.length === 0" class="text-center py-12 sm:py-16">
            <svg class="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <h3 class="text-lg sm:text-xl font-semibold text-text-brand-600 mb-2">No properties found</h3>
            <p class="text-text-secondary mb-4 text-sm sm:text-base">Try adjusting your filters to see more results</p>
            <button @click="resetFilters" class="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium transform hover:scale-105">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrencyStore } from '../../stores/currency'
import { useUserStore } from '../../stores/userStore'
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast.js'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import MapView from '../../components/common/MapView.vue'
import api from '../../services/api'

const router = useRouter()
const { success } = useToast()
const currencyStore = useCurrencyStore()
const userStore = useUserStore()
const { t } = useTranslation()

const viewMode = ref('list')
const sortBy = ref('recommended')
const searchQuery = ref('')
const loading = ref(true)

const performSearch = async () => {
  if (searchQuery.value.trim()) {
    loading.value = true
    try {
      const response = await api.accommodations.getAll({ search: searchQuery.value })
      accommodations.value = response.data.map(acc => ({
        ...acc,
        eco: acc.ecoFriendly,
        isFavorite: false
      }))
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      loading.value = false
    }
  }
}

const filters = ref({
  maxPrice: 500,
  propertyTypes: [],
  minRating: 0,
  amenities: [],
  ecoFriendly: false
})

const propertyTypes = ['Hotel', 'Resort', 'Apartment', 'Villa', 'Lodge', 'Guesthouse']
const amenities = ['WiFi', 'Pool', 'Parking', 'Restaurant', 'Spa', 'Gym', 'Air Conditioning', 'Pet Friendly']

const accommodations = ref([])

// Load accommodations on mount
onMounted(async () => {
  try {
    const response = await api.accommodations.getAll()
    accommodations.value = response.data.map(acc => ({
      ...acc,
      eco: acc.ecoFriendly,
      isFavorite: false
    }))
  } catch (error) {
    console.error('Failed to load accommodations:', error)
  } finally {
    loading.value = false
  }
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

const sortedAccommodations = computed(() => {
  const sorted = [...filteredAccommodations.value]
  
  switch (sortBy.value) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    default:
      return sorted
  }
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
  router.push(`/accommodation/${property.id}`)
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
  success(`${accommodation.name} added to cart!`)
}
</script>
