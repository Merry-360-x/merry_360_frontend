<template>
  <MainLayout>
    <!-- Hero Section with Search -->
    <section class="relative bg-gradient-to-br from-green-50 to-white py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">{{ t('tours.title') }}</h1>
          <p class="text-base md:text-lg text-gray-600">{{ t('tours.subtitle') }}</p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-3xl mx-auto">
          <div class="bg-white rounded-2xl shadow-xl p-4 flex flex-col md:flex-row gap-3">
            <!-- Location Search -->
            <div class="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search tours by name or location..."
                class="flex-1 bg-transparent text-sm font-medium focus:outline-none placeholder-gray-400"
              />
            </div>

            <!-- Duration Filter -->
            <select 
              v-model="durationFilter"
              class="px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="">Any Duration</option>
              <option value="half">Half Day</option>
              <option value="full">Full Day</option>
              <option value="multi">Multi Day</option>
            </select>

            <!-- Search Button -->
            <button 
              @click="applySearch"
              class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              {{ t('home.search') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Tour Categories -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Category Filters -->
        <div class="flex flex-wrap gap-2 mb-6 justify-center">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
              selectedCategory === category 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Tours Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div 
            v-for="tour in filteredTours" 
            :key="tour.id"
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            @click="viewTour(tour)"
          >
            <div class="relative overflow-hidden h-56">
              <img loading="lazy" :src="tour.image" :alt="tour.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <span class="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                {{ tour.category }}
              </span>
              <button 
                @click.stop="toggleWatchlist(tour)"
                class="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <svg 
                  class="w-6 h-6 transition-colors" 
                  :class="isInWatchlist(tour) ? 'text-brand-600 fill-current' : 'text-gray-400'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>
            </div>
            <div class="p-6">
              <h3 class="text-base font-bold text-text-brand-600 mb-2 group-hover:text-brand-600 transition-colors line-clamp-1">
                {{ tour.title }}
              </h3>
              <p class="text-text-secondary text-xs mb-3 line-clamp-2">{{ tour.description }}</p>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-1 text-yellow-500">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="font-semibold text-text-brand-600">{{ tour.rating }}</span>
                  <span class="text-text-muted text-sm">({{ tour.reviews }})</span>
                </div>
                <div class="flex items-center gap-1 text-text-secondary text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ tour.duration }}
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg font-bold text-green-600">{{ currencyStore.formatPrice(parseFloat(tour.price.replace(/,/g, ''))) }}</span>
                  <span class="text-text-muted text-xs">/person</span>
                </div>
                <button 
                  @click.stop="addToCart(tour)" 
                  class="px-4 py-2 bg-green-500 text-sm text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Book Now
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { useTranslation } from '../../composables/useTranslation'
import MainLayout from '../../components/layout/MainLayout.vue'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()

const categories = computed(() => [t('tours.all'), t('tours.nature'), t('tours.adventure'), t('tours.cultural'), t('tours.wildlife'), t('tours.historical')])
const selectedCategory = ref(computed(() => t('tours.all')).value)
const searchQuery = ref('')
const durationFilter = ref('')

const tours = ref([
  {
    id: 1,
    category: 'NATURE',
    title: 'Gorilla Trekking Experience',
    description: 'Get up close with mountain gorillas in Volcanoes National Park',
    image: 'https://images.unsplash.com/photo-1571752239935-74f3d4d23816?w=600&q=80',
    duration: '3 days',
    price: '450,000',
    rating: 4.9,
    reviews: 234
  },
  {
    id: 2,
    category: 'ADVENTURE',
    title: 'Lake Kivu Beach Escape',
    description: 'Relax on the shores of one of Africa\'s Great Lakes',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
    duration: '2 days',
    price: '120,000',
    rating: 4.7,
    reviews: 189
  },
  {
    id: 3,
    category: 'WILDLIFE',
    title: 'Akagera Safari Adventure',
    description: 'Experience Rwanda\'s Big Five in their natural habitat',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80',
    duration: '2 days',
    price: '280,000',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 4,
    category: 'CULTURAL',
    title: 'Kigali City Cultural Tour',
    description: 'Explore the vibrant capital with local guides',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&q=80',
    duration: '1 day',
    price: '45,000',
    rating: 4.6,
    reviews: 312
  },
  {
    id: 5,
    category: 'NATURE',
    title: 'Nyungwe Forest Canopy Walk',
    description: 'Walk among the treetops in ancient rainforest',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&q=80',
    duration: '1 day',
    price: '85,000',
    rating: 4.8,
    reviews: 203
  },
  {
    id: 6,
    category: 'HISTORICAL',
    title: 'Genocide Memorial & History',
    description: 'Learn about Rwanda\'s journey of healing and reconciliation',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
    duration: '4 hours',
    price: '25,000',
    rating: 4.9,
    reviews: 428
  }
])

const filteredTours = computed(() => {
  let filtered = tours.value

  // Filter by category
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(tour => 
      tour.category.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tour => 
      tour.title.toLowerCase().includes(query) ||
      tour.description.toLowerCase().includes(query) ||
      tour.category.toLowerCase().includes(query)
    )
  }

  // Filter by duration
  if (durationFilter.value) {
    filtered = filtered.filter(tour => {
      const duration = tour.duration.toLowerCase()
      if (durationFilter.value === 'half') return duration.includes('hour') && !duration.includes('day')
      if (durationFilter.value === 'full') return duration === '1 day'
      if (durationFilter.value === 'multi') return duration.includes('days') || parseInt(duration) > 1
      return true
    })
  }

  return filtered
})

const applySearch = () => {
  // Trigger reactive update by accessing computed property
  console.log('Search applied:', filteredTours.value.length, 'tours found')
}

const isInWatchlist = (tour) => {
  return userStore.isInWatchlist(tour.id, 'tour')
}

const toggleWatchlist = (tour) => {
  if (isInWatchlist(tour)) {
    userStore.removeFromWatchlist(tour.id, 'tour')
  } else {
    userStore.addToWatchlist({
      ...tour,
      type: 'tour'
    })
  }
}

const addToCart = (tour) => {
  userStore.addToCart({
    ...tour,
    type: 'tour'
  })
  alert(`${tour.title} added to your trip cart!`)
}

const viewTour = (tour) => {
  alert(`Tour details for ${tour.title} - Coming soon!`)
}
</script>
