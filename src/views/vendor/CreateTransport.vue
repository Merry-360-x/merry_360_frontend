<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div class="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div class="mb-8">
          <router-link :to="dashboardPath" class="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center gap-2 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {{ t('common.backToDashboard') }}
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ t('transport.createTitle') }}</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ t('transport.createSubtitle') }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div class="flex items-center gap-2 text-green-800 dark:text-green-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">{{ t('transport.createSuccess') }}</span>
          </div>
        </div>

        <!-- Form -->
        <Card padding="lg">
          <form @submit.prevent="handleSubmit">
            <!-- Basic Information -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ t('common.basicInfo') }}</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('transport.serviceName') }} *</label>
                  <Input 
                    v-model="form.name" 
                    :placeholder="t('transport.serviceNamePlaceholder')"
                    :class="errors.name ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.name }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('transport.vehicleType') }} *</label>
                  <select 
                    v-model="form.vehicleType"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    :class="errors.vehicleType ? 'border-red-500' : ''"
                  >
                    <option value="">{{ t('transport.selectVehicleType') }}</option>
                    <option value="Car">{{ t('transport.types.car') }}</option>
                    <option value="SUV">{{ t('transport.types.suv') }}</option>
                    <option value="Van">{{ t('transport.types.van') }}</option>
                    <option value="Bus">{{ t('transport.types.bus') }}</option>
                    <option value="Minibus">{{ t('transport.types.minibus') }}</option>
                    <option value="Luxury">{{ t('transport.types.luxury') }}</option>
                  </select>
                  <p v-if="errors.vehicleType" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.vehicleType }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('transport.route') }} *</label>
                  <Input 
                    v-model="form.route" 
                    :placeholder="t('transport.routePlaceholder')"
                    :class="errors.route ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.route" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.route }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('common.description') }} *</label>
                  <textarea 
                    v-model="form.description"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    :placeholder="t('transport.descriptionPlaceholder')"
                    :class="errors.description ? 'border-red-500' : ''"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.description }}</p>
                </div>
              </div>
            </div>

            <!-- Vehicle Details -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ t('transport.vehicleDetails') }}</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('transport.capacity') }} *</label>
                  <Input 
                    v-model.number="form.capacity" 
                    type="number"
                    placeholder="4"
                    :class="errors.capacity ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.capacity" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.capacity }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('transport.luggageBags') }}</label>
                  <Input 
                    v-model.number="form.luggageBags" 
                    type="number"
                    placeholder="0"
                    min="0"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t('transport.luggageBagsHint') }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('transport.pricePerDay') }} (RWF) *</label>
                  <Input 
                    v-model.number="form.price" 
                    type="number"
                    placeholder="0"
                    min="0"
                    :class="errors.price ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.price" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.price }}</p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t('common.enterPriceRWF') }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('transport.durationDays') }}</label>
                  <Input 
                    v-model.number="form.durationDays" 
                    type="number"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('transport.durationHours') }}</label>
                  <Input 
                    v-model.number="form.durationHours" 
                    type="number"
                    placeholder="0"
                    min="0"
                    max="23"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t('common.leaveAsZeroIfNoHours') }}</p>
                </div>
              </div>
            </div>

            <!-- Images -->
            <div class="mb-8">
              <PhotoUploader
                v-model="transportImages"
                v-model:uploading="imagesUploading"
                :title="t('transport.vehicleImages')"
                :subtitle="t('transport.vehicleImagesSubtitle')"
                :min-photos="1"
                :max-photos="10"
                folder="merry360x/transport"
              />
            </div>

            <!-- Features & Amenities -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ t('transport.featuresAmenities') }}</h2>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label v-for="feature in availableFeatures" :key="feature" class="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    :value="feature" 
                    v-model="form.features"
                    class="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ feature }}</span>
                </label>
              </div>
            </div>

            <!-- Driver Information -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ t('transport.driverInfo') }}</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('transport.driverName') }}</label>
                  <Input 
                    v-model="form.driverName" 
                    :placeholder="t('transport.driverNamePlaceholder')"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('transport.driverExperience') }}</label>
                  <Input 
                    v-model="form.driverExperience" 
                    :placeholder="t('transport.driverExperiencePlaceholder')"
                  />
                </div>

                <div>
                  <label class="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      v-model="form.professionalDriver"
                      class="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('transport.professionalDriver') }}</span>
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
                {{ isSubmitting ? t('common.creating') : (imagesUploading ? t('common.uploading') : t('transport.createService')) }}
              </Button>
              <Button type="button" variant="secondary" @click="handleCancel">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../../composables/useToast'
import { useTranslation } from '../../composables/useTranslation'
import { useDashboardPath } from '../../composables/useDashboardPath'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'
import PhotoUploader from '../../components/host/PhotoUploader.vue'
import api from '../../services/api'

const router = useRouter()
const { showToast } = useToast()
const { t } = useTranslation()
const { dashboardPath } = useDashboardPath()

const form = ref({
  name: '',
  vehicleType: '',
  route: '',
  description: '',
  capacity: null,
  luggageBags: 0,
  price: null,
  durationDays: 0,
  durationHours: 0,
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
  
  if (!form.value.name?.trim()) errors.value.name = 'Please enter a service name'
  if (!form.value.vehicleType) errors.value.vehicleType = 'Please select a vehicle type'
  if (!form.value.route?.trim()) errors.value.route = 'Please enter a route'
  if (!form.value.description?.trim()) errors.value.description = 'Please enter a description'
  if (!form.value.capacity || form.value.capacity <= 0) errors.value.capacity = 'Please enter passenger capacity'
  if (!form.value.price || form.value.price <= 0) errors.value.price = 'Please enter a valid price'
  if (transportImages.value.length === 0) errors.value.image = 'Please upload at least one image'
  
  return Object.keys(errors.value).length === 0
}

const handleCancel = () => {
  router.push(dashboardPath.value)
}

const handleSubmit = async () => {
  if (imagesUploading.value) {
    showToast(t('common.waitForUpload'), 'error')
    return
  }
  if (!validateForm()) {
    showToast(t('validation.fixErrors'), 'error')
    return
  }

  isSubmitting.value = true

  try {
    const imageUrls = transportImages.value.map((img) => img.url || img.preview).filter(Boolean)

    if (imageUrls.length === 0) {
      throw new Error(t('validation.uploadAtLeastOneImage'))
    }

    const durationString = form.value.durationDays > 0 
      ? `${form.value.durationDays} ${form.value.durationDays === 1 ? 'day' : 'days'}${form.value.durationHours > 0 ? ` ${form.value.durationHours} ${form.value.durationHours === 1 ? 'hour' : 'hours'}` : ''}`
      : form.value.durationHours > 0 
        ? `${form.value.durationHours} ${form.value.durationHours === 1 ? 'hour' : 'hours'}`
        : ''

    const transportData = {
      name: form.value.name,
      vehicle_type: form.value.vehicleType,
      type: form.value.vehicleType,
      route: form.value.route,
      description: form.value.description,
      capacity: Number(form.value.capacity),
      luggage_bags: Number(form.value.luggageBags) || 0,
      price: Number(form.value.price),
      duration_days: Number(form.value.durationDays) || 0,
      duration_hours: Number(form.value.durationHours) || 0,
      duration: durationString,
      main_image: imageUrls[0],
      image: imageUrls[0],
      images: imageUrls,
      features: form.value.features || [],
      driver_name: form.value.driverName || '',
      driver_experience: form.value.driverExperience || '',
      professional_driver: form.value.professionalDriver || false,
      available: true
    }

    // Direct API call - no timeout wrapper needed
    await api.transport.create(transportData)
    
    showSuccess.value = true
    showToast(t('transport.createSuccess'), 'success')
    
    setTimeout(() => {
      router.push(dashboardPath.value)
    }, 2000)
  } catch (error) {
    let errorMessage = t('transport.createError')
    if (error?.message) errorMessage = error.message
    showToast(errorMessage, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
