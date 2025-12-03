<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="relative bg-gray-50 py-8 md:py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <h1 class="text-2xl sm:text-3xl font-bold mb-2 text-text-brand-600">My Trips</h1>
          <p class="text-sm md:text-base text-text-secondary">Manage your bookings and travel plans</p>
        </div>
      </div>
    </section>

    <!-- Dashboard Content -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-muted text-sm mb-1">Upcoming Trips</p>
                <p class="text-3xl font-bold text-brand-600">{{ upcomingBookings.length }}</p>
              </div>
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-muted text-sm mb-1">Saved</p>
                <p class="text-3xl font-bold text-gray-900">{{ watchlistCount }}</p>
              </div>
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-muted text-sm mb-1">Cart Items</p>
                <p class="text-3xl font-bold text-gray-900">{{ cartCount }}</p>
              </div>
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-text-muted text-sm mb-1">Loyalty Points</p>
                <p class="text-3xl font-bold text-brand-600">{{ loyaltyPoints }}</p>
              </div>
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-4 mb-8 border-b border-gray-200">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-3 font-semibold transition-all relative',
              activeTab === tab.id 
                ? 'text-brand-600' 
                : 'text-text-secondary hover:text-text-brand-600'
            ]"
          >
            {{ tab.name }}
            <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
          </button>
        </div>

        <!-- Tab Content -->
        <div v-if="activeTab === 'upcoming'" class="space-y-6">
          <div v-if="upcomingBookings.length === 0" class="text-center py-16">
            <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h3 class="text-xl font-semibold text-text-brand-600 mb-2">No upcoming trips</h3>
            <p class="text-text-secondary mb-6">Start planning your next adventure!</p>
            <button @click="router.push('/home')" class="px-6 py-3 bg-brand-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
              Explore Destinations
            </button>
          </div>
          <div v-else v-for="booking in upcomingBookings" :key="booking.id" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="flex flex-col md:flex-row gap-6">
              <img loading="lazy" :src="booking.image" alt="Booking" class="w-full md:w-48 h-48 object-cover rounded-lg" />
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-text-brand-600 mb-2">{{ booking.name }}</h3>
                    <p class="text-text-secondary">{{ booking.location }}</p>
                  </div>
                  <span class="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold">Confirmed</span>
                </div>
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p class="text-text-muted text-sm">Check-in</p>
                    <p class="font-semibold">{{ booking.checkIn }}</p>
                  </div>
                  <div>
                    <p class="text-text-muted text-sm">Check-out</p>
                    <p class="font-semibold">{{ booking.checkOut }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-bold text-brand-600">{{ booking.price }} RWF</span>
                  <div class="flex gap-2">
                    <button class="px-4 py-2 border border-gray-300 text-text-brand-600 rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    <button class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'past'" class="text-center py-16">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-text-brand-600 mb-2">No past trips</h3>
          <p class="text-text-secondary">Your travel history will appear here</p>
        </div>

        <div v-if="activeTab === 'saved'" class="space-y-6">
          <div v-if="watchlistCount === 0" class="text-center py-16">
            <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <h3 class="text-xl font-semibold text-text-brand-600 mb-2">No saved items</h3>
            <p class="text-text-secondary mb-6">Save your favorite places to visit them later</p>
            <button @click="router.push('/home')" class="px-6 py-3 bg-brand-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
              Discover Places
            </button>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import PropertyLayout from '../../components/layout/PropertyLayout.vue'

const router = useRouter()
const userStore = useUserStore()

const tabs = ref([
  { id: 'upcoming', name: 'Upcoming Trips' },
  { id: 'past', name: 'Past Trips' },
  { id: 'saved', name: 'Saved' }
])

const activeTab = ref('upcoming')

const upcomingBookings = ref([
  {
    id: 1,
    name: 'Luxury Villa in Musanze',
    location: 'Musanze, Rwanda',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80',
    checkIn: 'Dec 15, 2025',
    checkOut: 'Dec 18, 2025',
    price: '850,000',
    status: 'confirmed'
  }
])

const watchlistCount = computed(() => userStore.watchlistCount)
const cartCount = computed(() => userStore.cartCount)
const loyaltyPoints = computed(() => userStore.loyaltyPoints)
</script>
