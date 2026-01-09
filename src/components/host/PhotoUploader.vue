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
        @change="openUploadModal"
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
          @change="openUploadModal"
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

    <!-- Upload Modal -->
    <Teleport to="body">
      <div
        v-if="showUploadModal"
        @click="cancelUpload"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      >
        <div @click.stop class="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              @click="cancelUpload"
              :disabled="uploading"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="text-center">
              <h3 class="font-semibold text-lg text-text-primary">Upload photos</h3>
              <p class="text-sm text-text-secondary">
                <span v-if="uploading">
                  {{ uploadProgress }} of {{ totalUploads }} {{ totalUploads === 1 ? 'item' : 'items' }} uploaded
                </span>
                <span v-else>
                  {{ pendingPhotos.length }} {{ pendingPhotos.length === 1 ? 'item' : 'items' }} selected
                </span>
              </p>
            </div>
            <button
              @click="triggerFileInput"
              :disabled="uploading"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

          <!-- Preview Area -->
          <div class="p-6 max-h-96 overflow-y-auto">
            <div class="space-y-3">
              <div
                v-for="(photo, index) in pendingPhotos"
                :key="photo.id"
                class="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div class="relative aspect-video bg-gray-100 dark:bg-gray-800">
                <img
                  :src="photo.preview"
                  :alt="`Photo ${index + 1}`"
                  class="w-full h-full object-cover"
                />
                  <!-- Upload Progress Overlay -->
                  <div 
                    v-if="uploading && individualProgress.has(photo.id)"
                    class="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <div class="text-center">
                      <div class="relative w-16 h-16 mx-auto mb-2">
                        <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                          <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.3)" stroke-width="4" fill="none" />
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="28" 
                            stroke="white" 
                            stroke-width="4" 
                            fill="none"
                            :stroke-dasharray="175.9"
                            :stroke-dashoffset="175.9 - (175.9 * (individualProgress.get(photo.id) || 0) / 100)"
                            stroke-linecap="round"
                            class="transition-all duration-300"
                          />
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          {{ Math.round(individualProgress.get(photo.id) || 0) }}%
                        </div>
                      </div>
                      <p class="text-white text-xs">{{ individualProgress.get(photo.id) === 100 ? 'Uploaded' : 'Uploading...' }}</p>
                    </div>
                  </div>
                  <!-- Loading Spinner -->
                  <div 
                    v-else-if="uploading && !individualProgress.has(photo.id)"
                    class="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <div class="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                <button
                    v-if="!uploading"
                  @click="removePendingPhoto(index)"
                    class="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="cancelUpload"
              :disabled="uploading"
              class="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-text-primary font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              @click="confirmUpload"
              :disabled="uploading"
              class="flex-1 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
            >
              <span v-if="uploading">Uploading…</span>
              <span v-else>Upload</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Photo Preview Modal -->
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
import { ref, defineProps, defineEmits, watch, onUnmounted } from 'vue'
import { useToast } from '../../composables/useToast'
import { uploadToCloudinary } from '../../services/cloudinary'
import { optimizeImageFile } from '../../utils/imageOptimization'
import { IMAGE_UPLOAD_RULES, getImageValidationError, getFinalImageSizeError } from '../../utils/imageUploadRules'
import { beginGlobalUpload, endGlobalUpload } from '../../utils/globalUploadState'

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
  },
  uploading: {
    type: Boolean,
    default: false
  },
  folder: {
    type: String,
    default: 'merry360x/uploads'
  }
})

const emit = defineEmits(['update:modelValue', 'update:uploading'])

const photos = ref([])
const pendingPhotos = ref([])
const showUploadModal = ref(false)
const fileInput = ref(null)
const isDragging = ref(false)
const draggedIndex = ref(null)
const selectedPhotoIndex = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const totalUploads = ref(0)
const individualProgress = ref(new Map()) // Track progress for each image

let photoIdCounter = 0

const { showToast } = useToast()

const isCloudinaryConfigured = () =>
  Boolean(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

watch(uploading, (v) => emit('update:uploading', Boolean(v)))

const isTrackedGlobally = ref(false)
watch(
  uploading,
  (v) => {
    if (v && !isTrackedGlobally.value) {
      beginGlobalUpload()
      isTrackedGlobally.value = true
    } else if (!v && isTrackedGlobally.value) {
      endGlobalUpload()
      isTrackedGlobally.value = false
    }
  },
  { immediate: true }
)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const openUploadModal = async (event) => {
  const files = Array.from(event.target.files || [])
  if (files.length > 0) {
    const remainingSlots = props.maxPhotos - photos.value.length
    const filesToUse = files.slice(0, Math.max(0, remainingSlots))

    const invalid = filesToUse
      .map((f) => ({ file: f, err: getImageValidationError(f, IMAGE_UPLOAD_RULES) }))
      .filter((x) => x.err)
    if (invalid.length > 0) {
      showToast(invalid[0].err, 'error')
      event.target.value = ''
      return
    }

    // Create pending photos
    pendingPhotos.value = filesToUse.map((file) => ({
      id: photoIdCounter++,
      file,
      preview: URL.createObjectURL(file)
    }))
    showUploadModal.value = true
  }
  // Reset input
  event.target.value = ''
}

const removePendingPhoto = (index) => {
  const photo = pendingPhotos.value[index]
  URL.revokeObjectURL(photo.preview)
  pendingPhotos.value.splice(index, 1)
  
  if (pendingPhotos.value.length === 0) {
    showUploadModal.value = false
  }
}

const confirmUpload = async () => {
  if (!pendingPhotos.value.length) return

  uploading.value = true
  totalUploads.value = pendingPhotos.value.length
  uploadProgress.value = 0

  const useCloudinary = isCloudinaryConfigured()
  if (!useCloudinary) {
    showToast('Uploads require Cloudinary configuration. Please try again later.', 'error')
    uploading.value = false
    return
  }

  try {
    const uploaded = []
    individualProgress.value.clear()

    for (let i = 0; i < pendingPhotos.value.length; i++) {
      const item = pendingPhotos.value[i]
      const file = item.file
      const inputErr = getImageValidationError(file, IMAGE_UPLOAD_RULES)
      if (inputErr) throw new Error(inputErr)

      // Set initial progress
      individualProgress.value.set(item.id, 0)

      // Optimize image before upload - Cloudinary will further compress on server.
      individualProgress.value.set(item.id, 20) // 20% for optimization
      const optimized = await optimizeImageFile(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 })
      const finalSizeError = getFinalImageSizeError(optimized, IMAGE_UPLOAD_RULES)
      if (finalSizeError) throw new Error(finalSizeError)

      // Upload with progress simulation (Cloudinary doesn't provide real progress)
      individualProgress.value.set(item.id, 40) // 40% for upload start
      const result = await uploadToCloudinary(optimized, { folder: props.folder })
      individualProgress.value.set(item.id, 90) // 90% for upload complete
      
      const url = result.secure_url

      uploaded.push({
        id: ++photoIdCounter,
        preview: url,
        url
      })

      individualProgress.value.set(item.id, 100) // 100% complete
      uploadProgress.value++

      // Clean up local preview URL after upload
      if (item.preview) URL.revokeObjectURL(item.preview)
    }

    photos.value.push(...uploaded)
    emit('update:modelValue', photos.value)

    showUploadModal.value = false
    pendingPhotos.value = []
  } catch (e) {
    console.error('Photo upload failed:', e)
    showToast(e?.message || 'Upload failed. Please try again.', 'error')
  } finally {
    uploading.value = false
  }
}

const cancelUpload = () => {
  if (uploading.value) return
  // Clean up pending photos
  pendingPhotos.value.forEach(photo => {
    URL.revokeObjectURL(photo.preview)
  })
  pendingPhotos.value = []
  showUploadModal.value = false
}

const handleDrop = async (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'))

  const remainingSlots = props.maxPhotos - photos.value.length
  const filesToUse = files.slice(0, Math.max(0, remainingSlots))
  if (!filesToUse.length) return

  const invalid = filesToUse
    .map((f) => ({ file: f, err: getImageValidationError(f, IMAGE_UPLOAD_RULES) }))
    .filter((x) => x.err)
  if (invalid.length > 0) {
    showToast(invalid[0].err, 'error')
    return
  }

  pendingPhotos.value = filesToUse.map((file) => ({
    id: photoIdCounter++,
    file,
    preview: URL.createObjectURL(file)
  }))
  showUploadModal.value = true
}

const removePhoto = (index) => {
  const photo = photos.value[index]
  if (String(photo?.preview || '').startsWith('blob:')) URL.revokeObjectURL(photo.preview)
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

// Watch for modal state to manage body scroll
watch(showUploadModal, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (isTrackedGlobally.value) {
    endGlobalUpload()
    isTrackedGlobally.value = false
  }

  photos.value.forEach(photo => {
    // Only revoke blob: URLs; Cloudinary/Data URLs should not be revoked.
    if (String(photo.preview || '').startsWith('blob:')) URL.revokeObjectURL(photo.preview)
  })
  
  // Ensure body scroll is restored
  document.body.style.overflow = ''
  
  // Close modal if open
  showUploadModal.value = false
})
</script>
