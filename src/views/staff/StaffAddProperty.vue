<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div class="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div class="mb-8">
          <router-link :to="dashboardPath" class="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-2 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {{ t('vendor.backToDashboard') }}
          </router-link>
          <h1 class="text-3xl font-bold text-text-primary mb-2">{{ pageTitle }}</h1>
          <p class="text-text-secondary">{{ t('portal.addPropertyDescription') }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div class="flex items-center gap-2 text-green-800 dark:text-green-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">{{ t('portal.propertyAddedSuccess') }}</span>
          </div>
        </div>

        <!-- Form -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-200">
          <form @submit.prevent="handleSubmit">
            <!-- Basic Information -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('vendor.basicInfo') }}</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">{{ t('vendor.propertyName') }} *</label>
                  <input 
                    v-model="form.title"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary placeholder:text-text-muted"
                    :placeholder="t('vendor.propertyNamePlaceholder')"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">{{ t('vendor.propertyType') }} *</label>
                  <select 
                    v-model="form.category"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary"
                  >
                    <option value="">{{ t('vendor.selectType') }}</option>
                    <option value="hotel">{{ t('accommodation.hotel') }}</option>
                    <option value="motel">{{ t('accommodation.motel') }}</option>
                    <option value="resort">{{ t('accommodation.resort') }}</option>
                    <option value="lodge">{{ t('accommodation.lodge') }}</option>
                    <option value="apartment">{{ t('accommodation.apartment') }}</option>
                    <option value="guesthouse">{{ t('accommodation.guesthouse') }}</option>
                    <option value="villa">{{ t('accommodation.villa') }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">{{ t('accommodation.location') }} *</label>
                  <input 
                    v-model="form.location"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary placeholder:text-text-muted"
                    :placeholder="t('vendor.locationPlaceholder')"
                  />
                </div>

                <!-- Location Coordinates -->
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Exact Location (for map display)
                  </label>
                  <div class="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-3 mb-3">
                    <p class="text-sm text-brand-800 dark:text-brand-300">
                      💡 <strong>Tip:</strong> Enter the coordinates to show a pinpoint on the map for guests.
                    </p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs text-text-muted mb-1">Latitude</label>
                      <input
                        v-model.number="form.latitude"
                        type="number"
                        step="any"
                        placeholder="e.g., -1.9536"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-text-muted mb-1">Longitude</label>
                      <input
                        v-model.number="form.longitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 30.0606"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
                    </div>
                  </div>
                  <p class="text-xs text-text-muted mt-2">
                    Get coordinates: Right-click on <a href="https://www.google.com/maps" target="_blank" class="text-brand-500 hover:underline">Google Maps</a> → Click location → Copy coordinates
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">{{ t('vendor.description') }} *</label>
                  <textarea 
                    v-model="form.description"
                    required
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary placeholder:text-text-muted"
                    :placeholder="t('vendor.descriptionPlaceholder')"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Property Details -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('vendor.propertyDetails') }}</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">{{ t('vendor.beds') }}</label>
                  <input 
                    v-model.number="form.beds"
                    type="number" 
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">{{ t('vendor.baths') }}</label>
                  <input 
                    v-model.number="form.baths"
                    type="number" 
                    min="0"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">{{ t('portal.maxGuests') }}</label>
                  <input 
                    v-model.number="form.maxGuests"
                    type="number" 
                    min="1"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary"
                    placeholder="4"
                  />
                </div>
              </div>
            </div>

            <!-- Pricing -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('vendor.pricing') }}</h2>
              
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-2">
                  {{ t('vendor.pricePerNight') }} ({{ currencyStore.currentCurrency }}) *
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-3 text-text-muted">{{ currencyStore.currencySymbol }}</span>
                  <input 
                    v-model.number="form.price"
                    type="number" 
                    min="1"
                    required
                    class="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            <!-- Images -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('vendor.propertyImages') }}</h2>
              
              <!-- Image Size Guidelines -->
              <ImageSizeValidator :showWarning="false" class="mb-4" />
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">{{ t('portal.uploadImages') }}</label>
                  <div 
                    class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                    @click="$refs.fileInput.click()"
                  >
                    <input 
                      ref="fileInput"
                      type="file" 
                      accept="image/jpeg,image/png,image/webp" 
                      multiple 
                      class="hidden" 
                      @change="handleImageUpload"
                    />
                    <svg class="w-12 h-12 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="text-text-secondary">{{ t('portal.clickToUploadImages') }}</p>
                    <p class="text-sm text-text-muted mt-1">{{ t('portal.imageUploadHelp') }} (Max 2MB per image)</p>
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

                <p v-if="uploading" class="text-sm text-brand-600 dark:text-brand-400">{{ t('portal.uploadingImages') }}</p>
              </div>
            </div>

            <!-- Virtual Tour (VR/3D) -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                360° Virtual Tour
              </h2>
              
              <div class="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-4 mb-4">
                <div class="flex gap-3">
                  <svg class="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <p class="text-sm text-brand-800 dark:text-brand-200 font-medium mb-1">Add a virtual tour to increase bookings by up to 40%!</p>
                    <p class="text-xs text-brand-700 dark:text-brand-300">Supported: Matterport, Google Tour, YouTube 360, or custom embed</p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="form.vrTourEnabled"
                    class="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500 w-5 h-5"
                  />
                  <div>
                    <span class="text-sm font-medium text-text-secondary">Enable Virtual Tour</span>
                    <p class="text-xs text-text-muted">Allow guests to explore the property in 360° before booking</p>
                  </div>
                </label>

                <div v-if="form.vrTourEnabled" class="space-y-4 pl-8">
                  <div>
                    <label class="block text-sm font-medium text-text-secondary mb-2">
                      Virtual Tour Platform
                    </label>
                    <select 
                      v-model="form.vrTourType"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary"
                    >
                      <option value="">Select platform...</option>
                      <option value="matterport">Matterport 3D Tour</option>
                      <option value="google_tour">Google Virtual Tour</option>
                      <option value="youtube_360">YouTube 360° Video</option>
                      <option value="custom">Custom VR/3D Link</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-text-secondary mb-2">
                      Virtual Tour URL
                    </label>
                    <input 
                      v-model="form.vrTourUrl" 
                      type="url"
                      placeholder="https://my.matterport.com/show/?m=..."
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-text-primary"
                    />
                    <div class="mt-2 space-y-1">
                      <p class="text-xs text-text-muted font-medium">Examples:</p>
                      <ul class="text-xs text-text-muted space-y-0.5 pl-4">
                        <li>• Matterport: https://my.matterport.com/show/?m=xxxxx</li>
                        <li>• YouTube 360: https://www.youtube.com/watch?v=xxxxx</li>
                        <li>• Google Tour: https://goo.gl/maps/xxxxx</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Amenities -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('vendor.amenities') }}</h2>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    :value="amenity"
                    v-model="form.amenities"
                    class="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500"
                  />
                  <span class="text-sm text-text-secondary">{{ amenity }}</span>
                </label>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-4">
              <button 
                type="submit"
                :disabled="isSubmitting || uploading"
                class="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? t('portal.addingProperty') : t('portal.addProperty') }}
              </button>
              <router-link 
                :to="dashboardPath"
                class="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text-secondary font-semibold rounded-lg transition-colors text-center"
              >
                {{ t('common.cancel') }}
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
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import ImageSizeValidator from '../../components/common/ImageSizeValidator.vue'
import api from '../../services/api'
import { uploadToCloudinary } from '../../services/cloudinary'
import { useUserStore } from '../../stores/userStore'
import { optimizeImageFile, fileToDataUrl } from '../../utils/imageOptimization'
import { IMAGE_UPLOAD_RULES, getImageValidationError, getFinalImageSizeError } from '@/utils/imageUploadRules'
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast'
import { useCurrencyStore } from '../../stores/currency'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()
const { showToast } = useToast()

const isHostPortal = computed(() => String(route.path || '').startsWith('/host'))
const basePath = computed(() => (isHostPortal.value ? '/host' : '/staff'))
const dashboardPath = computed(() => basePath.value)
const propertiesPath = computed(() => `${basePath.value}/properties`)

const pageTitle = computed(() => t('portal.addNewProperty'))

const form = ref({
  title: '',
  category: '',
  location: '',
  description: '',
  beds: 1,
  baths: 1,
  maxGuests: 2,
  price: null,
  amenities: [],
  vrTourEnabled: false,
  vrTourUrl: '',
  vrTourType: '',
  latitude: null,
  longitude: null
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

  // Validate inputs early (type + extreme size).
  const invalid = files
    .map((f) => ({ file: f, err: getImageValidationError(f) }))
    .filter((x) => x.err)
  if (invalid.length > 0) {
    error(invalid[0].err)
    event.target.value = ''
    return
  }
  
  // Warn about large files (over 1MB)
  const largeFiles = files.filter(file => file.size > 1 * 1024 * 1024)
  if (largeFiles.length > 0) {
    const totalSizeMB = (largeFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)
    warning(`Large files detected (${totalSizeMB}MB total). Upload may take longer.`, 1000)
  }

  // allow selecting the same files again
  event.target.value = ''

  const isCloudinaryConfigured = Boolean(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  )

  const runWithConcurrency = async (tasks, limit = 4) => {
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

      const finalSizeError = getFinalImageSizeError(optimized, IMAGE_UPLOAD_RULES)
      if (finalSizeError) throw new Error(finalSizeError)

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
  const title = String(form.value.title || '').trim()
  const category = String(form.value.category || '').trim()
  const location = String(form.value.location || '').trim()
  const description = String(form.value.description || '').trim()
  const price = Number(form.value.price)
  const bedrooms = Number(form.value.beds)
  const bathrooms = Number(form.value.baths)
  const maxGuests = Number(form.value.maxGuests)

  if (!title || !category || !location || !description || !Number.isFinite(price) || price <= 0) {
    showToast(t('portal.fillRequiredFields'), 'error')
    return
  }

  if (!Number.isFinite(bedrooms) || bedrooms < 0 || !Number.isFinite(bathrooms) || bathrooms < 0) {
    showToast(t('portal.enterValidBedroomsBathrooms'), 'error')
    return
  }

  if (!Number.isFinite(maxGuests) || maxGuests <= 0) {
    showToast(t('portal.enterValidMaxGuests'), 'error')
    return
  }

  if (!Array.isArray(form.value.amenities) || form.value.amenities.length === 0) {
    showToast(t('portal.selectAtLeastOneAmenity'), 'error')
    return
  }

  if (uploading.value) {
    showToast(t('portal.waitForUploads'), 'error')
    return
  }

  if (uploadedImages.value.some((img) => img.status === 'error')) {
    showToast(t('portal.imageUploadFailed'), 'error')
    return
  }

  if (uploadedImages.value.length === 0) {
    showToast(t('portal.uploadAtLeastOneImage'), 'error')
    return
  }

  if (!userStore.user?.id) {
    showToast(t('portal.loginToAddProperties'), 'error')
    router.push('/login')
    return
  }

  isSubmitting.value = true

  try {
    const imageUrls = uploadedImages.value.map((img) => img.url).filter(Boolean)
    if (!imageUrls.length) {
      showToast(t('portal.uploadAtLeastOneImage'), 'error')
      return
    }

    await api.accommodations.create({
      name: title,
      description,
      type: normalizePropertyType(category),
      location,
      price,
      beds: Number.isFinite(bedrooms) ? bedrooms : 1,
      baths: Number.isFinite(bathrooms) ? bathrooms : 1,
      maxGuests,
      amenities: form.value.amenities,
      image: imageUrls[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
      images: imageUrls,
      vr_tour_enabled: form.value.vrTourEnabled || false,
      vr_tour_url: form.value.vrTourUrl || null,
      vr_tour_type: form.value.vrTourType || null,
      latitude: form.value.latitude || null,
      longitude: form.value.longitude || null
    })

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

    // Redirect immediately for a snappier UX
    router.push(propertiesPath.value)

  } catch (error) {
    console.error('Error adding property:', error)
    showToast(t('portal.addPropertyFailed'), 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
