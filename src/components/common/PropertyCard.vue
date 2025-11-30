<template>
  <div 
    class="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-1"
    @click="goToDetail"
  >
    <!-- Image -->
    <div class="relative h-48 sm:h-56 md:h-60 overflow-hidden">
      <img 
        :src="property.image" 
        :alt="property.title"
        class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
      />
      
      <!-- Badge -->
      <span 
        v-if="property.badge"
        class="absolute top-3 left-3 px-2.5 py-1 text-white text-xs font-semibold rounded-full shadow-lg"
        :class="badgeClass"
      >
        {{ property.badge }}
      </span>

      <!-- Favorite Icon -->
      <button 
        @click.stop="toggleFavorite"
        class="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md hover:scale-110"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" :class="isFavorite ? 'text-primary fill-current' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="p-4 sm:p-5">
      <!-- Title -->
      <h3 class="font-bold text-base sm:text-lg text-text-primary mb-2 line-clamp-1 group-hover:text-primary transition-colors">
        {{ property.title }}
      </h3>

      <!-- Location -->
      <p class="flex items-center text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4">
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span class="line-clamp-1">{{ property.location }}</span>
      </p>

      <!-- Details -->
      <div class="flex items-center justify-between text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
        <div class="flex items-center">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span class="whitespace-nowrap">{{ property.beds }} Beds</span>
        </div>
        <div class="flex items-center">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
          </svg>
          <span class="whitespace-nowrap">{{ property.baths }} Baths</span>
        </div>
        <div class="flex items-center">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          <span class="whitespace-nowrap">{{ property.area }} sqft</span>
        </div>
      </div>

      <!-- Price -->
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span class="text-sm sm:text-base font-bold text-primary">${{ formatPrice(property.price) }}</span>
          <span class="text-text-secondary text-xs">/night</span>
        </div>
        <button 
          @click.stop="addToCart"
          class="px-2.5 py-1.5 bg-primary text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-1"
          title="Add to Cart"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span class="text-xs font-medium">Add</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const isFavorite = ref(false)

const badgeClass = computed(() => {
  const badgeType = props.property.badge?.toLowerCase()
  if (badgeType === 'featured') return 'bg-primary'
  if (badgeType === 'hot offer') return 'bg-orange-500'
  if (badgeType === 'new listing') return 'bg-green-500'
  return 'bg-primary'
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(price)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const addToCart = () => {
  // TODO: Implement cart functionality
  console.log('Added to cart:', props.property.title)
  // You can emit an event or use a store here
}

const viewDetails = () => {
  router.push(`/accommodation/${props.property.id}`)
}

const goToDetail = () => {
  router.push(`/accommodation/${props.property.id}`)
}
</script>
