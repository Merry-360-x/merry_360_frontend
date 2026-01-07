<template>
  <div>
    <h3 class="text-2xl font-semibold text-text-primary mb-2">{{ title }}</h3>
    <p class="text-text-secondary mb-8">{{ subtitle }}</p>

    <!-- Upload Area -->
    <div
      v-if="photos.length === 0"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all',
        isDragging
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      ]"
    >
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      <p class="text-lg font-semibold text-text-primary mb-2">Add photos</p>
      <p class="text-sm text-text-secondary">Drag and drop or click to upload</p>
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />
    </div>

    <!-- Photo Grid -->
    <div v-else>
      <div class="mb-4 flex items-center justify-between">
        <p class="text-sm font-medium text-text-secondary">
          Choose at least {{ minPhotos }} photos
          <br />
          <span class="text-xs">Drag to reorder</span>
        </p>
        <button
          @click="triggerFileInput"
          class="flex items-center gap-2 px-4 py-2 text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add more
        </button>
        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/*"
          @change="handleFileSelect"
          class="hidden"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Cover Photo (larger) -->
        <div
          v-if="photos.length > 0"
          class="col-span-2 relative aspect-video rounded-xl overflow-hidden group cursor-move"
          draggable="true"
          @dragstart="handleDragStart(0)"
          @dragover.prevent
          @drop="handlePhotoDrop(0)"
        >
          <img
            :src="photos[0].preview"
            :alt="'Cover photo'"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-3 left-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg text-sm font-semibold text-text-primary shadow-sm">
            Cover Photo
          </div>
          <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="removePhoto(0)"
              class="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            @click.stop="openPhotoModal(0)"
            class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/20 flex items-center justify-center transition-opacity"
          >
            <div class="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </button>
        </div>

        <!-- Other Photos -->
        <div
          v-for="(photo, index) in photos.slice(1)"
          :key="photo.id"
          class="relative aspect-square rounded-xl overflow-hidden group cursor-move"
          draggable="true"
          @dragstart="handleDragStart(index + 1)"
          @dragover.prevent
          @drop="handlePhotoDrop(index + 1)"
        >
          <img
            :src="photo.preview"
            :alt="`Photo ${index + 2}`"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="removePhoto(index + 1)"
              class="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            @click.stop="openPhotoModal(index + 1)"
            class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/20 flex items-center justify-center transition-opacity"
          >
            <div class="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </button>
        </div>

        <!-- Add more placeholder (if space available) -->
        <div
          v-if="photos.length < maxPhotos"
          @click="triggerFileInput"
          class="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-all"
        >
          <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span class="text-sm text-gray-500 dark:text-gray-400">Add photo</span>
        </div>
      </div>

      <!-- Upload Progress Indicator -->
      <div v-if="uploading" class="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <div class="flex items-center gap-3">
          <div class="animate-spin w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full"></div>
          <span class="text-sm text-text-secondary">Uploading {{ uploadProgress }} of {{ totalUploads }} items...</span>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <Teleport to="body">
      <div
        v-if="selectedPhotoIndex !== null"
        @click="closePhotoModal"
        class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      >
        <div @click.stop class="relative max-w-5xl max-h-[90vh] w-full">
          <button
            @click="closePhotoModal"
            class="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            :src="photos[selectedPhotoIndex]?.preview"
            :alt="`Photo ${selectedPhotoIndex + 1}`"
            class="w-full h-full object-contain rounded-xl"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Choose at least 5 photos'
  },
  subtitle: {
    type: String,
    default: 'Drag to reorder'
  },
  minPhotos: {
    type: Number,
    default: 5
  },
  maxPhotos: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['update:modelValue'])

const photos = ref([])
const fileInput = ref(null)
const isDragging = ref(false)
const draggedIndex = ref(null)
const selectedPhotoIndex = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const totalUploads = ref(0)

let photoIdCounter = 0

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files || [])
  await processFiles(files)
  // Reset input so same file can be selected again
  event.target.value = ''
}

const handleDrop = async (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files || []).filter(f => f.type.startsWith('image/'))
  await processFiles(files)
}

const processFiles = async (files) => {
  const remainingSlots = props.maxPhotos - photos.value.length
  const filesToProcess = files.slice(0, remainingSlots)

  if (filesToProcess.length === 0) return

  uploading.value = true
  totalUploads.value = filesToProcess.length
  uploadProgress.value = 0

  for (const file of filesToProcess) {
    const preview = URL.createObjectURL(file)
    photos.value.push({
      id: ++photoIdCounter,
      file,
      preview,
      uploaded: false
    })
    uploadProgress.value++

    // Simulate upload delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  uploading.value = false
  emit('update:modelValue', photos.value)
}

const removePhoto = (index) => {
  const photo = photos.value[index]
  if (photo.preview) {
    URL.revokeObjectURL(photo.preview)
  }
  photos.value.splice(index, 1)
  emit('update:modelValue', photos.value)
}

const handleDragStart = (index) => {
  draggedIndex.value = index
}

const handlePhotoDrop = (targetIndex) => {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return

  const draggedPhoto = photos.value[draggedIndex.value]
  photos.value.splice(draggedIndex.value, 1)
  photos.value.splice(targetIndex, 0, draggedPhoto)

  draggedIndex.value = null
  emit('update:modelValue', photos.value)
}

const openPhotoModal = (index) => {
  selectedPhotoIndex.value = index
}

const closePhotoModal = () => {
  selectedPhotoIndex.value = null
}

watch(() => props.modelValue, (newVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(photos.value)) {
    photos.value = newVal
  }
}, { deep: true })

// Cleanup on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  photos.value.forEach(photo => {
    if (photo.preview) {
      URL.revokeObjectURL(photo.preview)
    }
  })
})
</script>
