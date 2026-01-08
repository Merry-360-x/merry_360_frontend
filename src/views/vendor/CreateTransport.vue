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
        <router-link :to="dashboardPath" class="inline-flex items-center gap-2 mb-6 text-white hover:text-white/90 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </router-link>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in-down">🚗 Create Transport Service</h1>
        <p class="text-xl text-white/90 animate-fade-in-up">Offer transportation services to travelers</p>
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
              <span class="font-bold text-lg">Transport service created successfully!</span>
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
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Basic Information</h2>
                </div>
              
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
            <div class="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t-2 border-gray-100 dark:border-gray-700">
              <button
                type="submit"
                :disabled="isSubmitting || imagesUploading"
                class="group flex-1 px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:hover:shadow-xl"
              >
                <span v-if="isSubmitting || imagesUploading" class="flex items-center justify-center gap-3">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSubmitting ? 'Creating...' : 'Uploading...' }}
                </span>
                <span v-else class="flex items-center justify-center gap-3">
                  <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Create Service
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
              </button>
              <button
                type="button"
                @click="$router.push(dashboardPath)"
                class="px-8 py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Cancel
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

    const transportData = {
      name: form.value.name,
      vehicle_type: form.value.vehicleType,
      route: form.value.route,
      description: form.value.description,
      capacity: form.value.capacity,
      luggage: form.value.luggage,
      price: form.value.price,
      duration: form.value.duration,
      image: imageUrls[0],
      images: imageUrls,
      features: form.value.features,
      driver_name: form.value.driverName,
      driver_experience: form.value.driverExperience,
      professional_driver: form.value.professionalDriver
    }
    
    await api.transport.create(transportData)
    
    showSuccess.value = true
    showToast('Transport service created successfully!', 'success')
    
    setTimeout(() => {
      router.push(dashboardPath.value)
    }, 2000)
  } catch (error) {
    console.error('Transport creation error:', error)
    showToast(error.message || 'Failed to create transport service', 'error')
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