<template>
  <div 
    class="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-1 border border-transparent dark:border-gray-700"
    @click="goToDetail"
  >
    <!-- Image Gallery -->
    <div 
      class="relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700"
      @mouseenter="startAutoScroll"
      @mouseleave="stopAutoScroll"
    >
      <!-- Main Image with Cloudinary Optimization -->
      <img loading="lazy" 
        :src="optimizeImage(currentImage)" 
        :alt="property.title"
        @error="handleImageError"
        class="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
      />
      
      <!-- Placeholder when image fails to load -->
      <div v-if="imageError" class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ property.title }}</p>
        </div>
      </div>
      
      <!-- Image Navigation Dots -->
      <div v-if="propertyImages.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        <button
          v-for="(img, index) in propertyImages.slice(0, 5)"
          :key="index"
          @click.stop="currentImageIndex = index"
          class="w-1.5 h-1.5 rounded-full transition-all"
          :class="currentImageIndex === index ? 'bg-white w-4' : 'bg-white/60 hover:bg-white/80'"
        ></button>
        <button
          v-if="propertyImages.length > 5"
          @click.stop="showAllImages"
          class="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-gray-800 hover:bg-white transition-all"
        >
          +{{ propertyImages.length - 5 }}
        </button>
      </div>
      
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
        <svg class="w-4 h-4 sm:w-5 sm:h-5" :class="isFavorite ? 'text-brand-500 fill-current' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </button>

      <!-- Image Navigation Arrows -->
      <button
        v-if="propertyImages.length > 1"
        @click.stop="previousImage"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md opacity-0 group-hover:opacity-100"
      >
        <svg class="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <button
        v-if="propertyImages.length > 1"
        @click.stop="nextImage"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md opacity-0 group-hover:opacity-100"
      >
        <svg class="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="p-2 sm:p-3">
      <!-- Title -->
      <h3 class="font-bold text-base sm:text-lg text-text-primary mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">
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
      <div class="flex items-center justify-between text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
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
        <div class="flex items-baseline gap-1">
          <span class="text-sm sm:text-base font-bold text-brand-600">{{ formatPrice(property.price) }}</span>
          <span class="text-text-secondary text-xs whitespace-nowrap">/night</span>
        </div>
        <button 
          @click.stop="addToCart"
          class="px-2.5 py-1.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all duration-200 flex items-center gap-1 shadow-sm"
          title="Add to Trip"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4"></path>
          </svg>
          <span class="text-xs font-medium">Add</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrencyStore } from '@/stores/currency'
import { useUserStore } from '@/stores/userStore'
import { useToast } from '../../composables/useToast.js'
import { optimizeImageUrl } from '@/services/imageOptimization'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const currencyStore = useCurrencyStore()
const { success } = useToast()
const userStore = useUserStore()
const isFavorite = ref(false)
const currentImageIndex = ref(0)
const imageError = ref(false)
let autoScrollInterval = null

// Handle multiple images - use property.images array or fallback to single image
const propertyImages = computed(() => {
  if (props.property.images && Array.isArray(props.property.images)) {
    return props.property.images
  }
  // Fallback to single image or generate placeholder images
  return props.property.image ? [
    props.property.image,
    props.property.image,
    props.property.image,
    props.property.image,
    props.property.image
  ] : []
})

const currentImage = computed(() => {
  return propertyImages.value[currentImageIndex.value] || props.property.image
})

// Optimize images with Cloudinary for 10x size reduction
const optimizeImage = (url) => {
  if (!url) {
    imageError.value = true
    return ''
  }
  return optimizeImageUrl(url, {
    width: 600, // Resize to 600px width (sufficient for card display)
    quality: 'auto:eco' // Eco quality for 10x compression
  })
}

const handleImageError = () => {
  imageError.value = true
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = propertyImages.value.length - 1
  }
}

const nextImage = () => {
  if (currentImageIndex.value < propertyImages.value.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0
  }
}

const showAllImages = () => {
  // Navigate to detail page to show all images
  goToDetail()
}

const badgeClass = computed(() => {
  const badgeType = props.property.badge?.toLowerCase()
  if (badgeType === 'featured') return 'bg-primary'
  if (badgeType === 'hot offer') return 'bg-orange-500'
  if (badgeType === 'new listing') return 'bg-brand-500'
  return 'bg-primary'
})

const formatPrice = (price) => {
  return currencyStore.formatPrice(price)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const addToCart = () => {
  const cartItem = {
    id: props.property.id,
    type: 'accommodation',
    name: props.property.title,
    location: props.property.location,
    price: props.property.price,
    image: props.property.image,
    beds: props.property.beds,
    baths: props.property.baths
  }
  userStore.addToCart(cartItem)
  success(`${props.property.title} added to cart!`)
}

const viewDetails = () => {
  router.push(`/accommodation/${props.property.id}`)
}

const goToDetail = () => {
  router.push(`/accommodation/${props.property.id}`)
}

const startAutoScroll = () => {
  if (propertyImages.value.length > 1) {
    autoScrollInterval = setInterval(() => {
      nextImage()
    }, 1500) // Change image every 1.5 seconds
  }
}

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
}

onUnmounted(() => {
  stopAutoScroll()
})
</script>
