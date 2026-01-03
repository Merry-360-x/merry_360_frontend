<template>
  <div class="progressive-image-wrapper" :class="{ loaded: isLoaded }">
    <img
      v-if="placeholder"
      :src="placeholder"
      :alt="alt"
      class="progressive-image-placeholder"
      :style="{ filter: `blur(${blurAmount}px)` }"
    />
    <img
      ref="mainImage"
      :data-src="optimizedSrc"
      :data-srcset="srcset"
      :alt="alt"
      class="progressive-image-main"
      :class="{ visible: isLoaded }"
      @load="onLoad"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { optimizeImageUrl, getPlaceholderUrl, getResponsiveSrcset } from '@/services/imageOptimization'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 800
  },
  quality: {
    type: String,
    default: 'auto:best'
  }
})

const mainImage = ref(null)
const isLoaded = ref(false)
const blurAmount = ref(20)
let observer = null

const optimizedSrc = computed(() => {
  return optimizeImageUrl(props.src, {
    width: props.width,
    quality: props.quality
  })
})

const placeholder = computed(() => {
  return getPlaceholderUrl(props.src)
})

const srcset = computed(() => {
  return getResponsiveSrcset(props.src)
})

const onLoad = () => {
  isLoaded.value = true
  // Smooth blur transition
  let blur = 20
  const interval = setInterval(() => {
    blur -= 2
    blurAmount.value = Math.max(0, blur)
    if (blur <= 0) clearInterval(interval)
  }, 30)
}

onMounted(() => {
  if (!mainImage.value) return

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = img.dataset.src
          const srcset = img.dataset.srcset
          
          // Load full resolution image
          const tempImg = new Image()
          tempImg.onload = () => {
            img.src = src
            if (srcset) img.srcset = srcset
          }
          tempImg.src = src
          
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '200px' // Load 200px before entering viewport
    })
    
    observer.observe(mainImage.value)
  } else {
    // Fallback for browsers without IntersectionObserver
    mainImage.value.src = optimizedSrc.value
    mainImage.value.srcset = srcset.value
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.progressive-image-wrapper {
  position: relative;
  overflow: hidden;
  background: #f3f4f6;
}

.progressive-image-placeholder,
.progressive-image-main {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.progressive-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  transition: filter 0.3s ease-out;
}

.progressive-image-main {
  opacity: 0;
  transition: opacity 0.6s ease-in;
}

.progressive-image-main.visible {
  opacity: 1;
}

.progressive-image-wrapper.loaded .progressive-image-placeholder {
  opacity: 0;
}
</style>
