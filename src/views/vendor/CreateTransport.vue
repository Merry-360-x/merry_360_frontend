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
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Transport Service</h1>
          <p class="text-gray-600">Offer transportation services to travelers</p>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center gap-2 text-green-800">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">Transport service created successfully!</span>
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                  <Input 
                    v-model="form.name" 
                    placeholder="E.g., Kigali Airport Transfer"
                    :class="errors.name ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Vehicle Type *</label>
                  <select 
                    v-model="form.vehicleType"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-900"
                    :class="errors.vehicleType ? 'border-red-500' : ''"
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Car">Car</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option>
                    <option value="Bus">Bus</option>
                    <option value="Minibus">Minibus</option>
                    <option value="Luxury">Luxury Vehicle</option>
                  </select>
                  <p v-if="errors.vehicleType" class="mt-1 text-sm text-red-600">{{ errors.vehicleType }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Route *</label>
                  <Input 
                    v-model="form.route" 
                    placeholder="E.g., Kigali Airport → City Center"
                    :class="errors.route ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.route" class="mt-1 text-sm text-red-600">{{ errors.route }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea 
                    v-model="form.description"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-900"
                    placeholder="Describe your transport service..."
                    :class="errors.description ? 'border-red-500' : ''"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                </div>
              </div>
            </div>

            <!-- Vehicle Details -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Vehicle Details</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Capacity (passengers) *</label>
                  <Input 
                    v-model.number="form.capacity" 
                    type="number"
                    placeholder="4"
                    :class="errors.capacity ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.capacity" class="mt-1 text-sm text-red-600">{{ errors.capacity }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Luggage Capacity</label>
                  <Input 
                    v-model="form.luggage" 
                    placeholder="E.g., 3 large bags"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                  <Input 
                    v-model.number="form.price" 
                    type="number"
                    placeholder="0"
                    :class="errors.price ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <Input 
                    v-model="form.duration" 
                    placeholder="E.g., 30 minutes"
                  />
                </div>
              </div>
            </div>

            <!-- Images -->
            <div class="mb-8">
              <PhotoUploader
                v-model="transportImages"
                v-model:uploading="imagesUploading"
                title="Vehicle Images"
                subtitle="Add photos of your vehicle"
                :min-photos="1"
                :max-photos="10"
                folder="merry360x/transport"
              />
            </div>

            <!-- Features & Amenities -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label v-for="feature in availableFeatures" :key="feature" class="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    :value="feature" 
                    v-model="form.features"
                    class="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span class="text-sm text-gray-700">{{ feature }}</span>
                </label>
              </div>
            </div>

            <!-- Driver Information -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Driver Information (optional)</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                  <Input 
                    v-model="form.driverName" 
                    placeholder="E.g., John Doe"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Driver Experience</label>
                  <Input 
                    v-model="form.driverExperience" 
                    placeholder="E.g., 10 years"
                  />
                </div>

                <div>
                  <label class="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      v-model="form.professionalDriver"
                      class="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span class="text-sm text-gray-700">Professional licensed driver</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-4">
              <Button type="submit" variant="primary" :disabled="isSubmitting || imagesUploading">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Creating...' : (imagesUploading ? 'Uploading...' : 'Create Service') }}
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
import PhotoUploader from '../../components/host/PhotoUploader.vue'
import api from '../../services/api'

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
  name: '',
  vehicleType: '',
  route: '',
  description: '',
  capacity: null,
  luggage: '',
  price: null,
  duration: '',
  image: '',
  additionalImages: [],
  features: [],
  driverName: '',
  driverExperience: '',
  professionalDriver: false
})

const errors = ref({})
const isSubmitting = ref(false)
const showSuccess = ref(false)
const transportImages = ref([])
const imagesUploading = ref(false)

const availableFeatures = [
  'A/C', 'WiFi', 'GPS', 'Child Seat', 
  'USB Charging', 'Bottled Water', 'Bluetooth', 'Luggage Rack',
  'Pet Friendly', 'Wheelchair Access', 'Music System', 'Phone Charger'
]

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name) errors.value.name = 'Service name is required'
  if (!form.value.vehicleType) errors.value.vehicleType = 'Vehicle type is required'
  if (!form.value.route) errors.value.route = 'Route is required'
  if (!form.value.description) errors.value.description = 'Description is required'
  if (!form.value.capacity || form.value.capacity <= 0) errors.value.capacity = 'Valid capacity is required'
  if (!form.value.price || form.value.price <= 0) errors.value.price = 'Valid price is required'
  if (transportImages.value.length === 0) errors.value.image = 'At least one vehicle image is required'
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  console.log('🔍 [Transport Create] Starting submission...')
  
  // Validate BEFORE setting isSubmitting to avoid button getting stuck
  if (imagesUploading.value) {
    showToast('Please wait for image uploads to finish.', 'error')
    return
  }
  if (!validateForm()) {
    showToast('Please fix all errors', 'error')
    return
  }

  isSubmitting.value = true

  try {
    const imageUrls = transportImages.value.map((img) => img.url || img.preview).filter(Boolean)
    console.log('📷 [Transport Create] Image URLs:', imageUrls.length)

    if (imageUrls.length === 0) {
      throw new Error('Please upload at least one image')
    }

    const transportData = {
      name: form.value.name,
      vehicle_type: form.value.vehicleType,
      type: form.value.vehicleType,
      route: form.value.route,
      description: form.value.description,
      capacity: Number(form.value.capacity),
      luggage: form.value.luggage || '',
      price: Number(form.value.price),
      duration: form.value.duration || '',
      main_image: imageUrls[0],
      image: imageUrls[0],
      images: imageUrls,
      features: form.value.features || [],
      driver_name: form.value.driverName || '',
      driver_experience: form.value.driverExperience || '',
      professional_driver: form.value.professionalDriver || false,
      available: true
    }
    
    console.log('📤 [Transport Create] Submitting transport data:', transportData)
    
    // Verify API method exists
    if (!api.transport || typeof api.transport.create !== 'function') {
      throw new Error('Transport creation API is not available. Please contact support.')
    }

    // Add timeout protection
    const createTransport = api.transport.create(transportData)
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - please try again')), 30000)
    )

    const result = await Promise.race([createTransport, timeout])
    console.log('✅ [Transport Create] Transport created successfully!', result)
    
    showSuccess.value = true
    showToast('Transport service created successfully!', 'success')
    
    setTimeout(() => {
      router.push(dashboardPath.value)
    }, 2000)
  } catch (error) {
    console.error('❌ [Transport Create] Error:', error)
    
    let errorMessage = 'Failed to create transport service. Please try again.'
    
    if (error?.message) {
      errorMessage = error.message
    } else if (error?.error?.message) {
      errorMessage = error.error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    if (errorMessage.includes('timeout')) {
      errorMessage = 'The request is taking too long. Please check your internet and try again.'
    } else if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
      errorMessage = 'You don\'t have permission to create transport services. Please contact admin.'
    }

    showToast(errorMessage, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
