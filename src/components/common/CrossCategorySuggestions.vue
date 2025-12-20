<template>
  <div v-if="suggestions.length > 0" class="mt-12 p-6 bg-gradient-to-br from-brand-50 to-red-50 rounded-2xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold text-text-primary mb-1">You might also like</h3>
        <p class="text-text-secondary text-sm">Enhance your trip with these suggestions</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card 
        v-for="suggestion in suggestions" 
        :key="suggestion.id"
        hover 
        clickable
        @click="navigateToSuggestion(suggestion)"
        class="overflow-hidden group"
      >
        <div class="relative h-40 overflow-hidden">
          <img loading="lazy" :src="suggestion.image" :alt="suggestion.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div class="absolute top-2 left-2">
            <span class="px-3 py-1 bg-brand-500 text-white text-xs font-semibold rounded-full">
              {{ suggestion.category }}
            </span>
          </div>
        </div>
        <div class="p-4">
          <h4 class="font-bold text-base text-text-primary mb-2 line-clamp-1">{{ suggestion.title }}</h4>
          <p class="text-text-secondary text-sm mb-3 line-clamp-2">{{ suggestion.description }}</p>
          <div class="flex items-center justify-between mb-2">
            <span class="text-brand-600 font-bold">{{ formatPrice(suggestion.price) }}</span>
            <Button size="sm" variant="primary" class="bg-gradient-to-r from-brand-500 to-brand-600">
              View
            </Button>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            full-width
            @click.stop="addToCart(suggestion)"
          >
            Add to Trip Cart
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrencyStore } from '@/stores/currency'
import { useUserStore } from '@/stores/userStore'
import { useToast } from '@/composables/useToast'
import api from '@/services/api'
import Card from './Card.vue'
import Button from './Button.vue'

const props = defineProps({
  currentCategory: {
    type: String,
    required: true
  },
  currentLocation: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const currencyStore = useCurrencyStore()
const userStore = useUserStore()
const { success } = useToast()

// Fetch suggestions from database based on category
const suggestions = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    // Fetch related items from database based on category
    if (props.currentCategory === 'accommodation') {
      // Suggest tours and transport
      const [tours, transport] = await Promise.all([
        api.tours.getAll({ limit: 2 }),
        api.transport.getRoutes({ limit: 1 })
      ])
      suggestions.value = [
        ...tours.map(t => ({ ...t, type: 'tour', category: 'Tour', title: t.title || t.name })),
        ...transport.map(t => ({ ...t, type: 'transport', category: 'Transport', title: t.service_type || t.name }))
      ].slice(0, 3)
    } else if (props.currentCategory === 'tour') {
      // Suggest accommodations and transport
      const [accommodations, transport] = await Promise.all([
        api.accommodations.getAll({ limit: 2 }),
        api.transport.getRoutes({ limit: 1 })
      ])
      suggestions.value = [
        ...accommodations.map(a => ({ ...a, type: 'accommodation', category: 'Accommodation', title: a.name, image: a.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' })),
        ...transport.map(t => ({ ...t, type: 'transport', category: 'Transport', title: t.service_type || t.name }))
      ].slice(0, 3)
    } else if (props.currentCategory === 'transport') {
      // Suggest accommodations and tours
      const [accommodations, tours] = await Promise.all([
        api.accommodations.getAll({ limit: 2 }),
        api.tours.getAll({ limit: 1 })
      ])
      suggestions.value = [
        ...accommodations.map(a => ({ ...a, type: 'accommodation', category: 'Accommodation', title: a.name, image: a.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' })),
        ...tours.map(t => ({ ...t, type: 'tour', category: 'Tour', title: t.title || t.name }))
      ].slice(0, 3)
    }
  } catch (error) {
    console.error('Error loading suggestions:', error)
    suggestions.value = []
  } finally {
    loading.value = false
  }
})

const formatPrice = (price) => {
  return currencyStore.formatPrice(price)
}

const navigateToSuggestion = (suggestion) => {
  if (suggestion.type === 'accommodation') {
    router.push('/accommodations')
  } else if (suggestion.type === 'tour') {
    router.push('/tours')
  } else if (suggestion.type === 'transport') {
    router.push('/transport')
  } else if (suggestion.type === 'service') {
    router.push('/services')
  }
}

const addToCart = (suggestion) => {
  const cartItem = {
    id: suggestion.id,
    type: suggestion.type,
    name: suggestion.title,
    price: suggestion.price,
    image: suggestion.image,
    addedAt: new Date()
  }
  
  userStore.addToCart(cartItem)
  success(`${suggestion.title} added to trip cart!`)
}
</script>
