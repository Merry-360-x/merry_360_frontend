<template>
  <MainLayout>
    <!-- Search Bar Section -->
    <div class="w-full py-12" style="margin-top: 80px;">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="bg-white rounded-[20px] md:rounded-[35px] shadow-2xl p-3 md:p-2 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0" style="min-height: 70px;">
          <div class="flex-1 px-2 md:px-6">
            <label class="block text-xs font-bold mb-1.5" style="font-family: Montserrat, sans-serif; color: #484848; font-size: 12px;">Search Tours</label>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search by destination, activity, or duration..."
              class="w-full text-sm font-semibold focus:outline-none placeholder-gray-400"
              style="font-family: Montserrat, sans-serif; color: #484848; font-size: 14px;"
              @keyup.enter="performSearch"
            />
          </div>
          <button 
            @click="performSearch"
            class="w-full md:w-[54px] h-[54px] rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 flex-shrink-0 md:mr-2 shadow-lg"
            style="background: #FE4F4F;"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-2">Discover Amazing Tours</h1>
      <p class="text-text-secondary text-lg mb-8">Unforgettable experiences across Rwanda</p>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card v-for="tour in tours" :key="tour.id" hover clickable padding="none" @click="router.push(`/tour/${tour.id}`)">
          <div class="relative h-64">
            <img loading="lazy" :src="tour.image" :alt="tour.name" class="w-full h-full object-cover rounded-t-card" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span class="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs mb-2">{{ tour.category }}</span>
              <h3 class="font-bold text-xl">{{ tour.name }}</h3>
            </div>
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-text-secondary text-sm flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ tour.duration }}
              </span>
              <span class="text-2xl font-bold text-brand-600">{{ currencyStore.formatPrice(tour.price) }}</span>
            </div>
            <p class="text-text-secondary text-sm">{{ tour.description }}</p>
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
import { supabase } from '@/services/supabase'

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
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    tours.value = (data || []).map(t => ({
      id: t.id,
      title: t.name,
      destination: t.destination,
      days: t.duration_days,
      price: t.price,
      rating: t.rating || 4.5,
      reviews: t.reviews_count || 0,
      category: t.category || 'Tour',
      image: t.main_image,
      description: t.description
    }))
  } catch (err) {
    console.error('Error loading tours:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTours()
})
</script>
