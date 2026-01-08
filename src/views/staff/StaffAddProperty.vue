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
              <PhotoUploader
                v-model="propertyImages"
                v-model:uploading="imagesUploading"
                title="Property Images"
                subtitle="Add photos to showcase your property"
                :min-photos="1"
                :max-photos="15"
                folder="merry360x/properties"
              />
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
                :disabled="isSubmitting || imagesUploading"
                class="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? t('portal.addingProperty') : (imagesUploading ? t('portal.uploadingImages') : t('portal.addProperty')) }}
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
import PhotoUploader from '../../components/host/PhotoUploader.vue'
import api from '../../services/api'
import { useUserStore } from '../../stores/userStore'
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

const propertyImages = ref([])
const imagesUploading = ref(false)
const isSubmitting = ref(false)
const showSuccess = ref(false)

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

async function handleSubmit() {
  console.log('🔍 Property form submission started')
  console.log('Images uploading:', imagesUploading.value)
  console.log('Property images count:', propertyImages.value.length)
  
  if (imagesUploading.value) {
    showToast(t('portal.waitForUploads'), 'error')
    return
  }

  const title = String(form.value.title || '').trim()
  const category = String(form.value.category || '').trim()
  const location = String(form.value.location || '').trim()
  const description = String(form.value.description || '').trim()
  const price = Number(form.value.price)
  const bedrooms = Number(form.value.beds)
  const bathrooms = Number(form.value.baths)
  const maxGuests = Number(form.value.maxGuests)

  console.log('📝 Form data:', { title, category, location, amenities: form.value.amenities.length })

  if (!title || !category || !location || !description || !Number.isFinite(price) || price <= 0) {
    console.log('❌ Required fields validation failed')
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

  if (propertyImages.value.length === 0) {
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
    const imageUrls = propertyImages.value.map((img) => img.url || img.preview).filter(Boolean)
    console.log('📷 Image URLs extracted:', imageUrls.length, imageUrls[0])
    
    if (!imageUrls.length) {
      showToast(t('portal.uploadAtLeastOneImage'), 'error')
      return
    }

    const propertyData = {
      name: title,
      description,
      type: normalizePropertyType(category),
      location,
      price,
      bedrooms: Number.isFinite(bedrooms) ? bedrooms : 1,
      bathrooms: Number.isFinite(bathrooms) ? bathrooms : 1,
      maxGuests,
      amenities: form.value.amenities,
      image: imageUrls[0],
      images: imageUrls,
      vr_tour_enabled: form.value.vrTourEnabled || false,
      vr_tour_url: form.value.vrTourUrl || null,
      vr_tour_type: form.value.vrTourType || null,
      latitude: form.value.latitude || null,
      longitude: form.value.longitude || null
    }

    console.log('📤 Submitting property data:', JSON.stringify(propertyData, null, 2))
    await api.accommodations.create(propertyData)

    console.log('✅ Property created successfully!')
    showSuccess.value = true
    showToast(t('portal.propertyAddedSuccess'), 'success')

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
      amenities: [],
      vrTourEnabled: false,
      vrTourUrl: '',
      vrTourType: ''
    }
    propertyImages.value = []

    // Redirect after a short delay
    setTimeout(() => {
      router.push(propertiesPath.value)
    }, 1500)

  } catch (error) {
    console.error('❌ Error adding property:', error)
    console.error('Error details:', {
      message: error?.message,
      errorObj: error?.error,
      status: error?.status,
      data: error?.data
    })
    const errorMessage = error?.message || error?.error?.message || t('portal.addPropertyFailed')
    showToast(errorMessage, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
