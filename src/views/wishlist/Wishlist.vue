<template>
  <MainLayout>
    <!-- Clean Header -->
    <section class="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-800 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{{ watchlistCount }} saved items</p>
      </div>
    </section>

    <!-- Wishlist Content -->
    <section class="py-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="watchlist.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No saved items</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Save your favorites to view them here</p>
          <button @click="router.push('/home')" class="px-6 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
            Explore
          </button>
        </div>

        <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          <div 
            v-for="item in watchlist" 
            :key="`${item.type}-${item.id}`"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-800 shadow-card hover:shadow-card-hover transition-all overflow-hidden group"
          >
            <div class="relative h-36 sm:h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
              <img loading="lazy" :src="item.image" :alt="item.name || item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <button 
                @click="removeItem(item)"
                class="absolute top-2 right-2 w-10 h-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 active:scale-95 shadow-lg transition-all"
              >
                <svg class="w-5 h-5 text-brand-600 dark:text-brand-400 scale-110" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <span class="absolute top-2 left-2 px-2.5 py-1 bg-gradient-to-r from-brand-500 to-brand-600 backdrop-blur-sm text-white text-xs font-medium rounded-lg capitalize shadow-md">
                {{ item.type }}
              </span>
            </div>
            <div class="p-3 sm:p-4">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-1 leading-tight mb-1">
                {{ item.name || item.title }}
              </h3>
              <p v-if="item.location" class="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2 line-clamp-1">{{ item.location }}</p>
              <p v-if="item.description" class="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 mb-3">{{ item.description }}</p>
              <div class="flex items-center justify-between gap-2 mt-auto">
                <span class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {{ currencyStore.formatPrice(typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price) }}
                </span>
                <button 
                  @click="addToCart(item)" 
                  class="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span class="hidden sm:inline">Add to Cart</span>
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
