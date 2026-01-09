<template>
  <MainLayout>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div class="container mx-auto px-4 lg:px-8">
        <!-- Header -->
        <div class="max-w-3xl mx-auto mb-6">
          <router-link :to="dashboardPath" class="inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 mb-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </router-link>
          <h1 class="text-lg font-semibold text-text-primary mb-0.5">Add Property</h1>
          <p class="text-xs text-text-secondary">Fill in the required information</p>
        </div>

        <!-- Progress -->
        <div class="max-w-3xl mx-auto mb-4">
          <div class="flex items-center justify-between">
            <div v-for="(step, index) in steps" :key="index" class="flex items-center" :class="index < steps.length - 1 ? 'flex-1' : ''">
              <div class="flex flex-col items-center">
                <div 
                  class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-all"
                  :class="currentStep > index ? 'bg-green-500 text-white' : currentStep === index ? 'bg-brand-600 text-white' : 'bg-gray-300 text-gray-600'"
                >
                  <span>{{ index + 1 }}</span>
                </div>
                <span class="text-xs mt-0.5" :class="currentStep >= index ? 'text-text-primary' : 'text-text-muted'">{{ step.title }}</span>
              </div>
              <div v-if="index < steps.length - 1" class="flex-1 h-0.5 mx-1.5" :class="currentStep > index ? 'bg-green-500' : 'bg-gray-300'"></div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="max-w-3xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <form @submit.prevent="handleNext">
              <!-- Content -->
              <div class="p-6">
                <!-- Step 1: Basic Info -->
                <div v-if="currentStep === 0" class="space-y-6">
                  <div class="mb-4">
                    <h2 class="text-base font-semibold text-text-primary">Basic Information</h2>
                  </div>
              
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Property Name -->
                    <div class="md:col-span-2">
                      <label class="block text-xs font-medium text-text-secondary mb-1.5">Property Name *</label>
                  <input 
                    v-model="form.title"
                    type="text" 
                    required
                        placeholder="e.g., Luxury Kigali Apartment"
                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                  />
                </div>

                    <!-- Property Type -->
                <div>
                      <label class="block text-xs font-medium text-text-secondary mb-1.5">Type *</label>
                  <select 
                    v-model="form.category"
                    required
                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                  >
                        <option value="">Select type...</option>
                        <option value="hotel">Hotel</option>
                        <option value="villa">Villa</option>
                        <option value="apartment">Apartment</option>
                        <option value="resort">Resort</option>
                        <option value="lodge">Lodge</option>
                        <option value="guesthouse">Guesthouse</option>
                  </select>
                </div>

                    <!-- Location -->
                <div>
                      <label class="block text-xs font-medium text-text-secondary mb-1.5">Location *</label>
                  <input 
                    v-model="form.location"
                    type="text" 
                    required
                        placeholder="e.g., Kigali, Rwanda"
                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                  />
                </div>

                    <!-- Price -->
                <div>
                      <label class="block text-xs font-medium text-text-secondary mb-1.5">Price per Night (RWF) *</label>
                      <input 
                        v-model.number="form.price"
                        type="number" 
                        min="1"
                    required
                        placeholder="100000"
                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
                </div>

                    <!-- Max Guests -->
                    <div>
                      <label class="block text-xs font-medium text-text-secondary mb-1.5">Max Guests *</label>
                      <input 
                        v-model.number="form.maxGuests"
                        type="number" 
                        min="1"
                        required
                        placeholder="4"
                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
            </div>

                    <!-- Bedrooms -->
                    <div>
                      <label class="block text-xs font-medium text-text-secondary mb-1.5">Bedrooms *</label>
                      <input 
                        v-model.number="form.beds"
                        type="number" 
                        min="1"
                        required
                        placeholder="2"
                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
                    </div>

                    <!-- Bathrooms -->
                    <div>
                      <label class="block text-xs font-medium text-text-secondary mb-1.5">Bathrooms *</label>
                      <input 
                        v-model.number="form.baths"
                        type="number" 
                        min="1"
                        required
                        placeholder="1"
                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                      <label class="block text-xs font-medium text-text-secondary mb-1.5">Description *</label>
                      <textarea 
                        v-model="form.description"
                        required
                        rows="3"
                        placeholder="Describe your property..."
                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary resize-none"
                      ></textarea>
                    </div>

                    <!-- Quick Amenities -->
                    <div class="md:col-span-2">
                      <label class="block text-xs font-medium text-text-secondary mb-1.5">Amenities (select all that apply)</label>
                      <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
                        <button
                          v-for="amenity in quickAmenities"
                          :key="amenity.value"
                          type="button"
                          @click="toggleAmenity(amenity.value)"
                          class="p-2 text-xs border rounded transition-all text-center"
                          :class="form.amenities.includes(amenity.value) ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 text-text-secondary'"
                        >
                          {{ amenity.label }}
                        </button>
                      </div>
                </div>
              </div>
            </div>

                <!-- Step 2: Photos -->
                <div v-if="currentStep === 1" class="space-y-4">
                  <div class="mb-4">
                    <h2 class="text-base font-semibold text-text-primary">Photos</h2>
                    <p class="text-xs text-text-secondary mt-1">Upload at least 3 photos</p>
                  </div>

              <PhotoUploader
                v-model="propertyImages"
                v-model:uploading="imagesUploading"
                title="Property Images"
                    subtitle="Minimum 3 photos"
                    :min-photos="3"
                :max-photos="15"
                folder="merry360x/properties"
              />
            </div>

                <!-- Step 3: Done -->
                <div v-if="currentStep === 2" class="space-y-4">
                  <div class="mb-4">
                    <h2 class="text-base font-semibold text-text-primary">Review</h2>
                    <p class="text-xs text-text-secondary mt-1">Review your information before publishing</p>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <p class="text-xs text-text-muted">Property</p>
                        <p class="text-sm font-medium text-text-primary mt-0.5">{{ form.title }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-text-muted">Type</p>
                        <p class="text-sm font-medium text-text-primary mt-0.5">{{ form.category }}</p>
                </div>
                      <div>
                        <p class="text-xs text-text-muted">Location</p>
                        <p class="text-sm font-medium text-text-primary mt-0.5">{{ form.location }}</p>
              </div>
                  <div>
                        <p class="text-xs text-text-muted">Price</p>
                        <p class="text-sm font-medium text-brand-600 mt-0.5">RWF {{ form.price?.toLocaleString() }}</p>
                  </div>
                  <div>
                        <p class="text-xs text-text-muted">Guests</p>
                        <p class="text-sm font-medium text-text-primary mt-0.5">{{ form.maxGuests }}</p>
                  </div>
                  <div>
                        <p class="text-xs text-text-muted">Photos</p>
                        <p class="text-sm font-medium text-text-primary mt-0.5">{{ propertyImages.length }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 flex gap-3">
                <button
                  v-if="currentStep > 0"
                  type="button"
                  @click="previousStep"
                  class="px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-text-primary font-medium rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                
                <div class="flex-1"></div>

                <button
                  v-if="currentStep < steps.length - 1"
                  type="button"
                  @click="handleNext"
                  :disabled="!canProceed"
                  class="px-5 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>

              <button 
                  v-else
                  type="button"
                  @click="handleSubmit"
                :disabled="isSubmitting || imagesUploading"
                  class="px-5 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                  <svg v-if="isSubmitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                  <span v-if="isSubmitting">Publishing...</span>
                  <span v-else>Publish</span>
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full overflow-hidden">
          <div class="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-base font-semibold text-text-primary mb-1">Published</h2>
            <p class="text-xs text-text-secondary">Your property is now live</p>
          </div>
          <div class="p-4">
            <button
              @click="router.push(propertiesPath)"
              class="w-full px-4 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg"
            >
              View Properties
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import PhotoUploader from '../../components/host/PhotoUploader.vue'
import api from '../../services/api'
import { useUserStore } from '../../stores/userStore'
import { useToast } from '../../composables/useToast'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { success: showToastSuccess, error: showToastError } = useToast()

const isHostPortal = computed(() => String(route.path || '').startsWith('/host'))
const isAdminPortal = computed(() => String(route.path || '').startsWith('/admin'))
const basePath = computed(() => {
  if (isHostPortal.value) return '/host'
  if (isAdminPortal.value) return '/admin'
  return '/staff'
})
const dashboardPath = computed(() => basePath.value)
const propertiesPath = computed(() => `${basePath.value}/properties`)

const currentStep = ref(0)
const isSubmitting = ref(false)
const imagesUploading = ref(false)
const showSuccessModal = ref(false)

const steps = [
  { title: 'Basic Info' },
  { title: 'Photos' },
  { title: 'Done!' }
]

const quickAmenities = [
  { value: 'WiFi', label: 'WiFi' },
  { value: 'Pool', label: 'Pool' },
  { value: 'Parking', label: 'Parking' },
  { value: 'Air Conditioning', label: 'AC' },
  { value: 'Kitchen', label: 'Kitchen' },
  { value: 'TV', label: 'TV' }
]

const form = ref({
  title: '',
  category: '',
  location: '',
  description: '',
  beds: 2,
  baths: 1,
  maxGuests: 4,
  price: null,
  amenities: []
})

const propertyImages = ref([])

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return form.value.title && form.value.category && form.value.location && form.value.description && form.value.price && form.value.maxGuests
  }
  if (currentStep.value === 1) {
    return propertyImages.value.length >= 3 && !imagesUploading.value
  }
  return true
})

function toggleAmenity(amenity) {
  const index = form.value.amenities.indexOf(amenity)
  if (index > -1) {
    form.value.amenities.splice(index, 1)
  } else {
    form.value.amenities.push(amenity)
  }
}

function handleNext() {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    showToastError('Please complete all required fields')
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function normalizePropertyType(rawType) {
  const map = {
    hotel: 'Hotel',
    motel: 'Motel',
    resort: 'Resort',
    lodge: 'Lodge',
    apartment: 'Apartment',
    villa: 'Villa',
    guesthouse: 'Guesthouse'
  }
  return map[String(rawType || '').toLowerCase()] || 'Accommodation'
}

async function handleSubmit() {
  if (!userStore.user?.id) {
    showToastError('Please login to add properties')
    router.push('/login')
    return
  }

  isSubmitting.value = true

  try {
    const imageUrls = propertyImages.value.map((img) => img.url || img.preview).filter(Boolean)

    if (imageUrls.length < 3) {
      throw new Error('Please upload at least 3 images')
    }

    // Add default amenities if none selected
    if (form.value.amenities.length === 0) {
      form.value.amenities = ['WiFi', 'Parking']
    }

    const propertyData = {
      name: form.value.title.trim(),
      description: form.value.description.trim(),
      type: normalizePropertyType(form.value.category),
      location: form.value.location.trim(),
      price: Number(form.value.price),
      bedrooms: Number(form.value.beds) || 1,
      bathrooms: Number(form.value.baths) || 1,
      maxGuests: Number(form.value.maxGuests),
      amenities: form.value.amenities,
      image: imageUrls[0],
      images: imageUrls,
      vr_tour_enabled: false,
      vr_tour_url: null,
      vr_tour_type: null,
      latitude: null,
      longitude: null
    }

    // Verify API
    if (!api.accommodations || typeof api.accommodations.create !== 'function') {
      throw new Error('API is not available. Please contact support.')
    }

    // Add timeout
    const createProperty = api.accommodations.create(propertyData)
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - please try again')), 30000)
    )

    await Promise.race([createProperty, timeout])

    showSuccessModal.value = true
    showToastSuccess('Property published successfully!')

    setTimeout(() => {
      router.push(propertiesPath.value)
    }, 2000)

  } catch (error) {
    console.error('❌ Error:', error)
    
    let errorMessage = 'Failed to create property. Please try again.'
    
    if (error?.message) {
      errorMessage = error.message
    }

    if (errorMessage.includes('host_application_status')) {
      errorMessage = 'Your host application needs approval. Contact support.'
    } else if (errorMessage.includes('permission')) {
      errorMessage = 'You don\'t have permission. Contact admin.'
    }

    showToastError(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@keyframes bounce-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.3s ease-out;
}
</style>
