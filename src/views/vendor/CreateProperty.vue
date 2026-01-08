<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-orange-600 py-12">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div class="absolute top-20 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div class="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
        <router-link to="/vendor" class="inline-flex items-center gap-2 mb-6 text-white hover:text-white/90 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          {{ t('vendor.backToDashboard') }}
        </router-link>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in-down">🏨 {{ t('vendor.createListing') }}</h1>
        <p class="text-xl text-white/90 animate-fade-in-up">{{ t('vendor.createListingDesc') }}</p>
      </div>
    </section>

    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="container mx-auto px-4 lg:px-8 max-w-4xl">
        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg animate-slide-up">
          <div class="flex items-center gap-3 text-green-800">
            <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <span class="font-bold text-lg">{{ t('vendor.listingCreated') }}</span>
              <p class="text-sm text-green-700 mt-1">Redirecting you to dashboard...</p>
            </div>
          </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          <form @submit.prevent="handleSubmit">
            <div class="p-8">
              <!-- Basic Information -->
              <div class="mb-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h2 class="text-2xl font-bold text-text-primary">{{ t('vendor.basicInfo') }}</h2>
                </div>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-semibold text-text-primary mb-2">
                    {{ t('vendor.propertyName') }} *
                  </label>
                  <Input 
                    v-model="form.name" 
                    :placeholder="t('vendor.propertyNamePlaceholder')"
                    class="rounded-xl border-2"
                    :class="errors.name ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.name" class="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    {{ errors.name }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-text-primary mb-2">
                    {{ t('vendor.propertyType') }} *
                  </label>
                  <select 
                    v-model="form.type"
                    class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-800 text-text-primary transition-all"
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
                  <p v-if="errors.type" class="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    {{ errors.type }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-text-primary mb-2">
                    {{ t('accommodation.location') }} *
                  </label>
                  <Input 
                    v-model="form.location" 
                    :placeholder="t('vendor.locationPlaceholder')"
                    class="rounded-xl border-2"
                    :class="errors.location ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.location" class="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    {{ errors.location }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-text-primary mb-2">
                    {{ t('vendor.description') }} *
                  </label>
                  <textarea 
                    v-model="form.description"
                    rows="4"
                    class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-800 text-text-primary placeholder:text-text-muted transition-all"
                    :placeholder="t('vendor.descriptionPlaceholder')"
                    :class="errors.description ? 'border-red-500' : ''"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    {{ errors.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Property Details -->
            <div class="mb-10">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-text-primary">{{ t('vendor.propertyDetails') }}</h2>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    {{ t('vendor.beds') }}
                  </label>
                  <Input 
                    v-model.number="form.beds" 
                    type="number"
                    min="1"
                    :placeholder="t('vendor.bedsPlaceholder')"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-2">
                    {{ t('vendor.baths') }}
                  </label>
                  <Input 
                    v-model.number="form.baths" 
                    type="number"
                    min="1"
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

            <!-- Submit Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t-2 border-gray-100 dark:border-gray-700">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="group flex-1 px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:hover:shadow-xl"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-3">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ t('common.loading') }}
                </span>
                <span v-else class="flex items-center justify-center gap-3">
                  <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  {{ t('vendor.createListing') }}
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
              </button>
              <button
                type="button"
                @click="$router.push('/vendor')"
                class="px-8 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {{ t('common.cancel') }}
              </button>
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
  
  if (!form.value.name) errors.value.name = t('vendor.nameRequired')
  if (!form.value.type) errors.value.type = t('vendor.typeRequired')
  if (!form.value.location) errors.value.location = t('vendor.locationRequired')
  if (!form.value.description) errors.value.description = t('vendor.descriptionRequired')
  if (!form.value.price || form.value.price <= 0) errors.value.price = t('vendor.priceRequired')
  if (!form.value.image) errors.value.image = t('vendor.imageRequired')
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  // Validate BEFORE setting isSubmitting to avoid button getting stuck
  if (!validateForm()) {
    showToast(t('vendor.fixErrors'), 'error')
    return
  }

  isSubmitting.value = true

  try {
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
    
    await api.accommodations.create(propertyData)
    
    showSuccess.value = true
    showToast(t('vendor.listingCreatedSuccess'), 'success')
    
    setTimeout(() => {
      router.push('/vendor')
    }, 2000)
  } catch (error) {
    console.error('Property creation error:', error)
    showToast(error.message || t('vendor.createError'), 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Merry360 Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -50px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>