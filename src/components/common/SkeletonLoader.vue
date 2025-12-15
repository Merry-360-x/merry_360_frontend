<template>
  <div class="animate-pulse">
    <!-- Property Card Skeleton -->
    <div v-if="type === 'card'" class="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
      <div class="aspect-square bg-gray-200"></div>
      <div class="p-4 space-y-3">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        <div class="flex justify-between items-center pt-2">
          <div class="h-6 bg-gray-200 rounded w-1/3"></div>
          <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- List Item Skeleton -->
    <div v-else-if="type === 'list'" class="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden p-4">
      <div class="flex gap-4">
        <div class="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div class="flex-1 space-y-3">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" class="space-y-2">
      <div v-for="i in lines" :key="i" class="h-4 bg-gray-200 rounded" :class="i === lines ? 'w-3/4' : 'w-full'"></div>
    </div>

    <!-- Form Skeleton -->
    <div v-else-if="type === 'form'" class="space-y-4">
      <div v-for="i in 3" :key="i">
        <div class="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div class="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>

    <!-- Avatar Skeleton -->
    <div v-else-if="type === 'avatar'" class="flex items-center gap-3">
      <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div class="flex-1 space-y-2">
        <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        <div class="h-2 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>

    <!-- Custom (flexible) -->
    <div v-else class="h-full bg-gray-200 rounded" :style="customStyle"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'card',
    validator: (value) => ['card', 'list', 'text', 'form', 'avatar', 'custom'].includes(value)
  },
  lines: {
    type: Number,
    default: 3
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '200px'
  }
})

const customStyle = computed(() => {
  if (props.type === 'custom') {
    return {
      width: props.width,
      height: props.height
    }
  }
  return {}
})
</script>
