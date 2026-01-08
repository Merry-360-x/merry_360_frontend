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
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in-down">🗺️ Create Tour</h1>
        <p class="text-xl text-white/90 animate-fade-in-up">Create a new tour experience for travelers</p>
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
              <span class="font-bold text-lg">Tour created successfully!</span>
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
              <PhotoUploader
                v-model="tourImages"
                v-model:uploading="imagesUploading"
                title="Tour Images"
                subtitle="Add photos to showcase your tour experience"
                :min-photos="1"
                :max-photos="15"
                folder="merry360x/tours"
              />
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
                  Create Tour
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
const tourImages = ref([])
const imagesUploading = ref(false)



const availableInclusions = [
  'Accommodation', 'Meals', 'Transport', 'Guide', 
  'Park Fees', 'Equipment', 'Insurance', 'Water',
  'Snacks', 'Photography', 'First Aid', 'Permits'
]

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title) errors.value.title = 'Title is required'
  if (!form.value.location) errors.value.location = 'Location is required'
  if (!form.value.description) errors.value.description = 'Description is required'
  if (!form.value.duration) errors.value.duration = 'Duration is required'
  if (!form.value.difficulty) errors.value.difficulty = 'Difficulty level is required'
  if (!form.value.price || form.value.price <= 0) errors.value.price = 'Valid price is required'
  if (!form.value.groupSize || form.value.groupSize <= 0) errors.value.groupSize = 'Group size is required'
  if (tourImages.value.length === 0) errors.value.image = 'At least one image is required'
  
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
    const imageUrls = tourImages.value.map((img) => img.url || img.preview).filter(Boolean)

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