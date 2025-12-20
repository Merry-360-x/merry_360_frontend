<template>
  <MainLayout>
    <!-- Cart Content -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="cartCount === 0" class="text-center py-16">
          <h3 class="text-2xl font-bold text-text-brand-600 mb-2">Your cart is empty</h3>
          <p class="text-text-secondary mb-6">Add accommodations, tours, and services to your cart</p>
          <button @click="router.push('/home')" class="px-6 py-3 bg-brand-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
            Start Planning
          </button>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2 space-y-4">
            <h2 class="text-2xl font-bold text-text-brand-600 mb-6">Cart Items ({{ cartCount }})</h2>
            
            <div v-for="item in tripCart" :key="`${item.type}-${item.id}`" class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div class="flex flex-col sm:flex-row gap-4 p-6">
                <img loading="lazy" 
                  :src="item.image" 
                  :alt="item.name || item.title" 
                  class="w-full sm:w-32 h-32 object-cover rounded-lg"
                />
                <div class="flex-1">
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <span class="px-2 py-1 bg-primary/10 text-brand-600 text-xs font-semibold rounded-full uppercase">
                        {{ item.type }}
                      </span>
                      <h3 class="text-lg font-bold text-text-brand-600 mt-2">{{ item.name || item.title }}</h3>
                      <p v-if="item.location" class="text-text-secondary text-sm">{{ item.location }}</p>
                      <p v-if="item.duration" class="text-text-secondary text-sm">Duration: {{ item.duration }}</p>
                    </div>
                    <button 
                      @click="removeItem(item)" 
                      class="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="flex items-center justify-between mt-4">
                    <span class="text-2xl font-bold text-brand-600">
                      {{ currencyStore.formatPrice(typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 class="text-xl font-bold text-text-brand-600 mb-6">Order Summary</h3>
              
              <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div class="flex justify-between text-text-secondary">
                  <span>Subtotal ({{ cartCount }} items)</span>
                  <span class="font-semibold">{{ currencyStore.formatPrice(subtotal) }}</span>
                </div>
                <div class="flex justify-between text-text-secondary">
                  <span>Service Fee</span>
                  <span class="font-semibold">{{ currencyStore.formatPrice(serviceFee) }}</span>
                </div>
                <div class="flex justify-between text-brand-600">
                  <span>Loyalty Discount</span>
                  <span class="font-semibold">-{{ currencyStore.formatPrice(discount) }}</span>
                </div>
              </div>

              <div class="flex justify-between text-xl font-bold text-text-brand-600 mb-6">
                <span>Total</span>
                <span class="text-brand-600">{{ currencyStore.formatPrice(total) }}</span>
              </div>

              <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-text-secondary">Loyalty Points Available</span>
                  <span class="text-sm font-semibold text-brand-600">{{ loyaltyPoints }} pts</span>
                </div>
                <div class="flex items-center gap-2">
                  <input 
                    v-model="pointsToUse" 
                    type="number" 
                    :max="loyaltyPoints"
                    min="0"
                    placeholder="Points to redeem"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <button 
                    @click="applyPoints" 
                    class="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button 
                @click="proceedToCheckout" 
                class="w-full px-6 py-4 bg-brand-500 text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>

              <button 
                @click="clearAllItems" 
                class="w-full px-6 py-3 mt-3 border-2 border-gray-300 text-text-secondary rounded-xl font-semibold hover:border-red-500 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>
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
import { useCurrencyStore } from '../../stores/currency'
import MainLayout from '../../components/layout/MainLayout.vue'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()

const pointsToUse = ref(0)

const tripCart = computed(() => userStore.tripCart)
const cartCount = computed(() => userStore.cartCount)
const loyaltyPoints = computed(() => userStore.loyaltyPoints)

const subtotal = computed(() => {
  return tripCart.value.reduce((sum, item) => {
    const price = typeof item.price === 'string' 
      ? parseInt(item.price.replace(/[^0-9]/g, '')) 
      : item.price
    return sum + (price || 0)
  }, 0)
})

const serviceFee = computed(() => Math.round(subtotal.value * 0.05))
const discount = computed(() => Math.round(subtotal.value * 0.02))
const total = computed(() => subtotal.value + serviceFee.value - discount.value)

const removeItem = (item) => {
  userStore.removeFromCart(item.id, item.type)
}

const clearAllItems = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    userStore.clearCart()
  }
}

const applyPoints = () => {
  if (pointsToUse.value > loyaltyPoints.value) {
    alert('Insufficient loyalty points!')
    pointsToUse.value = loyaltyPoints.value
  } else if (pointsToUse.value > 0) {
    alert(`${pointsToUse.value} points will be applied at checkout!`)
  }
}

const proceedToCheckout = async () => {
  if (!userStore.user) {
    alert('Please login to complete your booking')
    router.push('/login')
    return
  }
  
  // Navigate to checkout page with cart data
  router.push('/checkout')
}
</script>
