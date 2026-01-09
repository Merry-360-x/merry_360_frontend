<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div class="mb-8">
          <router-link to="/vendor" class="text-brand-600 hover:text-brand-700 flex items-center gap-2 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {{ t('vendor.backToDashboard') }}
          </router-link>
          <h1 class="text-3xl font-bold text-text-primary mb-2">{{ t('vendor.createListing') }}</h1>
          <p class="text-text-secondary">{{ t('vendor.createListingDesc') }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center gap-2 text-green-800">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">{{ t('vendor.listingCreated') }}</span>
          </div>
        </div>

        <!-- Form -->
        <Card padding="lg">
          <form @submit.prevent="handleSubmit">
            <!-- Basic Information -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('vendor.basicInfo') }}</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    {{ t('vendor.propertyName') }}
                  </label>
                  <Input 
                    v-model="form.name" 
                    :placeholder="t('vendor.propertyNamePlaceholder')"
                    :class="errors.name ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    {{ t('vendor.propertyType') }}
                  </label>
                  <select 
                    v-model="form.type"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-text-primary"
                    :class="errors.type ? 'border-red-500' : ''"
                  >
                    <option value="">{{ t('vendor.selectType') }}</option>
                    <option value="Hotel">{{ t('accommodation.hotel') }}</option>
                    <option value="Motel">{{ t('accommodation.motel') }}</option>
                    <option value="Resort">{{ t('accommodation.resort') }}</option>
                    <option value="Lodge">{{ t('accommodation.lodge') }}</option>
                    <option value="Apartment">{{ t('accommodation.apartment') }}</option>
                    <option value="Guesthouse">{{ t('accommodation.guesthouse') }}</option>
                    <option value="Villa">{{ t('accommodation.villa') }}</option>
                  </select>
                  <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    {{ t('accommodation.location') }}
                  </label>
                  <Input 
                    v-model="form.location" 
                    :placeholder="t('vendor.locationPlaceholder')"
                    :class="errors.location ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.location" class="mt-1 text-sm text-red-600">{{ errors.location }}</p>
                </div>



                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    {{ t('vendor.description') }}
                  </label>
                  <textarea 
                    v-model="form.description"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-text-primary placeholder:text-text-muted"
                    :placeholder="t('vendor.descriptionPlaceholder')"
                    :class="errors.description ? 'border-red-500' : ''"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                </div>
              </div>
            </div>

            <!-- Property Details -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('vendor.propertyDetails') }}</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    {{ t('vendor.beds') }} *
                  </label>
                  <Input 
                    v-model.number="form.beds" 
                    type="number"
                    min="1"
                    required
                    :placeholder="t('vendor.bedsPlaceholder')"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    {{ t('vendor.baths') }} *
                  </label>
                  <Input 
                    v-model.number="form.baths" 
                    type="number"
                    min="1"
                    required
                    :placeholder="t('vendor.bathsPlaceholder')"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    {{ t('vendor.area') }}
                  </label>
                  <Input 
                    v-model.number="form.area" 
                    type="number"
                    min="1"
                    :placeholder="t('vendor.areaPlaceholder')"
                  />
                </div>
              </div>
            </div>

            <!-- Pricing -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('vendor.pricing') }}</h2>
              
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-2">
                  {{ t('vendor.pricePerNight') }}
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-3 text-text-muted">{{ currencyStore.currencySymbol }}</span>
                  <Input 
                    v-model.number="form.price" 
                    type="number"
                    min="1"
                    class="pl-8"
                    :placeholder="t('vendor.pricePlaceholder')"
                    :class="errors.price ? 'border-red-500' : ''"
                  />
                </div>
                <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
              </div>
            </div>

            <!-- Images -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('vendor.propertyImages') }}</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    {{ t('vendor.mainImage') }}
                  </label>
                  <Input 
                    v-model="form.image" 
                    :placeholder="t('vendor.imageUrlPlaceholder')"
                    :class="errors.image ? 'border-red-500' : ''"
                  />
                  <p class="mt-1 text-sm text-text-muted">{{ t('vendor.imageUrlHelper') }}</p>
                  <p v-if="errors.image" class="mt-1 text-sm text-red-600">{{ errors.image }}</p>
                </div>

                <div v-for="(img, index) in form.additionalImages" :key="index" class="flex gap-2">
                  <Input 
                    v-model="form.additionalImages[index]" 
                    :placeholder="`${t('vendor.additionalImage')} ${index + 1}`"
                    class="flex-1"
                  />
                  <button 
                    type="button"
                    @click="removeImage(index)"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <button 
                  type="button"
                  @click="addImage"
                  class="text-brand-600 hover:text-brand-700 flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  {{ t('vendor.addImage') }}
                </button>
              </div>
            </div>

            <!-- Virtual Tour (VR/3D) -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                {{ t('vendor.virtualTour') || '360° Virtual Tour' }}
              </h2>
              
              <div class="bg-brand-50 border border-brand-200 rounded-lg p-4 mb-4">
                <div class="flex gap-3">
                  <svg class="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <p class="text-sm text-brand-800 font-medium mb-1">Add a virtual tour to increase bookings by up to 40%!</p>
                    <p class="text-xs text-brand-700">Supported platforms: Matterport, Google Tour, YouTube 360, or custom embed</p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="form.vrTourEnabled"
                    class="rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-5 h-5"
                  />
                  <div>
                    <span class="text-sm font-medium text-text-secondary">Enable Virtual Tour</span>
                    <p class="text-xs text-text-muted">Allow guests to explore your property in 360° before booking</p>
                  </div>
                </label>

                <div v-if="form.vrTourEnabled" class="space-y-4 pl-8 animate-fade-in">
                  <div>
                    <label class="block text-sm font-medium text-text-secondary mb-2">
                      Virtual Tour Platform
                    </label>
                    <select 
                      v-model="form.vrTourType"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-text-primary"
                    >
                      <option value="">Select platform...</option>
                      <option value="matterport">Matterport 3D Tour</option>
                      <option value="google_tour">Google Virtual Tour</option>
                      <option value="youtube_360">YouTube 360° Video</option>
                      <option value="custom">Custom VR/3D Link</option>
                    </select>
                    <p class="mt-1 text-xs text-text-muted">Choose the platform you used to create your virtual tour</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-text-secondary mb-2">
                      Virtual Tour URL
                    </label>
                    <Input 
                      v-model="form.vrTourUrl" 
                      placeholder="https://my.matterport.com/show/?m=..."
                      type="url"
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

                  <div v-if="form.vrTourUrl" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-sm font-medium text-green-800">Preview Ready</span>
                    </div>
                    <p class="text-xs text-gray-600">Your virtual tour will be displayed on the property detail page</p>
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
                    class="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span class="text-sm text-text-secondary">{{ amenity }}</span>
                </label>
              </div>
            </div>

            <!-- Eco-Friendly -->
            <div class="mb-8">
              <label class="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="form.ecoFriendly"
                  class="mt-1 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span class="text-sm font-medium text-text-secondary">{{ t('vendor.ecoFriendly') }}</span>
                  <p class="text-sm text-text-muted">{{ t('vendor.ecoFriendlyDesc') }}</p>
                </div>
              </label>
            </div>

            <!-- Progress Bar (shown during submission) -->
            <div v-if="isSubmitting" class="mb-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Publishing property...</span>
                <span class="text-sm font-bold text-brand-600 dark:text-brand-400">{{ submitProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                  :style="{ width: `${submitProgress}%` }"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-4">
              <Button type="submit" variant="primary" :disabled="isSubmitting">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? `Creating... ${submitProgress}%` : t('vendor.createListing') }}
              </Button>
              <Button type="button" variant="secondary" @click="$router.push('/vendor')" :disabled="isSubmitting">
                {{ t('common.cancel') }}
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
import { useRouter } from 'vue-router'
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast'
import { useCurrencyStore } from '../../stores/currency'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'
import api from '../../services/api'

const { t } = useTranslation()
const router = useRouter()
const { showToast } = useToast()
const currencyStore = useCurrencyStore()

const form = ref({
  name: '',
  type: '',
  location: '',
  description: '',
  price: null,
  beds: 1,
  baths: 1,
  area: null,
  image: '',
  additionalImages: [],
  amenities: [],
  ecoFriendly: false,
  vrTourEnabled: false,
  vrTourUrl: '',
  vrTourType: '',
  latitude: null,
  longitude: null
})

const errors = ref({})
const isSubmitting = ref(false)
const submitProgress = ref(0)
const showSuccess = ref(false)

const availableAmenities = [
  'WiFi', 'Pool', 'Restaurant', 'Spa', 'Gym', 'Room Service', 
  'Air Conditioning', 'Parking', 'Kitchen', 'Beach Access', 
  'Mountain Views', 'Bar', 'Laundry Service', 'Security'
]

const addImage = () => {
  form.value.additionalImages.push('')
}

const removeImage = (index) => {
  form.value.additionalImages.splice(index, 1)
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name?.trim()) errors.value.name = 'Please enter a property name'
  if (!form.value.type) errors.value.type = 'Please select a property type'
  if (!form.value.location?.trim()) errors.value.location = 'Please enter a location'
  if (!form.value.description?.trim()) errors.value.description = 'Please enter a description'
  if (!form.value.price || form.value.price <= 0) errors.value.price = 'Please enter a valid price'
  if (!form.value.beds || form.value.beds <= 0) errors.value.beds = 'Please enter number of bedrooms'
  if (!form.value.baths || form.value.baths <= 0) errors.value.baths = 'Please enter number of bathrooms'
  if (!form.value.image) errors.value.image = 'Please upload at least one image'
  
  return Object.keys(errors.value).length === 0
}

// Progress animation helper
const animateProgress = (targetProgress, duration = 500) => {
  return new Promise(resolve => {
    const start = submitProgress.value
    const diff = targetProgress - start
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      submitProgress.value = Math.round(start + diff * progress)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        resolve()
      }
    }
    animate()
  })
}

const handleSubmit = async () => {
  // Validate BEFORE setting isSubmitting to avoid button getting stuck
  if (!validateForm()) {
    showToast(t('vendor.fixErrors'), 'error')
    return
  }

  isSubmitting.value = true
  submitProgress.value = 0

  try {
    // Step 1: Validating data (10%)
    await animateProgress(10, 200)

    // Step 2: Preparing data (30%)
    await animateProgress(30, 300)

    // Create property in database via Supabase
    const propertyData = {
      name: form.value.name,
      type: form.value.type,
      location: form.value.location,
      description: form.value.description,
      price: form.value.price,
      bedrooms: form.value.beds,
      bathrooms: form.value.baths,
      area: form.value.area,
      image: form.value.image,
      images: [form.value.image, ...form.value.additionalImages.filter(img => img)],
      amenities: form.value.amenities,
      eco_friendly: form.value.ecoFriendly,
      vr_tour_enabled: form.value.vrTourEnabled,
      vr_tour_url: form.value.vrTourUrl || null,
      vr_tour_type: form.value.vrTourType || null,
      latitude: form.value.latitude || null,
      longitude: form.value.longitude || null
    }
    
    // Step 3: Sending to database (50%)
    await animateProgress(50, 300)

    // Direct API call
    const submitPromise = api.accommodations.create(propertyData)
    
    // Animate progress while waiting for API
    const progressPromise = (async () => {
      await animateProgress(70, 1000)
      await animateProgress(85, 1500)
    })()
    
    await Promise.all([submitPromise, progressPromise])
    
    // Step 4: Finalizing (100%)
    await animateProgress(100, 300)
    
    showSuccess.value = true
    showToast(t('vendor.listingCreatedSuccess'), 'success')
    
    setTimeout(() => {
      router.push('/vendor')
    }, 1500)
  } catch (error) {
    console.error('Property creation error:', error)
    showToast(error || t('vendor.createError'), 'error')
    submitProgress.value = 0
  } finally {
    isSubmitting.value = false
  }
}
</script>
