<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <!-- Back Button -->
      <button @click="router.back()" class="flex items-center text-sm text-text-secondary hover:text-brand-600 dark:text-brand-400 mb-6 transition-colors">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to tours
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Gallery -->
          <div class="grid grid-cols-4 gap-2 rounded-card overflow-hidden">
            <div class="col-span-4 row-span-2 h-96 relative bg-gray-200 dark:bg-gray-700">
              <div
                v-if="!mainImageLoaded || mainImageError || !tour.mainImage"
                class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-yellow-400 to-sky-600"
              >
                <div class="text-center animate-pulse">
                  <div class="w-16 h-16 mx-auto rounded-full bg-white/30 backdrop-blur-sm mb-3 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <p class="text-white font-semibold text-sm">Loading image...</p>
                </div>
              </div>
              <img 
                loading="eager"
                fetchpriority="high"
                decoding="async"
                :src="optimizeImage(tour.mainImage)" 
                :alt="tour.name" 
                @load="handleMainImageLoad"
                @error="handleMainImageError"
                class="w-full h-full object-cover"
                v-show="mainImageLoaded && !mainImageError && tour.mainImage"
              />
            </div>
            <div v-for="(img, index) in tour.gallery" :key="index" class="h-32 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
              <div
                v-if="!galleryLoaded[index] || galleryError[index]"
                class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-yellow-400 to-sky-600"
              >
                <div class="text-center animate-pulse">
                  <svg class="w-6 h-6 mx-auto text-white/80 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <img 
                loading="lazy" 
                decoding="async"
                :src="optimizeImage(img)" 
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
                  <h1 class="text-2xl font-bold text-text-brand-600">{{ tour.name }}</h1>
                  <span class="px-3 py-1 bg-brand-500 bg-opacity-10 text-brand-600 text-sm font-medium rounded-full">
                    {{ tour.category || 'Tour' }}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm text-text-secondary">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ tour.destination }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ tour.duration }}
                  </span>
                  <span class="flex items-center font-semibold text-text-brand-600">
                    {{ tour.rating }}
                    <svg class="w-4 h-4 ml-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="ml-1 text-text-secondary font-normal">({{ tour.reviews }} reviews)</span>
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Description -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">About this tour</h2>
            <p class="text-sm text-text-secondary leading-relaxed">{{ tour.description || 'Experience an amazing adventure in Rwanda.' }}</p>
          </Card>

          <!-- Itinerary -->
          <Card v-if="tour.itinerary" padding="lg">
            <h2 class="text-xl font-bold mb-4">Itinerary</h2>
            <div class="text-sm text-text-secondary whitespace-pre-line">{{ tour.itinerary }}</div>
          </Card>

          <!-- Inclusions -->
          <Card v-if="tour.inclusions && tour.inclusions.length > 0" padding="lg">
            <h2 class="text-xl font-bold mb-4">What's Included</h2>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="inclusion in tour.inclusions" :key="inclusion" class="flex items-center gap-2">
                <div class="w-6 h-6 bg-brand-500 bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-sm text-text-brand-600">{{ inclusion }}</span>
              </div>
            </div>
          </Card>

          <!-- Accommodation Options -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">Accommodation Options</h2>
            <p class="text-sm text-text-secondary mb-4">Find comfortable stays near this tour location</p>
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

          <!-- Transportation Options -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">Transportation Options</h2>
            <p class="text-sm text-text-secondary mb-4">Get to and from this tour with ease</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="transport in transportOptions" :key="transport.id" 
                :class="[
                  'border border-gray-200 rounded-lg p-3 hover:border-red-500 border-brand-400 hover:shadow-md transition-all cursor-pointer group relative',
                  { 'animate-pulse-once bg-green-50': transport.justAdded }
                ]">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                    <svg v-if="!transport.justAdded" class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    <svg v-else class="w-5 h-5 text-green-500 animate-bounce-once" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-sm font-semibold text-text-brand-600 mb-1">{{ transport.name }}</h3>
                    <p class="text-xs text-text-secondary mb-2">{{ transport.description }}</p>
                    <div class="flex items-center justify-between">
                      <span class="text-base font-bold text-brand-600">{{ currencyStore.formatPrice(transport.price_per_day || transport.price) }}</span>
                      <button 
                        @click="addTransportToCart(transport)" 
                        :disabled="transport.justAdded"
                        :class="[
                          'text-xs font-semibold transition-all',
                          transport.justAdded 
                            ? 'text-green-500 cursor-not-allowed' 
                            : 'text-brand-600 hover:text-brand-700 hover:scale-105'
                        ]">
                        <span v-if="!transport.justAdded">Add to Trip Cart</span>
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

          <!-- Location Map -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">Location</h2>
            <div class="space-y-4">
              <div class="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden">
                <iframe
                  :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(tour.destination + ', Rwanda')}&zoom=14`"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  class="absolute inset-0"
                ></iframe>
              </div>
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <svg class="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 mb-1">{{ tour.destination }}</p>
                  <p class="text-sm text-gray-600">Rwanda</p>
                </div>
                <button
                  @click="openDirections"
                  class="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors flex items-center gap-1.5"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                  </svg>
                  Directions
                </button>
              </div>
            </div>
          </Card>
        </div>

        <!-- Booking Sidebar -->
        <div class="lg:col-span-1">
          <Card padding="lg" class="sticky top-24">
            <div class="mb-6">
              <div class="flex items-baseline gap-2 mb-1 justify-center">
                <span class="text-xl font-bold text-brand-600">{{ currencyStore.formatPrice(tour.price) }}</span>
                <span class="text-xs text-text-secondary whitespace-nowrap">/person</span>
              </div>
              <p class="text-xs text-center text-text-secondary">Includes taxes and fees</p>
            </div>

            <div class="space-y-3 mb-6">
              <div>
                <label class="block text-xs font-medium mb-1.5">Tour Date</label>
                <input v-model="booking.tourDate" type="date" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue bg-white text-gray-900" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5">Number of Participants</label>
                <select v-model.number="booking.participants" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue bg-white text-gray-900">
                  <option :value="1">1 Person</option>
                  <option :value="2">2 People</option>
                  <option :value="3">3 People</option>
                  <option :value="4">4 People</option>
                  <option :value="5">5+ People</option>
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
                <span class="text-text-secondary">{{ currencyStore.formatPrice(tour.price) }} × {{ booking.participants }} {{ booking.participants === 1 ? 'person' : 'people' }}</span>
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
import { optimizeImageUrl } from '../../services/imageOptimization'

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
  const gallery = Array.isArray(tour.value?.gallery) ? tour.value.gallery : []
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
  tourDate: '',
  participants: 2
})

function toDateInputValue(date) {
  return date.toISOString().split('T')[0]
}

const subtotal = computed(() => (tour.value.price || 0) * booking.value.participants)
const serviceFee = computed(() => Math.round(subtotal.value * 0.05))
const taxes = computed(() => Math.round(subtotal.value * 0.03))
const total = computed(() => subtotal.value + serviceFee.value + taxes.value)

const goToCheckout = () => {
  router.push({
    path: `/tour/${tour.value.id}/booking`,
    query: {
      date: booking.value.tourDate,
      participants: booking.value.participants
    }
  })
}

const openDirections = () => {
  const location = encodeURIComponent(tour.value.destination + ', ' + tour.value.name)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location}`
  window.open(mapsUrl, '_blank')
}

const addToCart = () => {
  const cartItem = {
    id: tour.value.id,
    type: 'tour',
    name: tour.value.name,
    location: tour.value.destination,
    price: tour.value.price,
    image: tour.value.mainImage,
    date: booking.value.tourDate,
    participants: booking.value.participants
  }
  userStore.addToCart(cartItem)
  success(`${tour.value.name} added to cart!`)
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

const addTransportToCart = (transport) => {
  const cartItem = {
    id: transport.id,
    type: 'transport',
    name: transport.name,
    description: transport.description,
    price: transport.price_per_day || transport.price,
    image: transport.main_image || (Array.isArray(transport.images) ? transport.images[0] : null)
  }
  userStore.addToCart(cartItem)
  success(`${transport.name} added to trip cart!`)
  
  transport.justAdded = true
  setTimeout(() => {
    transport.justAdded = false
  }, 2000)
}

const optimizeImage = (url) => {
  if (!url) return ''
  return optimizeImageUrl(url, {
    width: 1200,
    quality: 'auto:eco'
  })
}

const nearbyAccommodations = ref([])
const transportOptions = ref([])

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

const loadTransportOptions = async () => {
  try {
    const res = await api.transport.getVehicles({ limit: 6 })
    const vehicles = Array.isArray(res?.data) ? res.data.slice(0, 6) : []
    transportOptions.value = vehicles.map(vehicle => ({
      ...vehicle,
      justAdded: false
    }))
  } catch (error) {
    console.error('Failed to load transport:', error)
    transportOptions.value = []
  }
}

const tour = ref({
  id: route.params.id,
  name: 'Gorilla Trekking Adventure',
  destination: 'Volcanoes National Park',
  price: 1500,
  rating: 4.9,
  reviews: 128,
  duration: '3 Days 2 Nights',
  mainImage: null,
  gallery: [],
  description: '',
  itinerary: '',
  inclusions: [],
  category: 'Wildlife'
})

onMounted(async () => {
  const qDate = route.query.date != null ? String(route.query.date).trim() : ''
  const qParticipants = route.query.participants != null && String(route.query.participants).trim() ? Number(route.query.participants) : null

  if (qDate) booking.value.tourDate = qDate
  if (Number.isFinite(qParticipants) && qParticipants > 0) booking.value.participants = qParticipants

  if (!booking.value.tourDate) {
    const tourDate = new Date()
    tourDate.setDate(tourDate.getDate() + 7)
    booking.value.tourDate = toDateInputValue(tourDate)
  }

  try {
    const response = await api.tours.getById(route.params.id)
    const tourData = response.data
    
    const durationDays = tourData.duration_days || 0
    const durationHours = tourData.duration_hours || 0
    let durationStr = ''
    if (durationDays > 0) {
      durationStr = `${durationDays} ${durationDays === 1 ? 'day' : 'days'}`
      if (durationHours > 0) {
        durationStr += ` ${durationHours} ${durationHours === 1 ? 'hour' : 'hours'}`
      }
    } else if (durationHours > 0) {
      durationStr = `${durationHours} ${durationHours === 1 ? 'hour' : 'hours'}`
    } else {
      durationStr = '1 day'
    }
    
    tour.value = {
      ...tourData,
      name: tourData.name || tourData.title || 'Tour',
      destination: tourData.destination || tourData.location || '',
      price: Number(tourData.price) || 0, // Ensure price is a number
      rating: Number(tourData.rating) || 4.5,
      reviews: Number(tourData.reviews_count) || 0,
      duration: durationStr,
      mainImage: tourData.main_image || (Array.isArray(tourData.images) ? tourData.images[0] : null) || null,
      gallery: Array.isArray(tourData.images) ? tourData.images.slice(1) : [],
      description: tourData.description || '',
      itinerary: tourData.itinerary || '',
      inclusions: Array.isArray(tourData.inclusions) ? tourData.inclusions : [],
      category: tourData.category || 'Tour'
    }
    
    resetImageLoadingState()
    
    // Load nearby accommodations and transport
    await Promise.all([
      loadNearbyAccommodations(),
      loadTransportOptions()
    ])
  } catch (error) {
    // Silently handle loading errors
  }
})

watch(
  () => [tour.value?.mainImage, tour.value?.gallery?.length],
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
