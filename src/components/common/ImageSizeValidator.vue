<template>
  <div class="image-size-validator">
    <!-- File Size Warning -->
    <div v-if="showWarning" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-1">
            {{ t('imageValidator.sizeWarningTitle') }}
          </h3>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            {{ warningMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- Upload Guidelines -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-2">
            {{ t('imageValidator.guidelinesTitle') }}
          </h3>
          <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>✓ Maximum file size: <strong>10MB</strong></li>
            <li>✓ Recommended dimensions: <strong>1920x1080px</strong> or smaller</li>
            <li>✓ Supported formats: <strong>JPEG, PNG, WebP</strong></li>
            <li>✓ Images are automatically compressed for fast loading</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Quick Compress Tools Info -->
    <div class="mt-3 text-sm text-text-secondary">
      <p class="flex items-center">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Need to compress? Try: 
        <a href="https://tinypng.com" target="_blank" class="text-brand-600 hover:underline ml-1">TinyPNG</a>
        <span class="mx-1">or</span>
        <a href="https://squoosh.app" target="_blank" class="text-brand-600 hover:underline">Squoosh</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps({
  fileSize: {
    type: Number,
    default: 0
  },
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB default (Cloudinary compresses)
  },
  showWarning: {
    type: Boolean,
    default: false
  }
})

const { t } = useTranslation()

const warningMessage = computed(() => {
  if (!props.fileSize) {
    return t('imageValidator.defaultWarning')
  }
  
  const sizeMB = (props.fileSize / (1024 * 1024)).toFixed(2)
  const maxSizeMB = (props.maxSize / (1024 * 1024)).toFixed(2)
  
  if (props.fileSize > props.maxSize) {
    return t('imageValidator.sizeExceeded', { 
      size: sizeMB, 
      maxSize: maxSizeMB 
    })
  }
  
  if (props.fileSize > props.maxSize * 0.7) {
    return t('imageValidator.sizeLarge', { size: sizeMB })
  }
  
  return t('imageValidator.defaultWarning')
})
</script>

<style scoped>
.image-size-validator {
  /* Spacing handled by Tailwind */
}
</style>
