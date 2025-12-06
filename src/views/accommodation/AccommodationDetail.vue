<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8">
      <!-- Back Button -->
      <button @click="router.back()" class="flex items-center text-sm text-text-secondary hover:text-brand-600 mb-6 transition-colors">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to listings
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Gallery -->
          <div class="grid grid-cols-4 gap-2 rounded-card overflow-hidden">
            <div class="col-span-4 row-span-2 h-96 relative">
              <img loading="lazy" :src="accommodation.mainImage" :alt="accommodation.name" class="w-full h-full object-cover" />
              <button class="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-button shadow-lg flex items-center gap-1.5 hover:bg-gray-50 transition-colors text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                View all photos
              </button>
            </div>
            <div v-for="(img, index) in accommodation.gallery" :key="index" class="h-32">
              <img loading="lazy" :src="img" :alt="`Gallery ${index + 1}`" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- Header Info -->
          <Card padding="lg">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h1 class="text-2xl font-bold text-text-brand-600">{{ accommodation.name }}</h1>
                  <button 
                    @click="openDirections"
                    class="inline-flex items-center px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-full transition-colors shadow-sm"
                    :title="t('accommodation.getDirections')"
                  >
                    <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    {{ t('accommodation.getDirections') }}
                  </button>
                  <span v-if="accommodation.eco" class="inline-flex items-center px-3 py-1 bg-success bg-opacity-10 text-success text-sm font-medium rounded-full">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-10a4 4 0 100 8 4 4 0 000-8z"/>
                    </svg>
                    Eco-Certified
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm text-text-secondary">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ accommodation.location }}
                  </span>
                  <span class="flex items-center font-semibold text-text-brand-600">
                    {{ accommodation.rating }} ⭐ 
                    <span class="ml-1 text-text-secondary font-normal">({{ accommodation.reviews }} reviews)</span>
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center hover:border-brand-500 hover:text-brand-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                </button>
                <button class="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center hover:border-brand-500 hover:text-brand-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </Card>

          <!-- VR/AR Preview -->
          <Card padding="lg">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold">360° Virtual Tour</h2>
              <span class="px-3 py-1 bg-accent-blue bg-opacity-10 text-accent-blue text-sm font-medium rounded-full">VR/AR Ready</span>
            </div>
            <div class="bg-gray-100 rounded-card h-64 flex items-center justify-center">
              <button class="flex flex-col items-center gap-2 hover:scale-105 transition-transform">
                <div class="w-14 h-14 bg-accent-blue rounded-full flex items-center justify-center">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <span class="text-sm text-accent-blue font-semibold">Launch Virtual Tour</span>
              </button>
            </div>
          </Card>

          <!-- Description -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">About this place</h2>
            <p class="text-sm text-text-secondary leading-relaxed">{{ accommodation.description }}</p>
          </Card>

          <!-- Transportation Options -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">Transportation Options</h2>
            <p class="text-sm text-text-secondary mb-4">Get to and from this property with ease</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="transport in transportOptions" :key="transport.id" 
                :class="[
                  'border border-gray-200 rounded-lg p-3 hover:border-red-500 hover:shadow-md transition-all cursor-pointer group relative',
                  { 'animate-pulse-once bg-green-50': transport.justAdded }
                ]">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                    <svg v-if="!transport.justAdded" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <span class="text-base font-bold text-red-500">{{ formatPrice(transport.price) }}</span>
                      <button 
                        @click="addTransportToCart(transport)" 
                        :disabled="transport.justAdded"
                        :class="[
                          'text-xs font-semibold transition-all',
                          transport.justAdded 
                            ? 'text-green-500 cursor-not-allowed' 
                            : 'text-red-500 hover:text-red-600 hover:scale-105'
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

          <!-- Amenities -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">Amenities</h2>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="amenity in accommodation.amenities" :key="amenity" class="flex items-center gap-2">
                <div class="w-6 h-6 bg-brand-500 bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-sm text-text-brand-600">{{ amenity }}</span>
              </div>
            </div>
          </Card>

          <!-- Reviews -->
          <Card padding="lg">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold">Guest Reviews</h2>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-bold text-text-brand-600">{{ accommodation.rating }}</span>
                <div>
                  <div class="flex text-yellow-500">
                    <span v-for="i in 5" :key="i">⭐</span>
                  </div>
                  <p class="text-sm text-text-secondary">{{ accommodation.reviews }} reviews</p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div v-for="review in accommodation.reviewsList" :key="review.id" class="border-b border-gray-100 pb-4 last:border-0">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-blue flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {{ review.author.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <div>
                        <h4 class="text-sm font-semibold text-text-brand-600">{{ review.author }}</h4>
                        <p class="text-xs text-text-secondary">{{ review.date }}</p>
                      </div>
                      <div class="flex items-center gap-1">
                        <span class="text-sm font-semibold">{{ review.rating }}</span>
                        <span class="text-yellow-500 text-sm">⭐</span>
                      </div>
                    </div>
                    <p class="text-sm text-text-secondary">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" full-width class="mt-6">
              View all {{ accommodation.reviews }} reviews
            </Button>
          </Card>

          <!-- Location Map -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">Location</h2>
            <div class="space-y-4">
              <!-- Map Container -->
              <div class="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden">
                <iframe
                  :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(accommodation.location + ', Rwanda')}&zoom=14`"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  class="absolute inset-0"
                ></iframe>
              </div>
              
              <!-- Location Details -->
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <svg class="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 mb-1">{{ accommodation.location }}</p>
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
                <span class="text-xl font-bold text-brand-600">{{ currencyStore.formatPrice(accommodation.price) }}</span>
                <span class="text-xs text-text-secondary whitespace-nowrap">/night</span>
              </div>
              <p class="text-xs text-center text-text-secondary">Includes taxes and fees</p>
            </div>

            <div class="space-y-3 mb-6">
              <div>
                <label class="block text-xs font-medium mb-1.5">Check-in</label>
                <input type="date" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5">Check-out</label>
                <input type="date" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5">Guests</label>
                <select class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                  <option>5+ Guests</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mb-3">
              <Button variant="outline" size="md" @click="addToCart">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Add to Cart
              </Button>
              <Button variant="primary" size="md" @click="router.push(`/accommodation/${accommodation.id}/checkout`)">
                Reserve Now
              </Button>
            </div>
            <p class="text-xs text-center text-text-secondary">You won't be charged yet</p>

            <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-text-secondary">{{ currencyStore.formatPrice(accommodation.price) }} × 3 nights</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(accommodation.price * 3) }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-text-secondary">Service fee</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(25) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200">
                <span class="text-sm font-semibold">Total</span>
                <span class="text-lg font-bold text-brand-600">{{ currencyStore.formatPrice(accommodation.price * 3 + 25) }}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Cross Category Suggestions -->
      <CrossCategorySuggestions 
        currentCategory="accommodation" 
        :currentLocation="accommodation.location" 
      />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCurrencyStore } from '../../stores/currency'
import { useUserStore } from '../../stores/userStore'
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast.js'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
import CrossCategorySuggestions from '../../components/common/CrossCategorySuggestions.vue'

const router = useRouter()
const { success } = useToast()
const route = useRoute()
const currencyStore = useCurrencyStore()
const userStore = useUserStore()
const { t } = useTranslation()

const openDirections = () => {
  // Get the property location and open in Google Maps
  const location = encodeURIComponent(accommodation.value.location + ', ' + accommodation.value.name)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location}`
  window.open(mapsUrl, '_blank')
}

const addToCart = () => {
  // Add accommodation to cart
  const cartItem = {
    id: Date.now(),
    type: 'accommodation',
    name: accommodation.value.name,
    location: accommodation.value.location,
    price: accommodation.value.price,
    image: accommodation.value.mainImage
  }
  userStore.addToCart(cartItem)
  success(`${accommodation.value.name} added to cart!`)
}

const addTransportToCart = (transport) => {
  const cartItem = {
    id: Date.now(),
    type: 'transport',
    name: transport.name,
    description: transport.description,
    price: transport.price,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'
  }
  userStore.addToCart(cartItem)
  success(`${transport.name} added to trip cart!`)
  
  // Trigger animation
  transport.justAdded = true
  setTimeout(() => {
    transport.justAdded = false
  }, 2000)
}

const transportOptions = ref([
  {
    id: 1,
    name: 'Airport Transfer',
    description: 'Direct transfer from Kigali Airport',
    price: 25
  },
  {
    id: 2,
    name: 'Private Car Rental',
    description: 'Luxury sedan with driver',
    price: 50
  },
  {
    id: 3,
    name: 'Taxi Service',
    description: 'On-demand city transportation',
    price: 15
  }
])

const formatPrice = (price) => {
  return currencyStore.formatPrice(price)
}

const accommodation = ref({
  id: route.params.id,
  name: 'Kigali Serena Hotel',
  location: 'Kigali, Rwanda',
  price: 150,
  rating: 4.8,
  reviews: 324,
  eco: true,
  mainImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
  gallery: [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400'
  ],
  description: 'Experience luxury in the heart of Kigali at the Serena Hotel. Our eco-certified property combines modern comfort with traditional Rwandan hospitality. Featuring stunning views, world-class dining, and exceptional service, we ensure your stay is memorable.',
  amenities: [
    'Free WiFi',
    'Swimming Pool',
    'Restaurant & Bar',
    'Spa & Wellness',
    'Fitness Center',
    'Room Service',
    'Air Conditioning',
    'Parking',
    'Conference Rooms',
    'Airport Shuttle',
    'Laundry Service',
    'Concierge'
  ],
  reviewsList: [
    {
      id: 1,
      author: 'Sarah Johnson',
      date: 'November 2025',
      rating: 5.0,
      comment: 'Absolutely wonderful stay! The staff was incredibly welcoming and the facilities were top-notch. The eco-friendly practices were impressive too.'
    },
    {
      id: 2,
      author: 'Michael Chen',
      date: 'October 2025',
      rating: 4.5,
      comment: 'Great location in the heart of Kigali. Rooms were spacious and clean. The restaurant served delicious local and international cuisine.'
    },
    {
      id: 3,
      author: 'Emma Williams',
      date: 'September 2025',
      rating: 5.0,
      comment: 'Perfect for business and leisure. The conference facilities were excellent and the pool area was a great place to unwind.'
    }
  ]
})
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
