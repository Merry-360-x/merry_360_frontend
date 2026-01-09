<template>
  <div 
    class="cursor-pointer group"
    @click="goToDetail"
  >
    <!-- Image -->
    <div 
      class="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
      @mouseenter="startAutoScroll"
      @mouseleave="stopAutoScroll"
    >
      <!-- Sliding Image Container -->
      <div 
        class="flex h-full transition-transform duration-500 ease-out"
        :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
      >
        <div 
          v-for="(image, index) in propertyImages" 
          :key="index"
          class="min-w-full h-full flex-shrink-0"
        >
          <img 
            :loading="(index === 0 && priority) ? 'eager' : 'lazy'"
            :fetchpriority="(index === 0 && priority) ? 'high' : 'auto'"
            :src="optimizeImage(image)" 
            :alt="`${property.title} - Image ${index + 1}`"
            @error="handleImageError"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
      
      <!-- Placeholder when image fails to load -->
      <div v-if="imageError && propertyImages.length === 0" class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <svg class="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
      
      <!-- Image Navigation Dots -->
      <div v-if="propertyImages.length > 1" class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        <button
          v-for="(img, index) in Math.min(propertyImages.length, 5)"
          :key="index"
          @click.stop="jumpToImage(index)"
          class="w-1.5 h-1.5 rounded-full transition-all"
          :class="currentImageIndex === index ? 'bg-white' : 'bg-white/50'"
        ></button>
      </div>

      <!-- Favorite Icon -->
      <button 
        @click.stop="toggleFavorite"
        class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center transition-transform hover:scale-110"
      >
        <svg 
          class="w-6 h-6 drop-shadow-md" 
          :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-white fill-white/30 stroke-white'"
          :fill="isFavorite ? 'currentColor' : 'currentColor'" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </button>

      <!-- Image Navigation Arrows (show on hover) -->
      <button
        v-if="propertyImages.length > 1"
        @click.stop="previousImage"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
      >
        <svg class="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <button
        v-if="propertyImages.length > 1"
        @click.stop="nextImage"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
      >
        <svg class="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- Content - Clean & Minimal -->
    <div class="pt-2">
      <!-- Location & Title -->
      <div class="flex items-start justify-between gap-1">
        <h3 class="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
          {{ property.location || property.title }}
        </h3>
        <!-- Rating -->
        <div v-if="property.rating" class="flex items-center gap-0.5 flex-shrink-0">
          <svg class="w-3 h-3 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span class="text-xs text-gray-900 dark:text-white">{{ property.rating }}</span>
        </div>
      </div>
      
      <!-- Property Type or Title -->
      <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
        {{ property.title !== property.location ? property.title : (property.type || 'Entire place') }}
      </p>
      
      <!-- Details Row -->
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {{ property.beds || 1 }} bed{{ property.beds !== 1 ? 's' : '' }} · {{ property.baths || 1 }} bath{{ property.baths !== 1 ? 's' : '' }}
      </p>
      
      <!-- Price -->
      <p class="mt-1">
        <span class="font-semibold text-sm text-gray-900 dark:text-white">{{ formatPrice(property.price) }}</span>
        <span class="text-xs text-gray-500 dark:text-gray-400"> night</span>
      </p>
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
  },
  priority: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const currencyStore = useCurrencyStore()
const { success } = useToast()
const userStore = useUserStore()
const currentImageIndex = ref(0)
const imageError = ref(false)
let autoScrollInterval = null

// Check if property is in wishlist
const isFavorite = computed(() => {
  return userStore.isInWatchlist(props.property.id, 'accommodation')
})

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

const jumpToImage = (index) => {
  currentImageIndex.value = index
  // Restart auto-scroll from this image
  if (autoScrollInterval) {
    stopAutoScroll()
    startAutoScroll()
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
  if (isFavorite.value) {
    userStore.removeFromWatchlist(props.property.id, 'accommodation')
  } else {
    userStore.addToWatchlist({
      id: props.property.id,
      type: 'accommodation',
      name: props.property.title,
      location: props.property.location,
      price: props.property.price,
      image: props.property.image || props.property.images?.[0]
    })
    success('Added to wishlist!')
  }
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
    }, 2000) // Change image every 2 seconds
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
