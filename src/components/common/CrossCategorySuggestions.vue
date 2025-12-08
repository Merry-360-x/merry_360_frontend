<template>
  <div v-if="suggestions.length > 0" class="mt-12 p-6 bg-gradient-to-br from-brand-50 to-red-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold text-text-primary dark:text-white mb-1">You might also like</h3>
        <p class="text-text-secondary dark:text-gray-300 text-sm">Enhance your trip with these suggestions</p>
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
          <h4 class="font-bold text-base text-text-primary dark:text-white mb-2 line-clamp-1">{{ suggestion.title }}</h4>
          <p class="text-text-secondary dark:text-gray-300 text-sm mb-3 line-clamp-2">{{ suggestion.description }}</p>
          <div class="flex items-center justify-between mb-2">
            <span class="text-brand-600 dark:text-brand-400 font-bold">{{ formatPrice(suggestion.price) }}</span>
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrencyStore } from '@/stores/currency'
import { useUserStore } from '@/stores/userStore'
import { useToast } from '@/composables/useToast'
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

// Mock suggestions based on category
const suggestions = computed(() => {
  const allSuggestions = {
    accommodation: [
      {
        id: 1,
        title: 'Airport Transfer Service',
        description: 'Convenient transport from airport to your accommodation',
        price: 50,
        category: 'Transport',
        type: 'transport',
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'
      },
      {
        id: 2,
        title: 'City Cultural Tour',
        description: 'Explore local culture and attractions',
        price: 75,
        category: 'Tour',
        type: 'tour',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400'
      },
      {
        id: 3,
        title: 'Restaurant Recommendations',
        description: 'Best local dining experiences nearby',
        price: 30,
        category: 'Service',
        type: 'service',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
      }
    ],
    tour: [
      {
        id: 4,
        title: 'Nearby Hotel Stay',
        description: 'Comfortable accommodation near tour location',
        price: 120,
        category: 'Accommodation',
        type: 'accommodation',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
      },
      {
        id: 5,
        title: 'Private Tour Transport',
        description: 'Exclusive vehicle for your tour group',
        price: 100,
        category: 'Transport',
        type: 'transport',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400'
      },
      {
        id: 6,
        title: 'Photography Package',
        description: 'Professional photos of your tour experience',
        price: 150,
        category: 'Service',
        type: 'service',
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400'
      }
    ],
    transport: [
      {
        id: 7,
        title: 'Destination Accommodation',
        description: 'Book your stay at your destination',
        price: 95,
        category: 'Accommodation',
        type: 'accommodation',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400'
      },
      {
        id: 8,
        title: 'Sightseeing Tour',
        description: 'Explore attractions along your route',
        price: 60,
        category: 'Tour',
        type: 'tour',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'
      },
      {
        id: 9,
        title: 'Travel Insurance',
        description: 'Comprehensive coverage for your journey',
        price: 25,
        category: 'Service',
        type: 'service',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400'
      }
    ]
  }
  
  return allSuggestions[props.currentCategory] || []
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
