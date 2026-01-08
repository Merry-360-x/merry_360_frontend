<template>
  <MainLayout>
    <!-- Hero Section with Search -->
    <section class="relative bg-gradient-to-br from-brand-50 to-white dark:from-gray-900 dark:to-gray-900 py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold mb-3 text-text-primary">{{ t('tours.title') }}</h1>
          <p class="text-base md:text-lg text-text-secondary">{{ t('tours.subtitle') }}</p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-3xl mx-auto">
          <div class="bg-white rounded-2xl shadow-xl p-4 flex flex-col md:flex-row gap-3">
            <!-- Location Search -->
            <div class="relative flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search tours by name or location..."
                class="flex-1 bg-transparent text-sm font-medium focus:outline-none placeholder-gray-400"
                @focus="onSearchFocus"
                @blur="onSearchBlur"
                @keydown.down.prevent="highlightNextSuggestion"
                @keydown.up.prevent="highlightPrevSuggestion"
                @keydown.enter.prevent="onSearchEnter"
              />

              <div
                v-if="isSearchFocused && searchSuggestions.length"
                class="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-card z-50 overflow-hidden"
                role="listbox"
              >
                <button
                  v-for="(suggestion, idx) in searchSuggestions"
                  :key="suggestion"
                  type="button"
                  class="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  :class="idx === highlightedSuggestionIndex ? 'bg-gray-50 dark:bg-gray-900' : ''"
                  @mousedown.prevent="applySuggestion(suggestion)"
                  role="option"
                  :aria-selected="idx === highlightedSuggestionIndex"
                >
                  {{ suggestion }}
                </button>
              </div>
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
              class="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
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
                ? 'bg-brand-500 text-white' 
                : 'bg-white text-text-secondary hover:bg-brand-50 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Tours Grid -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p class="text-text-secondary">Loading tours...</p>
        </div>
        <div v-else-if="filteredTours.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-text-primary mb-2">No tours found</h3>
          <p class="text-text-secondary">Try adjusting your search or filters.</p>
        </div>
        <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div 
            v-for="tour in filteredTours" 
            :key="tour.id"
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            @click="viewTour(tour)"
          >
            <div class="relative overflow-hidden h-56">
              <img loading="lazy" :src="tour.image || 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&h=300&fit=crop'" :alt="tour.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                  <span class="text-lg font-bold text-brand-600">{{ currencyStore.formatPrice(typeof tour.price === 'string' ? parseFloat(tour.price.replace(/,/g, '')) : (tour.price || 0)) }}</span>
                  <span class="text-text-muted text-xs">/person</span>
                </div>
                <button 
                  @click.stop="addToCart(tour)" 
                  class="px-4 py-2 bg-brand-500 text-sm text-white rounded-lg font-semibold hover:bg-brand-600 transition-colors"
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast.js'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase } from '@/services/supabase'
import { subscribeToTable } from '@/services/supabase'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()
const { success, error: toastError } = useToast()

const categories = computed(() => [t('tours.all'), t('tours.nature'), t('tours.adventure'), t('tours.cultural'), t('tours.wildlife'), t('tours.historical')])
const selectedCategory = ref(computed(() => t('tours.all')).value)
const allCategoryLabel = computed(() => t('tours.all'))
const searchQuery = ref('')
const durationFilter = ref('')

const isSearchFocused = ref(false)
const highlightedSuggestionIndex = ref(-1)

const normalizeForSuggestions = (value) => String(value || '').trim()
const buildSuggestionList = (rows, query, pickers) => {
  const q = String(query || '').trim().toLowerCase()
  if (q.length < 2) return []

  const results = []
  const seen = new Set()

  for (const row of rows || []) {
    for (const picker of pickers) {
      const raw = normalizeForSuggestions(picker(row))
      if (!raw) continue
      const key = raw.toLowerCase()
      if (seen.has(key)) continue
      if (!key.includes(q)) continue
      results.push({ value: raw, score: key.startsWith(q) ? 2 : 1 })
      seen.add(key)
    }
  }

  results.sort((a, b) => (b.score - a.score) || a.value.localeCompare(b.value))
  return results.slice(0, 6).map(r => r.value)
}

const tours = ref([])
const loading = ref(true)

const loadTours = async () => {
  try {
    loading.value = true
    console.log('🔍 Loading tours from Supabase...')
    
    // Load all tours first, then filter by available
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error loading tours:', error)
      // Try fallback to listings table
      console.log('🔄 Trying fallback to listings table...')
      const fallback = await supabase
        .from('listings')
        .select('*')
        .ilike('category', 'tour%')
        .order('created_at', { ascending: false })
      
      if (!fallback.error && fallback.data && fallback.data.length > 0) {
        console.log('✅ Found tours in listings table:', fallback.data.length)
        tours.value = (fallback.data || []).map(t => ({
          id: t.id,
          title: t.title || t.name || 'Tour',
          destination: t.destination || t.location || '',
          days: t.duration_days || 1,
          duration: t.duration_days ? `${t.duration_days} ${t.duration_days === 1 ? 'day' : 'days'}` : '1 day',
          price: Number(t.price) || 0,
          rating: Number(t.rating) || 4.5,
          reviews: Number(t.reviews_count) || 0,
          category: t.category || 'Tour',
          image: t.main_image || (Array.isArray(t.images) ? t.images[0] : null) || 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&h=300&fit=crop',
          description: String(t.description || ''),
          difficulty: t.difficulty || 'moderate'
        }))
        // Stop loading immediately - even if we have results
        loading.value = false
        console.log('✅ Mapped tours:', tours.value.length)
        return
      }
      console.error('❌ Fallback also failed')
      throw error
    }
    
    console.log('✅ Loaded tours from tours table:', data?.length || 0)
    
    // Always set tours (even if empty) and stop loading immediately
    tours.value = (data || []).map(t => ({
      id: t.id,
      title: t.name || 'Tour',
      destination: t.destination || '',
      days: Number(t.duration_days) || 1,
      duration: t.duration_days ? `${t.duration_days} ${t.duration_days === 1 ? 'day' : 'days'}` : '1 day',
      price: Number(t.price) || 0,
      rating: Number(t.rating) || 4.5,
      reviews: Number(t.reviews_count) || 0,
      category: t.category || 'Tour',
      image: t.main_image || (Array.isArray(t.images) ? t.images[0] : null) || 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&h=300&fit=crop',
      description: String(t.description || ''),
      difficulty: t.difficulty || 'moderate'
    }))
    
    // Stop loading immediately - even if no results
    loading.value = false
    console.log('✅ Mapped tours:', tours.value.length)
    if (tours.value.length > 0) {
      console.log('📊 Sample tour:', tours.value[0])
    }
  } catch (err) {
    console.error('❌ Error loading tours:', err)
    toastError('Failed to load tours: ' + (err.message || 'Unknown error'))
    tours.value = []
    // Ensure loading is stopped even on error
    loading.value = false
  }
}

let toursRealtime = null
let toursRealtimeTimer = null

onMounted(() => {
  loadTours()

  toursRealtime = subscribeToTable({
    table: 'tours',
    callback: () => {
      if (toursRealtimeTimer) window.clearTimeout(toursRealtimeTimer)
      toursRealtimeTimer = window.setTimeout(() => {
        loadTours()
      }, 300)
    }
  })
})

onBeforeUnmount(() => {
  if (toursRealtimeTimer) window.clearTimeout(toursRealtimeTimer)
  if (toursRealtime && typeof toursRealtime.unsubscribe === 'function') {
    toursRealtime.unsubscribe()
  }
})

const filteredTours = computed(() => {
  let filtered = tours.value

  // Filter by category
  if (selectedCategory.value !== allCategoryLabel.value) {
    filtered = filtered.filter(tour => 
      tour.category.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tour => 
      tour.title.toLowerCase().includes(query) ||
      String(tour.description || '').toLowerCase().includes(query) ||
      tour.category.toLowerCase().includes(query)
    )
  }

  // Filter by duration
  if (durationFilter.value) {
    filtered = filtered.filter(tour => {
      const days = Number(tour.days)
      if (!Number.isFinite(days)) return false
      if (durationFilter.value === 'half') return days > 0 && days < 1
      if (durationFilter.value === 'full') return days === 1
      if (durationFilter.value === 'multi') return days > 1
      return true
    })
  }

  return filtered
})

const searchSuggestions = computed(() => {
  return buildSuggestionList(tours.value || [], searchQuery.value, [
    (t) => t?.title,
    (t) => t?.destination,
    (t) => t?.category
  ])
})

const onSearchFocus = () => {
  isSearchFocused.value = true
}

const onSearchBlur = () => {
  window.setTimeout(() => {
    isSearchFocused.value = false
    highlightedSuggestionIndex.value = -1
  }, 120)
}

const applySuggestion = (suggestion) => {
  searchQuery.value = suggestion
  isSearchFocused.value = false
  highlightedSuggestionIndex.value = -1
  applySearch()
}

const highlightNextSuggestion = () => {
  if (!isSearchFocused.value || !searchSuggestions.value.length) return
  const next = highlightedSuggestionIndex.value + 1
  highlightedSuggestionIndex.value = next >= searchSuggestions.value.length ? 0 : next
}

const highlightPrevSuggestion = () => {
  if (!isSearchFocused.value || !searchSuggestions.value.length) return
  const prev = highlightedSuggestionIndex.value - 1
  highlightedSuggestionIndex.value = prev < 0 ? searchSuggestions.value.length - 1 : prev
}

const onSearchEnter = () => {
  if (isSearchFocused.value && highlightedSuggestionIndex.value >= 0) {
    const suggestion = searchSuggestions.value[highlightedSuggestionIndex.value]
    if (suggestion) {
      applySuggestion(suggestion)
      return
    }
  }
  applySearch()
}

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
  success(t('common.addedToCart', { item: tour.title }))
}

const viewTour = (tour) => {
  router.push({ name: 'tour-detail', params: { id: tour.id } })
}
</script>
