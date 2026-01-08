<template>
  <MainLayout>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div class="container mx-auto px-4 lg:px-8">
        <!-- Header -->
        <div class="max-w-3xl mx-auto mb-8">
          <router-link :to="dashboardPath" class="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </router-link>
          <h1 class="text-4xl font-bold text-text-primary mb-2">⚡ Quick Add Property</h1>
          <p class="text-text-secondary">Just fill the essentials - we'll handle the rest!</p>
        </div>

        <!-- Progress -->
        <div class="max-w-3xl mx-auto mb-6">
          <div class="flex items-center justify-between">
            <div v-for="(step, index) in steps" :key="index" class="flex items-center" :class="index < steps.length - 1 ? 'flex-1' : ''">
              <div class="flex flex-col items-center">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all"
                  :class="currentStep > index ? 'bg-green-500 text-white' : currentStep === index ? 'bg-brand-600 text-white' : 'bg-gray-300 text-gray-600'"
                >
                  <svg v-if="currentStep > index" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span class="text-xs font-medium mt-1" :class="currentStep >= index ? 'text-text-primary' : 'text-text-muted'">{{ step.title }}</span>
              </div>
              <div v-if="index < steps.length - 1" class="flex-1 h-1 mx-2" :class="currentStep > index ? 'bg-green-500' : 'bg-gray-300'"></div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="max-w-3xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <form @submit.prevent="handleNext">
              <!-- Content -->
              <div class="p-8">
                <!-- Step 1: Basic Info -->
                <div v-if="currentStep === 0" class="space-y-6">
                  <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-text-primary">📝 Tell us about your property</h2>
                    <p class="text-text-secondary mt-2">Quick and easy - just the essentials!</p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Property Name -->
                    <div class="md:col-span-2">
                      <label class="block text-sm font-semibold text-text-primary mb-2">Property Name *</label>
                      <input 
                        v-model="form.title"
                        type="text" 
                        required
                        placeholder="e.g., Luxury Kigali Apartment"
                        class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
                    </div>

                    <!-- Property Type -->
                    <div>
                      <label class="block text-sm font-semibold text-text-primary mb-2">Type *</label>
                      <select 
                        v-model="form.category"
                        required
                        class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                      >
                        <option value="">Select type...</option>
                        <option value="hotel">🏨 Hotel</option>
                        <option value="villa">🏡 Villa</option>
                        <option value="apartment">🏢 Apartment</option>
                        <option value="resort">🏖️ Resort</option>
                        <option value="lodge">🏕️ Lodge</option>
                        <option value="guesthouse">🏠 Guesthouse</option>
                      </select>
                    </div>

                    <!-- Location -->
                    <div>
                      <label class="block text-sm font-semibold text-text-primary mb-2">Location *</label>
                      <input 
                        v-model="form.location"
                        type="text" 
                        required
                        placeholder="e.g., Kigali, Rwanda"
                        class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
                    </div>

                    <!-- Price -->
                    <div>
                      <label class="block text-sm font-semibold text-text-primary mb-2">Price per Night (RWF) *</label>
                      <input 
                        v-model.number="form.price"
                        type="number" 
                        min="1"
                        required
                        placeholder="100000"
                        class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
                    </div>

                    <!-- Max Guests -->
                    <div>
                      <label class="block text-sm font-semibold text-text-primary mb-2">Max Guests *</label>
                      <input 
                        v-model.number="form.maxGuests"
                        type="number" 
                        min="1"
                        required
                        placeholder="4"
                        class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
                    </div>

                    <!-- Bedrooms & Bathrooms (Optional) -->
                    <div class="md:col-span-2">
                      <details class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                        <summary class="cursor-pointer font-semibold text-text-primary">➕ Optional: Beds & Baths</summary>
                        <div class="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label class="block text-sm font-medium text-text-secondary mb-2">Bedrooms</label>
                            <input 
                              v-model.number="form.beds"
                              type="number" 
                              min="0"
                              placeholder="2"
                              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-primary"
                            />
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-text-secondary mb-2">Bathrooms</label>
                            <input 
                              v-model.number="form.baths"
                              type="number" 
                              min="0"
                              placeholder="1"
                              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-primary"
                            />
                          </div>
                        </div>
                      </details>
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                      <label class="block text-sm font-semibold text-text-primary mb-2">Description *</label>
                      <textarea 
                        v-model="form.description"
                        required
                        rows="3"
                        placeholder="Describe your property..."
                        class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary resize-none"
                      ></textarea>
                    </div>

                    <!-- Quick Amenities -->
                    <div class="md:col-span-2">
                      <label class="block text-sm font-semibold text-text-primary mb-2">Quick Amenities (select all that apply)</label>
                      <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
                        <button
                          v-for="amenity in quickAmenities"
                          :key="amenity.value"
                          type="button"
                          @click="toggleAmenity(amenity.value)"
                          class="p-3 border-2 rounded-lg transition-all text-center"
                          :class="form.amenities.includes(amenity.value) ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'"
                        >
                          <div class="text-2xl mb-1">{{ amenity.icon }}</div>
                          <div class="text-xs font-medium">{{ amenity.label }}</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Photos -->
                <div v-if="currentStep === 1" class="space-y-6">
                  <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-text-primary">📸 Add Photos</h2>
                    <p class="text-text-secondary mt-2">Upload at least 3 photos (you can add more later!)</p>
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
                <div v-if="currentStep === 2" class="space-y-6">
                  <div class="text-center mb-6">
                    <div class="text-6xl mb-4">🎉</div>
                    <h2 class="text-2xl font-bold text-text-primary">Almost Done!</h2>
                    <p class="text-text-secondary mt-2">Review and publish your property</p>
                  </div>

                  <div class="bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 rounded-2xl p-6">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm text-text-muted">Property</p>
                        <p class="text-lg font-bold text-text-primary">{{ form.title }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-text-muted">Type</p>
                        <p class="text-lg font-bold text-text-primary">{{ form.category }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-text-muted">Location</p>
                        <p class="text-lg font-bold text-text-primary">{{ form.location }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-text-muted">Price</p>
                        <p class="text-lg font-bold text-brand-600">RWF {{ form.price?.toLocaleString() }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-text-muted">Guests</p>
                        <p class="text-lg font-bold text-text-primary">{{ form.maxGuests }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-text-muted">Photos</p>
                        <p class="text-lg font-bold text-text-primary">{{ propertyImages.length }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="border-t-2 border-gray-100 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50 flex gap-4">
                <button
                  v-if="currentStep > 0"
                  type="button"
                  @click="previousStep"
                  class="px-6 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-text-primary font-semibold rounded-xl hover:bg-gray-50"
                >
                  ← Back
                </button>
                
                <div class="flex-1"></div>

                <button
                  v-if="currentStep < steps.length - 1"
                  type="button"
                  @click="handleNext"
                  :disabled="!canProceed"
                  class="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>

                <button
                  v-else
                  type="button"
                  @click="handleSubmit"
                  :disabled="isSubmitting || imagesUploading"
                  class="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="isSubmitting">Publishing...</span>
                  <span v-else>🚀 Publish Now!</span>
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
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in">
          <div class="bg-gradient-to-br from-green-500 to-green-600 p-8 text-center">
            <div class="text-6xl mb-4">🎉</div>
            <h2 class="text-3xl font-bold text-white mb-2">Published!</h2>
            <p class="text-green-50">Your property is now live</p>
          </div>
          <div class="p-6 text-center">
            <button
              @click="router.push(propertiesPath)"
              class="w-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl"
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
  { value: 'WiFi', label: 'WiFi', icon: '📶' },
  { value: 'Pool', label: 'Pool', icon: '🏊' },
  { value: 'Parking', label: 'Parking', icon: '🚗' },
  { value: 'Air Conditioning', label: 'AC', icon: '❄️' },
  { value: 'Kitchen', label: 'Kitchen', icon: '🍳' },
  { value: 'TV', label: 'TV', icon: '📺' }
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
