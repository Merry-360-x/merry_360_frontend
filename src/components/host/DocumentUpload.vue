<template>
  <div>
    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ label }} *</label>
    
    <!-- Upload Button/Preview -->
    <div v-if="!document" @click="triggerFileInput" class="cursor-pointer">
      <div class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-secondary rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-all text-center">
        <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="text-sm font-medium">Choose File</p>
      </div>
      <input
        ref="fileInput"
        type="file"
        @change="handleFileSelect"
        :accept="accept"
        required
        class="hidden"
      />
    </div>

    <!-- Document Preview -->
    <div v-else class="space-y-2">
      <div class="flex items-center gap-3 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <svg v-if="document.file.type.startsWith('image/')" class="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
          <path d="M7 8h6v1H7V8zm0 2h6v1H7v-1zm0 2h4v1H7v-1z"/>
        </svg>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-text-primary truncate">{{ document.file.name }}</p>
          <p class="text-xs text-text-secondary">{{ formatFileSize(document.file.size) }}</p>
        </div>
        <button
          @click="viewDocument"
          type="button"
          class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
        >
          View
        </button>
        <button
          @click="removeDocument"
          type="button"
          class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ hint }}</p>

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
            <button @click="cancelUpload" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="text-center">
              <h3 class="font-semibold text-lg text-text-primary">Upload document</h3>
              <p class="text-sm text-text-secondary">1 item selected</p>
            </div>
            <div class="w-6"></div>
          </div>

          <!-- Preview Area -->
          <div class="p-6">
            <div v-if="pendingDocument" class="relative rounded-xl overflow-hidden">
              <img
                v-if="pendingDocument.file.type.startsWith('image/')"
                :src="pendingDocument.preview"
                :alt="pendingDocument.file.name"
                class="w-full h-auto max-h-96 object-contain bg-gray-100 dark:bg-gray-900"
              />
              <div v-else class="bg-gray-100 dark:bg-gray-800 p-8 flex flex-col items-center gap-3 rounded-xl">
                <svg class="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
                  <path d="M7 8h6v1H7V8zm0 2h6v1H7v-1zm0 2h4v1H7v-1z"/>
                </svg>
                <div class="text-center">
                  <p class="font-medium text-text-primary">{{ pendingDocument.file.name }}</p>
                  <p class="text-xs text-text-secondary mt-1">{{ formatFileSize(pendingDocument.file.size) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="cancelUpload"
              :disabled="isUploading"
              class="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-text-primary font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              @click="confirmUpload"
              :disabled="isUploading"
              class="flex-1 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
            >
              <span v-if="isUploading" class="inline-flex items-center gap-2">
                <span class="animate-spin w-4 h-4 border-2 border-white/80 dark:border-gray-900/80 border-t-transparent rounded-full"></span>
                Uploading...
              </span>
              <span v-else>Upload</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- View Modal -->
    <Teleport to="body">
      <div
        v-if="showViewModal"
        @click="closeViewModal"
        class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      >
        <div @click.stop class="relative max-w-4xl max-h-[90vh] w-full">
          <button
            @click="closeViewModal"
            class="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            v-if="document?.file.type.startsWith('image/')"
            :src="document?.preview"
            :alt="document?.file.name"
            class="w-full h-full object-contain rounded-xl"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useToast } from '../../composables/useToast'
import { uploadDocumentToCloudinary } from '../../services/cloudinary'
import { getDocumentValidationError } from '../../utils/documentUploadRules'
import { beginGlobalUpload, endGlobalUpload } from '../../utils/globalUploadState'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  label: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    default: 'Upload a clear photo or PDF'
  },
  accept: {
    type: String,
    default: 'image/*,.pdf'
  }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const document = ref(props.modelValue)
const pendingDocument = ref(null)
const showUploadModal = ref(false)
const showViewModal = ref(false)
const isUploading = ref(false)

const isTrackedGlobally = ref(false)
watch(
  isUploading,
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

const { showToast } = useToast()

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const err = getDocumentValidationError(file)
    if (err) {
      showToast(err, 'error')
      event.target.value = ''
      return
    }

    pendingDocument.value = {
      file: file,
      preview: URL.createObjectURL(file)
    }
    showUploadModal.value = true
  }
  event.target.value = ''
}

const confirmUpload = async () => {
  if (!pendingDocument.value?.file) return

  const file = pendingDocument.value.file
  const err = getDocumentValidationError(file)
  if (err) {
    showToast(err, 'error')
    return
  }

  const hasCloudinary = Boolean(
    String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim() &&
      String(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim()
  )

  if (!hasCloudinary) {
    showToast('Uploads require Cloudinary configuration. Please try again later.', 'error')
    return
  }

  isUploading.value = true
  try {
    const result = await uploadDocumentToCloudinary(file, { folder: 'merry360x/documents' })
    const uploadedUrl = result?.secure_url || result?.url || null

    if (!uploadedUrl) {
      throw new Error('Upload failed. Please try again.')
    }

    document.value = {
      ...pendingDocument.value,
      url: uploadedUrl,
      status: 'ready'
    }
    emit('update:modelValue', document.value)
    showUploadModal.value = false
    pendingDocument.value = null
  } catch (e) {
    console.error('Document upload failed:', e)
    showToast(e?.message || 'Upload failed. Please try again.', 'error')
  } finally {
    isUploading.value = false
  }
}

const cancelUpload = () => {
  if (isUploading.value) return
  if (pendingDocument.value) {
    URL.revokeObjectURL(pendingDocument.value.preview)
    pendingDocument.value = null
  }
  showUploadModal.value = false
}

const removeDocument = () => {
  if (document.value) {
    URL.revokeObjectURL(document.value.preview)
    document.value = null
    emit('update:modelValue', null)
  }
}

const viewDocument = () => {
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Cleanup on unmount
onUnmounted(() => {
  if (isTrackedGlobally.value) {
    endGlobalUpload()
    isTrackedGlobally.value = false
  }

  if (document.value) {
    URL.revokeObjectURL(document.value.preview)
  }
  if (pendingDocument.value) {
    URL.revokeObjectURL(pendingDocument.value.preview)
  }
})
</script>
