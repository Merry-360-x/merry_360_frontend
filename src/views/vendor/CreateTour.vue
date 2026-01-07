<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div class="mb-8">
          <router-link :to="dashboardPath" class="text-brand-600 hover:text-brand-700 flex items-center gap-2 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Tour</h1>
          <p class="text-gray-600">Create a new tour experience for travelers</p>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center gap-2 text-green-800">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">Tour created successfully!</span>
          </div>
        </div>

        <!-- Form -->
        <Card padding="lg">
          <form @submit.prevent="handleSubmit">
            <!-- Basic Information -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tour Title *</label>
                  <Input 
                    v-model="form.title" 
                    placeholder="E.g., Gorilla Trekking Adventure"
                    :class="errors.title ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <Input 
                    v-model="form.location" 
                    placeholder="E.g., Volcanoes National Park"
                    :class="errors.location ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.location" class="mt-1 text-sm text-red-600">{{ errors.location }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea 
                    v-model="form.description"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-900"
                    placeholder="Describe your tour experience..."
                    :class="errors.description ? 'border-red-500' : ''"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                </div>
              </div>
            </div>

            <!-- Tour Details -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Tour Details</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                  <Input 
                    v-model="form.duration" 
                    placeholder="E.g., 3 Days 2 Nights"
                    :class="errors.duration ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.duration" class="mt-1 text-sm text-red-600">{{ errors.duration }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty Level *</label>
                  <select 
                    v-model="form.difficulty"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-900"
                    :class="errors.difficulty ? 'border-red-500' : ''"
                  >
                    <option value="">Select difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                  <p v-if="errors.difficulty" class="mt-1 text-sm text-red-600">{{ errors.difficulty }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Price per Person (USD) *</label>
                  <Input 
                    v-model.number="form.price" 
                    type="number"
                    placeholder="0"
                    :class="errors.price ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Group Size (max) *</label>
                  <Input 
                    v-model.number="form.groupSize" 
                    type="number"
                    placeholder="8"
                    :class="errors.groupSize ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.groupSize" class="mt-1 text-sm text-red-600">{{ errors.groupSize }}</p>
                </div>
              </div>
            </div>

            <!-- Images -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Images</h2>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Upload Images *</label>
                <div 
                  class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-500 transition-colors cursor-pointer"
                  @click="$refs.tourImageInput.click()"
                >
                  <input 
                    ref="tourImageInput"
                    type="file" 
                    accept="image/jpeg,image/png,image/webp" 
                    multiple 
                    class="hidden" 
                    @change="handleImageUpload"
                  />
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p class="text-gray-600 font-medium mb-1">Click to upload images</p>
                  <p class="text-sm text-gray-500">Maximum 2MB per image (JPEG, PNG, WebP)</p>
                </div>
                <p v-if="errors.image" class="mt-2 text-sm text-red-600">{{ errors.image }}</p>
                <p v-if="uploading" class="mt-2 text-sm text-brand-600">Uploading images...</p>
              </div>

              <!-- Uploaded Images Preview -->
              <div v-if="uploadedImages.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  v-for="(img, index) in uploadedImages" 
                  :key="img.id"
                  class="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group"
                >
                  <img 
                    v-if="img.status === 'ready'" 
                    :src="img.url" 
                    :alt="`Tour image ${index + 1}`" 
                    class="w-full h-full object-cover" 
                  />
                  <div v-else-if="img.status === 'uploading'" class="absolute inset-0 flex items-center justify-center">
                    <svg class="animate-spin h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div v-else-if="img.status === 'error'" class="absolute inset-0 flex items-center justify-center bg-red-50">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <button 
                    @click="removeImage(index)"
                    type="button"
                    class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  <div v-if="index === 0" class="absolute bottom-2 left-2 px-2 py-1 bg-brand-600 text-white text-xs rounded">
                    Main
                  </div>
                </div>
              </div>
            </div>

            <!-- Inclusions -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label v-for="inclusion in availableInclusions" :key="inclusion" class="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    :value="inclusion" 
                    v-model="form.inclusions"
                    class="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span class="text-sm text-gray-700">{{ inclusion }}</span>
                </label>
              </div>
            </div>

            <!-- Itinerary -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Itinerary (optional)</h2>
              <textarea 
                v-model="form.itinerary"
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-900"
                placeholder="Day 1: Arrival and briefing&#10;Day 2: Trek to see gorillas&#10;Day 3: Return journey"
              ></textarea>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-4">
              <Button type="submit" variant="primary" :disabled="isSubmitting">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Creating...' : 'Create Tour' }}
              </Button>
              <Button type="button" variant="secondary" @click="$router.push(dashboardPath)">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '../../composables/useToast'
import { useUserStore } from '../../stores/userStore'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'
import api from '../../services/api'
import { uploadToCloudinary } from '../../services/cloudinary'
import { optimizeImageFile, fileToDataUrl } from '../../utils/imageOptimization'
import { IMAGE_UPLOAD_RULES, getImageValidationError, getFinalImageSizeError } from '@/utils/imageUploadRules'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()
const userStore = useUserStore()

// Determine dashboard path based on user role and current route
const dashboardPath = computed(() => {
  if (route.path.startsWith('/admin')) return '/admin'
  if (route.path.startsWith('/staff')) return '/staff'
  if (route.path.startsWith('/host')) return '/host'
  return '/vendor'
})

const form = ref({
  title: '',
  location: '',
  description: '',
  duration: '',
  difficulty: '',
  price: null,
  groupSize: 8,
  inclusions: [],
  itinerary: ''
})

const errors = ref({})
const isSubmitting = ref(false)
const showSuccess = ref(false)
const uploading = ref(false)
const uploadedImages = ref([])

const availableInclusions = [
  'Accommodation', 'Meals', 'Transport', 'Guide', 
  'Park Fees', 'Equipment', 'Insurance', 'Water',
  'Snacks', 'Photography', 'First Aid', 'Permits'
]

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return

  // Validate inputs early (type + extreme size).
  const invalid = files
    .map((f) => ({ file: f, err: getImageValidationError(f) }))
    .filter((x) => x.err)
  if (invalid.length > 0) {
    showToast(invalid[0].err, 'error')
    return
  }
  
  // Warn about large files (over 1MB)
  const largeFiles = files.filter(file => file.size > 1 * 1024 * 1024)
  if (largeFiles.length > 0) {
    const totalSizeMB = (largeFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)
    showToast(`Large files detected (${totalSizeMB}MB total). Upload may take longer.`, 'warning', 1000)
  }

  uploading.value = true
  event.target.value = ''

  const isCloudinaryConfigured = Boolean(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  )

  const tasks = files.map((file) => async () => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const previewUrl = URL.createObjectURL(file)

    uploadedImages.value.push({ id, url: previewUrl, status: 'uploading' })

    const updateById = (patch) => {
      const idx = uploadedImages.value.findIndex((img) => img.id === id)
      if (idx === -1) {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        return
      }
      uploadedImages.value[idx] = { ...uploadedImages.value[idx], ...patch }
    }

    try {
      const optimized = await optimizeImageFile(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 })

      const finalSizeError = getFinalImageSizeError(optimized, IMAGE_UPLOAD_RULES)
      if (finalSizeError) throw new Error(finalSizeError)

      if (isCloudinaryConfigured) {
        const result = await uploadToCloudinary(optimized, { folder: 'merry360x/tours' })
        updateById({ url: result.secure_url, status: 'ready' })
      } else {
        const dataUrl = await fileToDataUrl(optimized)
        updateById({ url: dataUrl, status: 'ready' })
      }
    } catch (error) {
      console.error('Upload error:', error)
      updateById({ status: 'error' })
      showToast(`Failed to upload ${file.name}`, 'error')
    } finally {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  })

  // Run uploads with concurrency limit
  const runWithConcurrency = async (tasks, limit = 3) => {
    const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
      while (tasks.length) {
        const task = tasks.shift()
        if (task) await task()
      }
    })
    await Promise.all(workers)
  }

  await runWithConcurrency(tasks, 3)
  uploading.value = false
}

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title) errors.value.title = 'Title is required'
  if (!form.value.location) errors.value.location = 'Location is required'
  if (!form.value.description) errors.value.description = 'Description is required'
  if (!form.value.duration) errors.value.duration = 'Duration is required'
  if (!form.value.difficulty) errors.value.difficulty = 'Difficulty level is required'
  if (!form.value.price || form.value.price <= 0) errors.value.price = 'Valid price is required'
  if (!form.value.groupSize || form.value.groupSize <= 0) errors.value.groupSize = 'Group size is required'
  if (uploadedImages.value.length === 0) errors.value.image = 'At least one image is required'
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showToast('Please fix all errors', 'error')
    return
  }

  isSubmitting.value = true

  try {
    // Get all uploaded image URLs
    const imageUrls = uploadedImages.value
      .filter(img => img.status === 'ready')
      .map(img => img.url)

    const tourData = {
      title: form.value.title,
      location: form.value.location,
      description: form.value.description,
      duration: form.value.duration,
      difficulty: form.value.difficulty,
      price: form.value.price,
      group_size: form.value.groupSize,
      image: imageUrls[0], // First image is main image
      images: imageUrls,
      inclusions: form.value.inclusions,
      itinerary: form.value.itinerary
    }
    
    await api.tours.create(tourData)
    
    showSuccess.value = true
    showToast('Tour created successfully!', 'success')
    
    setTimeout(() => {
      router.push(dashboardPath.value)
    }, 2000)
  } catch (error) {
    console.error('Tour creation error:', error)
    showToast(error.message || 'Failed to create tour', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
