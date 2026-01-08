<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <!-- Back Button -->
      <button @click="router.back()" class="flex items-center text-sm text-text-secondary hover:text-brand-600 dark:text-brand-400 mb-6 transition-colors">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to transport
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Gallery -->
          <div class="grid grid-cols-4 gap-2 rounded-card overflow-hidden">
            <div class="col-span-4 row-span-2 h-96 relative bg-gray-200 dark:bg-gray-700">
              <div
                v-if="!mainImageLoaded || mainImageError || !vehicle.mainImage"
                class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-yellow-400 to-sky-600"
              >
                <div class="text-center animate-pulse">
                  <div class="w-16 h-16 mx-auto rounded-full bg-white/30 backdrop-blur-sm mb-3 flex items-center justify-center">
                    <span class="text-white font-extrabold text-lg">RW</span>
                  </div>
                  <p class="text-white font-semibold">Rwanda</p>
                </div>
              </div>
              <img 
                loading="eager"
                fetchpriority="high"
                decoding="async"
                :src="vehicle.mainImage" 
                :alt="vehicle.name" 
                @load="handleMainImageLoad"
                @error="handleMainImageError"
                class="w-full h-full object-cover"
                v-show="mainImageLoaded && !mainImageError && vehicle.mainImage"
              />
            </div>
            <div v-for="(img, index) in vehicle.gallery" :key="index" class="h-32 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
              <div
                v-if="!galleryLoaded[index] || galleryError[index]"
                class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-yellow-400 to-sky-600"
              >
                <div class="text-center animate-pulse">
                  <span class="text-white font-bold text-xs">Rwanda</span>
                </div>
              </div>
              <img 
                loading="lazy" 
                decoding="async"
                :src="img" 
                :alt="`Gallery ${index + 1}`" 
                @load="() => handleGalleryLoad(index)"
                @error="() => handleGalleryError(index)"
                class="w-full h-full object-cover"
                v-show="galleryLoaded[index] && !galleryError[index]"
              />
            </div>
          </div>

          <!-- Header Info -->
          <Card padding="lg">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h1 class="text-2xl font-bold text-text-brand-600">{{ vehicle.name }}</h1>
                  <span v-if="vehicle.driver_included" class="px-3 py-1 bg-green-500 bg-opacity-10 text-green-600 text-sm font-medium rounded-full">
                    Driver Included
                  </span>
                  <span class="px-3 py-1 bg-brand-500 bg-opacity-10 text-brand-600 text-sm font-medium rounded-full">
                    {{ vehicle.type || 'Vehicle' }}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm text-text-secondary">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ vehicle.route || 'Available Nationwide' }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    {{ vehicle.capacity || 'N/A' }} seats
                  </span>
                  <span v-if="vehicle.luggage_bags" class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    {{ vehicle.luggage_bags }} bags
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Description -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">About this vehicle</h2>
            <p class="text-sm text-text-secondary leading-relaxed">{{ vehicle.description || 'Comfortable and reliable transportation for your journey.' }}</p>
          </Card>

          <!-- Features -->
          <Card v-if="vehicle.features && vehicle.features.length > 0" padding="lg">
            <h2 class="text-xl font-bold mb-4">Features</h2>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="feature in vehicle.features" :key="feature" class="flex items-center gap-2">
                <div class="w-6 h-6 bg-brand-500 bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-sm text-text-brand-600">{{ feature }}</span>
              </div>
            </div>
          </Card>

          <!-- Driver Info -->
          <Card v-if="vehicle.driver_included && (vehicle.driver_name || vehicle.driver_experience)" padding="lg">
            <h2 class="text-xl font-bold mb-4">Driver Information</h2>
            <div class="space-y-2">
              <div v-if="vehicle.driver_name" class="flex items-center gap-2">
                <span class="text-sm font-semibold text-text-brand-600">Name:</span>
                <span class="text-sm text-text-secondary">{{ vehicle.driver_name }}</span>
              </div>
              <div v-if="vehicle.driver_experience" class="flex items-center gap-2">
                <span class="text-sm font-semibold text-text-brand-600">Experience:</span>
                <span class="text-sm text-text-secondary">{{ vehicle.driver_experience }}</span>
              </div>
            </div>
          </Card>

          <!-- Accommodation Options -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">Accommodation Options</h2>
            <p class="text-sm text-text-secondary mb-4">Find comfortable stays for your journey</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="accommodation in nearbyAccommodations" :key="accommodation.id" 
                :class="[
                  'border border-gray-200 rounded-lg p-3 hover:border-red-500 border-brand-400 hover:shadow-md transition-all cursor-pointer group relative',
                  { 'animate-pulse-once bg-green-50': accommodation.justAdded }
                ]">
                <div class="flex items-start gap-3">
                  <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img :src="accommodation.image || accommodation.mainImage" :alt="accommodation.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-sm font-semibold text-text-brand-600 mb-1">{{ accommodation.name }}</h3>
                    <p class="text-xs text-text-secondary mb-2">{{ accommodation.location }}</p>
                    <div class="flex items-center justify-between">
                      <span class="text-base font-bold text-brand-600">{{ currencyStore.formatPrice(accommodation.price) }}/night</span>
                      <button 
                        @click="addAccommodationToCart(accommodation)" 
                        :disabled="accommodation.justAdded"
                        :class="[
                          'text-xs font-semibold transition-all',
                          accommodation.justAdded 
                            ? 'text-green-500 cursor-not-allowed' 
                            : 'text-brand-600 hover:text-brand-700 hover:scale-105'
                        ]">
                        <span v-if="!accommodation.justAdded">Add to Trip Cart</span>
                        <span v-else class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Added!
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Booking Sidebar -->
        <div class="lg:col-span-1">
          <Card padding="lg" class="sticky top-24">
            <div class="mb-6">
              <div class="flex items-baseline gap-2 mb-1 justify-center">
                <span class="text-xl font-bold text-brand-600">{{ currencyStore.formatPrice(vehicle.price_per_day || vehicle.price) }}</span>
                <span class="text-xs text-text-secondary whitespace-nowrap">/day</span>
              </div>
              <p class="text-xs text-center text-text-secondary">Includes taxes and fees</p>
            </div>

            <div class="space-y-3 mb-6">
              <div>
                <label class="block text-xs font-medium mb-1.5">Start Date</label>
                <input v-model="booking.startDate" type="date" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue bg-white text-gray-900" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5">End Date</label>
                <input v-model="booking.endDate" type="date" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue bg-white text-gray-900" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5">Number of Passengers</label>
                <select v-model.number="booking.passengers" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue bg-white text-gray-900">
                  <option :value="1">1 Passenger</option>
                  <option :value="2">2 Passengers</option>
                  <option :value="3">3 Passengers</option>
                  <option :value="4">4 Passengers</option>
                  <option :value="5">5+ Passengers</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mb-3">
              <Button variant="outline" size="sm" @click="addToCart">
                Add to Trip Cart
              </Button>
              <Button variant="primary" size="sm" @click="goToCheckout">
                Book Now
              </Button>
            </div>
            <p class="text-xs text-center text-text-secondary">You won't be charged yet</p>

            <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-text-secondary">{{ currencyStore.formatPrice(vehicle.price_per_day || vehicle.price) }} × {{ days }} {{ days === 1 ? 'day' : 'days' }}</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-text-secondary">Service fee</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(serviceFee) }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-text-secondary">Taxes</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(taxes) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200">
                <span class="text-sm font-semibold">Total</span>
                <span class="text-lg font-bold text-brand-600">{{ currencyStore.formatPrice(total) }}</span>
              </div>
            </div>
          </Card>
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
import Button from '../../components/common/Button.vue'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()
const { success } = useToast()
const currencyStore = useCurrencyStore()
const userStore = useUserStore()
const { t } = useTranslation()

const mainImageError = ref(false)
const mainImageLoaded = ref(false)
const galleryLoaded = ref([])
const galleryError = ref([])

const resetImageLoadingState = () => {
  mainImageError.value = false
  mainImageLoaded.value = false
  const gallery = Array.isArray(vehicle.value?.gallery) ? vehicle.value.gallery : []
  galleryLoaded.value = new Array(gallery.length).fill(false)
  galleryError.value = new Array(gallery.length).fill(false)
}

const handleMainImageLoad = () => {
  mainImageLoaded.value = true
}

const handleMainImageError = () => {
  mainImageError.value = true
}

const handleGalleryLoad = (index) => {
  if (!Array.isArray(galleryLoaded.value)) galleryLoaded.value = []
  galleryLoaded.value[index] = true
}

const handleGalleryError = (index) => {
  if (!Array.isArray(galleryError.value)) galleryError.value = []
  galleryError.value[index] = true
}

const booking = ref({
  startDate: '',
  endDate: '',
  passengers: 2
})

function toDateInputValue(date) {
  return date.toISOString().split('T')[0]
}

const days = computed(() => {
  if (!booking.value.startDate || !booking.value.endDate) return 1
  const startDate = new Date(booking.value.startDate)
  const endDate = new Date(booking.value.endDate)
  const diffTime = Math.abs(endDate - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays || 1
})

const subtotal = computed(() => (vehicle.value.price_per_day || vehicle.value.price || 0) * days.value)
const serviceFee = computed(() => Math.round(subtotal.value * 0.05))
const taxes = computed(() => Math.round(subtotal.value * 0.03))
const total = computed(() => subtotal.value + serviceFee.value + taxes.value)

const goToCheckout = () => {
  router.push({
    path: `/transport/${vehicle.value.id}/booking`,
    query: {
      startDate: booking.value.startDate,
      endDate: booking.value.endDate,
      passengers: booking.value.passengers
    }
  })
}

const addToCart = () => {
  const cartItem = {
    id: vehicle.value.id,
    type: 'transport',
    name: vehicle.value.name,
    location: vehicle.value.route || 'Nationwide',
    price: vehicle.value.price_per_day || vehicle.value.price,
    image: vehicle.value.mainImage,
    startDate: booking.value.startDate,
    endDate: booking.value.endDate,
    passengers: booking.value.passengers
  }
  userStore.addToCart(cartItem)
  success(`${vehicle.value.name} added to cart!`)
}

const addAccommodationToCart = (accommodation) => {
  const cartItem = {
    id: accommodation.id,
    type: 'accommodation',
    name: accommodation.name,
    location: accommodation.location,
    price: accommodation.price,
    image: accommodation.image || accommodation.mainImage
  }
  userStore.addToCart(cartItem)
  success(`${accommodation.name} added to trip cart!`)
  
  accommodation.justAdded = true
  setTimeout(() => {
    accommodation.justAdded = false
  }, 2000)
}

const nearbyAccommodations = ref([])

const loadNearbyAccommodations = async () => {
  try {
    const res = await api.accommodations.getAll({ limit: 4 })
    const accommodations = Array.isArray(res?.data) ? res.data.slice(0, 4) : []
    nearbyAccommodations.value = accommodations.map(acc => ({
      ...acc,
      justAdded: false
    }))
  } catch (error) {
    console.error('Failed to load accommodations:', error)
    nearbyAccommodations.value = []
  }
}

const vehicle = ref({
  id: route.params.id,
  name: 'Luxury Sedan',
  type: 'Car',
  price_per_day: 50,
  capacity: 4,
  mainImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200',
  gallery: [],
  description: '',
  features: [],
  driver_included: false
})

onMounted(async () => {
  const qStartDate = route.query.startDate != null ? String(route.query.startDate).trim() : ''
  const qEndDate = route.query.endDate != null ? String(route.query.endDate).trim() : ''
  const qPassengers = route.query.passengers != null && String(route.query.passengers).trim() ? Number(route.query.passengers) : null

  if (qStartDate) booking.value.startDate = qStartDate
  if (qEndDate) booking.value.endDate = qEndDate
  if (Number.isFinite(qPassengers) && qPassengers > 0) booking.value.passengers = qPassengers

  if (!booking.value.startDate) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 1)
    booking.value.startDate = toDateInputValue(startDate)
  }

  if (!booking.value.endDate) {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 3)
    booking.value.endDate = toDateInputValue(endDate)
  }

  try {
    const res = await api.transport.getVehicles({})
    const vehicles = Array.isArray(res?.data) ? res.data : []
    const foundVehicle = vehicles.find(v => v.id === route.params.id)
    
    if (foundVehicle) {
      vehicle.value = {
        ...foundVehicle,
        name: foundVehicle.name || 'Vehicle',
        type: foundVehicle.type || foundVehicle.vehicle_type || 'Vehicle',
        price_per_day: Number(foundVehicle.price_per_day || foundVehicle.price || 0),
        capacity: Number(foundVehicle.capacity || 0),
        luggage_bags: Number(foundVehicle.luggage_bags || 0),
        mainImage: foundVehicle.main_image || (Array.isArray(foundVehicle.images) ? foundVehicle.images[0] : null) || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200',
        gallery: Array.isArray(foundVehicle.images) ? foundVehicle.images.slice(1) : [],
        description: foundVehicle.description || '',
        features: Array.isArray(foundVehicle.features) ? foundVehicle.features : [],
        driver_included: foundVehicle.driver_included || foundVehicle.professional_driver || false,
        driver_name: foundVehicle.driver_name || '',
        driver_experience: foundVehicle.driver_experience || '',
        route: foundVehicle.route || ''
      }
    }

    resetImageLoadingState()
    await loadNearbyAccommodations()
  } catch (error) {
    console.error('Failed to load vehicle:', error)
  }
})

watch(
  () => [vehicle.value?.mainImage, vehicle.value?.gallery?.length],
  () => resetImageLoadingState(),
  { immediate: true }
)
</script>

<style scoped>
@keyframes pulse-once {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes bounce-once {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-5px);
  }
}

.animate-pulse-once {
  animation: pulse-once 0.6s ease-in-out;
}

.animate-bounce-once {
  animation: bounce-once 0.6s ease-in-out;
}
</style>
