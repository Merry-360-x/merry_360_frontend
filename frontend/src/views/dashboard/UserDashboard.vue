<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">My Dashboard</h1>
        <p class="text-text-secondary">Welcome back, {{ userName }}!</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card padding="md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm mb-1">Upcoming Trips</p>
              <p class="text-3xl font-bold text-brand-600">{{ upcomingBookings.length }}</p>
            </div>
            <div class="w-12 h-12 bg-brand-500 bg-opacity-10 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm mb-1">Loyalty Points</p>
              <p class="text-3xl font-bold text-accent-blue">{{ loyaltyPoints }}</p>
            </div>
            <div class="w-12 h-12 bg-accent-blue bg-opacity-10 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm mb-1">Saved Items</p>
              <p class="text-3xl font-bold text-success">{{ watchlistCount }}</p>
            </div>
            <div class="w-12 h-12 bg-success bg-opacity-10 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-secondary text-sm mb-1">Total Spent</p>
              <p class="text-3xl font-bold text-text-brand-600">{{ currencyStore.formatPrice(totalSpent) }}</p>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Upcoming Bookings -->
        <div class="lg:col-span-2 space-y-6">
          <div>
            <h2 class="text-2xl font-bold mb-4">Upcoming Trips</h2>
            <div v-if="upcomingBookings.length === 0" class="text-center text-text-secondary py-8">
              <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 class="text-xl font-semibold text-text-brand-600 mb-2">No upcoming trips</h3>
              <p class="text-text-secondary mb-4">Start planning your next adventure from the home page.</p>
            </div>
            <div v-else class="space-y-4">
              <Card padding="md">
                <p class="text-text-secondary text-sm">You have {{ upcomingBookings.length }} upcoming trip<span v-if="upcomingBookings.length > 1">s</span>. View and manage full details from your profile.</p>
              </Card>
            </div>
          </div>

          <div>
            <h2 class="text-2xl font-bold mb-4">Past Bookings</h2>
            <Card padding="md">
              <p class="text-center text-text-secondary py-8">No past bookings yet</p>
            </Card>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Membership -->
          <Card padding="lg" class="bg-gradient-to-br from-brand-500 to-accent-blue text-white">
            <div class="mb-4">
              <span class="text-sm opacity-90">Membership Tier</span>
              <h3 class="text-2xl font-bold">{{ membershipLabel }}</h3>
            </div>
            <div class="mb-4">
              <div class="flex justify-between text-sm mb-2">
                <span>Progress to next tier</span>
                <span>{{ progressToNext }}%</span>
              </div>
              <div class="w-full bg-white bg-opacity-30 rounded-full h-2">
                <div class="bg-white rounded-full h-2" :style="{ width: progressToNext + '%' }"></div>
              </div>
            </div>
            <Button variant="secondary" size="sm" full-width>
              View Benefits
            </Button>
          </Card>

          <!-- Quick Actions -->
          <Card padding="lg">
            <h3 class="font-semibold mb-4">Quick Actions</h3>
            <div class="space-y-2">
              <button class="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-button transition-colors flex items-center">
                <svg class="w-5 h-5 mr-3 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                Saved Items
              </button>
              <button class="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-button transition-colors flex items-center">
                <svg class="w-5 h-5 mr-3 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download Receipts
              </button>
              <button class="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-button transition-colors flex items-center">
                <svg class="w-5 h-5 mr-3 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Account Settings
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'

const userStore = useUserStore()
const currencyStore = useCurrencyStore()

const userName = computed(() => userStore.user?.name || 'User')
const upcomingBookings = computed(() => userStore.upcomingBookings || [])
const watchlistCount = computed(() => userStore.watchlistCount)
const loyaltyPoints = computed(() => userStore.loyaltyPoints)
const loyaltyTier = computed(() => userStore.loyaltyTier)
const nextTierPoints = computed(() => userStore.nextTierPoints)

const totalSpent = computed(() => {
  const past = userStore.pastBookings || []
  return past.reduce((sum, booking) => {
    const amount = booking.totalAmount ?? booking.total ?? 0
    return sum + (typeof amount === 'number' ? amount : 0)
  }, 0)
})

const membershipLabel = computed(() => {
  const tier = loyaltyTier.value || 'bronze'
  return `${tier.charAt(0).toUpperCase()}${tier.slice(1)} Member`
})

const progressToNext = computed(() => {
  const current = loyaltyPoints.value || 0
  const remaining = nextTierPoints.value || 0
  const total = current + remaining
  if (!total) return 0
  return Math.round((current / total) * 100)
})
</script>
