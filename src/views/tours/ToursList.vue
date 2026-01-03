<template>
  <MainLayout>
    <!-- Header Search (aligned with Home) -->
    <section class="bg-gray-50 dark:bg-gray-900 pt-10 pb-6">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow-card border border-gray-200/60 dark:border-gray-700 p-3">
            <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div class="flex-1 px-2 md:px-4">
                <label class="block text-xs font-semibold mb-1 text-text-secondary">Tours</label>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search tours"
                  class="w-full text-sm font-semibold focus:outline-none placeholder:text-text-muted bg-transparent text-text-primary"
                  @keyup.enter="performSearch"
                />
              </div>
              <button
                type="button"
                @click="performSearch"
                class="w-full md:w-11 h-11 rounded-xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors flex-shrink-0"
                aria-label="Search tours"
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
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-text-brand-600 mb-2">Discover Amazing Tours</h1>
        <p class="text-text-secondary text-sm sm:text-base md:text-lg">Unforgettable experiences across Rwanda</p>
      </div>

      <div v-if="loading" class="py-16 text-center text-text-secondary">
        Loading tours...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card v-for="tour in tours" :key="tour.id" hover clickable padding="none" @click="router.push(`/tour/${tour.id}`)">
          <div class="relative h-64">
            <img loading="lazy" :src="tour.image" :alt="tour.title" class="w-full h-full object-cover rounded-t-card" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span class="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs mb-2">{{ tour.category }}</span>
              <h3 class="font-bold text-xl">{{ tour.title }}</h3>
            </div>
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-text-secondary text-sm flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ tour.days ? `${tour.days} days` : 'Tour' }}
              </span>
              <span class="text-2xl font-bold text-brand-600">{{ currencyStore.formatPrice(tour.price) }}</span>
            </div>
            <p class="text-text-secondary text-sm line-clamp-2">{{ tour.description }}</p>
          </div>
        </Card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrencyStore } from '../../stores/currency'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import api from '@/services/api'

const router = useRouter()
const currencyStore = useCurrencyStore()

const searchQuery = ref('')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching tours for:', searchQuery.value)
  }
}

const tours = ref([])
const loading = ref(true)

const loadTours = async () => {
  try {
    loading.value = true
    const response = await api.tours.getAll({})
    tours.value = (response?.data || []).map(t => ({
      ...t,
      category: t.category || 'Tour',
      description: t.description || ''
    }))
  } catch (err) {
    console.error('Error loading tours:', err)
    tours.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTours()
})
</script>
