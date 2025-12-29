<template>
  <MainLayout>
    <!-- Clean Header -->
    <section class="bg-white border-b border-gray-200 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-text-brand-600">My Wishlist</h1>
        <p class="text-sm text-text-secondary mt-1">{{ watchlistCount }} saved items</p>
      </div>
    </section>

    <!-- Wishlist Content -->
    <section class="py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="watchlist.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-text-brand-600 mb-2">No saved items</h3>
          <p class="text-sm text-text-secondary mb-4">Save your favorites to view them here</p>
          <button @click="router.push('/home')" class="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
            Explore
          </button>
        </div>

        <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div 
            v-for="item in watchlist" 
            :key="`${item.type}-${item.id}`"
            class="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden group"
          >
            <div class="relative h-40">
              <img loading="lazy" :src="item.image" :alt="item.name || item.title" class="w-full h-full object-cover" />
              <button 
                @click="removeItem(item)"
                class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
              >
                <svg class="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <span class="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {{ item.type }}
              </span>
            </div>
            <div class="p-3">
              <h3 class="text-sm font-semibold text-text-brand-600 line-clamp-1 mb-1">
                {{ item.name || item.title }}
              </h3>
              <p v-if="item.location" class="text-xs text-text-secondary mb-2">{{ item.location }}</p>
              <p v-if="item.description" class="text-xs text-text-secondary line-clamp-2 mb-2">{{ item.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-base font-bold text-brand-600">
                  {{ currencyStore.formatPrice(typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price) }}
                </span>
                <button 
                  @click="addToCart(item)" 
                  class="px-3 py-1 bg-brand-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition-colors"
                >
                  Add to Trip Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { useToast } from '../../composables/useToast.js'
import MainLayout from '../../components/layout/MainLayout.vue'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { success } = useToast()

const watchlist = computed(() => userStore.watchlist)
const watchlistCount = computed(() => userStore.watchlistCount)

const removeItem = (item) => {
  userStore.removeFromWatchlist(item.id, item.type)
}

const addToCart = (item) => {
  userStore.addToCart(item)
  success(`${item.name || item.title} added to cart!`)
}
</script>
