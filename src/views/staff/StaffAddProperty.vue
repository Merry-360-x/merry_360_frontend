<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div class="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div class="mb-8">
          <router-link to="/staff" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Add New Property</h1>
          <p class="text-gray-600 dark:text-gray-400">Fill in the details to list a new property</p>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div class="flex items-center gap-2 text-green-800 dark:text-green-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">Property added successfully!</span>
          </div>
        </div>

        <!-- Form -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-200">
          <form @submit.prevent="handleSubmit">
            <!-- Basic Information -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Basic Information</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Title *</label>
                  <input 
                    v-model="form.title"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., Luxury Lake View Villa"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Type *</label>
                  <select 
                    v-model="form.category"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select type</option>
                    <option value="hotel">Hotel</option>
                    <option value="motel">Motel</option>
                    <option value="resort">Resort</option>
                    <option value="lodge">Lodge</option>
                    <option value="apartment">Apartment</option>
                    <option value="guesthouse">Guesthouse</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                  <input 
                    v-model="form.location"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., Kigali, Rwanda"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                  <textarea 
                    v-model="form.description"
                    required
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Describe your property..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Property Details -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Property Details</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bedrooms</label>
                  <input 
                    v-model.number="form.beds"
                    type="number" 
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bathrooms</label>
                  <input 
                    v-model.number="form.baths"
                    type="number" 
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Guests</label>
                  <input 
                    v-model.number="form.maxGuests"
                    type="number" 
                    min="1"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="4"
                  />
                </div>
              </div>
            </div>

            <!-- Pricing -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Pricing</h2>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price per Night (USD) *</label>
                <div class="relative">
                  <span class="absolute left-4 top-3 text-gray-500 dark:text-gray-400">$</span>
                  <input 
                    v-model.number="form.price"
                    type="number" 
                    min="1"
                    required
                    class="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            <!-- Images -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Property Images</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Images</label>
                  <div 
                    class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                    @click="$refs.fileInput.click()"
                  >
                    <input 
                      ref="fileInput"
                      type="file" 
                      accept="image/*" 
                      multiple 
                      class="hidden" 
                      @change="handleImageUpload"
                    />
                    <svg class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="text-gray-600 dark:text-gray-400">Click to upload images</p>
                    <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                  </div>
                </div>

                <!-- Uploaded Images Preview -->
                <div v-if="uploadedImages.length > 0" class="grid grid-cols-3 md:grid-cols-4 gap-4">
                  <div v-for="(img, index) in uploadedImages" :key="img.id" class="relative">
                    <img :src="img.url" class="w-full h-24 object-cover rounded-lg" />
                    <button 
                      type="button"
                      @click="removeImage(index)"
                      class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <p v-if="uploading" class="text-sm text-blue-600 dark:text-blue-400">Uploading images...</p>
              </div>
            </div>

            <!-- Amenities -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Amenities</h2>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    :value="amenity"
                    v-model="form.amenities"
                    class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ amenity }}</span>
                </label>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-4">
              <button 
                type="submit"
                :disabled="isSubmitting || uploading"
                class="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? 'Adding Property...' : 'Add Property' }}
              </button>
              <router-link 
                to="/staff"
                class="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors text-center"
              >
                Cancel
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase } from '../../services/supabase'
import { uploadToCloudinary } from '../../services/cloudinary'
import { useUserStore } from '../../stores/userStore'
import { optimizeImageFile, fileToDataUrl } from '../../utils/imageOptimization'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  title: '',
  category: '',
  location: '',
  description: '',
  beds: 1,
  baths: 1,
  maxGuests: 2,
  price: null,
  amenities: []
})

const uploadedImages = ref([])
const isSubmitting = ref(false)
const showSuccess = ref(false)
const uploading = computed(() => uploadedImages.value.some((img) => img.status === 'uploading'))

const availableAmenities = [
  'WiFi', 'Pool', 'Restaurant', 'Spa', 'Gym', 'Room Service', 
  'Air Conditioning', 'Parking', 'Kitchen', 'Beach Access', 
  'Mountain Views', 'Bar', 'Laundry', 'Security', 'TV', 'Balcony'
]

function normalizePropertyType(rawType) {
  const value = String(rawType || '').trim()
  if (!value) return 'Accommodation'

  const normalized = value
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const map = {
    hotel: 'Hotel',
    motel: 'Motel',
    resort: 'Resort',
    lodge: 'Lodge',
    apartment: 'Apartment',
    villa: 'Villa',
    guesthouse: 'Guesthouse',
    'guest house': 'Guesthouse'
  }

  return map[normalized] || value.charAt(0).toUpperCase() + value.slice(1)
}

async function handleImageUpload(event) {
  const files = Array.from(event.target.files || [])
  if (!files.length) return

  // allow selecting the same files again
  event.target.value = ''

  const isCloudinaryConfigured = Boolean(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  )

  const runWithConcurrency = async (tasks, limit = 3) => {
    const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
      while (tasks.length) {
        const task = tasks.shift()
        if (task) await task()
      }
    })
    await Promise.all(workers)
  }

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

      if (isCloudinaryConfigured) {
        const result = await uploadToCloudinary(optimized, { folder: 'merry360x/properties' })
        updateById({ url: result.secure_url, status: 'ready' })
      } else {
        const dataUrl = await fileToDataUrl(optimized)
        updateById({ url: dataUrl, status: 'ready' })
      }
    } catch (error) {
      console.error('Upload error:', error)
      try {
        const optimized = await optimizeImageFile(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 })
        const dataUrl = await fileToDataUrl(optimized)
        updateById({ url: dataUrl, status: 'ready' })
      } catch (fallbackError) {
        console.error('Upload fallback error:', fallbackError)
        updateById({ status: 'error' })
      }
    } finally {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  })

  await runWithConcurrency(tasks, 3)
}

function removeImage(index) {
  uploadedImages.value.splice(index, 1)
}

async function handleSubmit() {
  if (!form.value.title || !form.value.location || !form.value.price) {
    alert('Please fill in all required fields')
    return
  }

  if (uploading.value) {
    alert('Please wait for images to finish uploading')
    return
  }

  if (uploadedImages.value.some((img) => img.status === 'error')) {
    alert('One or more images failed to upload. Please remove and re-upload them.')
    return
  }

  if (!userStore.user?.id) {
    alert('Please login to add properties')
    router.push('/login')
    return
  }

  isSubmitting.value = true

  try {
    const imageUrls = uploadedImages.value.map((img) => img.url).filter(Boolean)
    const propertyRow = {
      host_id: userStore.user.id,
      name: form.value.title,
      description: form.value.description,
      property_type: normalizePropertyType(form.value.category),
      location: form.value.location,
      price_per_night: form.value.price,
      bedrooms: form.value.beds || 1,
      bathrooms: form.value.baths || 1,
      max_guests: form.value.maxGuests || 2,
      amenities: form.value.amenities,
      images: imageUrls,
      main_image: imageUrls[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
      available: true
    }

    const { error } = await supabase
      .from('properties')
      .insert([propertyRow])

    if (error) throw error

    showSuccess.value = true

    // Reset form
    form.value = {
      title: '',
      category: '',
      location: '',
      description: '',
      beds: 1,
      baths: 1,
      maxGuests: 2,
      price: null,
      amenities: []
    }
    uploadedImages.value = []

    // Redirect after delay
    setTimeout(() => {
      router.push('/staff/properties')
    }, 2000)

  } catch (error) {
    console.error('Error adding property:', error)
    alert('Failed to add property. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
