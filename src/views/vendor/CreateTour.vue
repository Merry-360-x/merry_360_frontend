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
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tour.createTitle') }}</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ t('tour.createSubtitle') }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div class="flex items-center gap-2 text-green-800 dark:text-green-300">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">{{ t('tour.createSuccess') }}</span>
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
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('tour.tourTitle') }} *</label>
                  <Input 
                    v-model="form.title" 
                    :placeholder="t('tour.tourTitlePlaceholder')"
                    :class="errors.title ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.title" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.title }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('common.location') }} *</label>
                  <Input 
                    v-model="form.location" 
                    :placeholder="t('tour.locationPlaceholder')"
                    :class="errors.location ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.location" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.location }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('common.description') }} *</label>
                  <textarea 
                    v-model="form.description"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    :placeholder="t('tour.descriptionPlaceholder')"
                    :class="errors.description ? 'border-red-500' : ''"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.description }}</p>
                </div>
              </div>
            </div>

            <!-- Tour Details -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ t('tour.tourDetails') }}</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('tour.durationDays') }} *</label>
                  <Input 
                    v-model.number="form.durationDays" 
                    type="number"
                    placeholder="0"
                    min="0"
                    :class="errors.durationDays ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.durationDays" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.durationDays }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('tour.durationHours') }}</label>
                  <Input 
                    v-model.number="form.durationHours" 
                    type="number"
                    placeholder="0"
                    min="0"
                    max="23"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t('common.leaveAsZeroIfNoHours') }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('tour.category') }} *</label>
                  <select 
                    v-model="form.category"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    :class="errors.category ? 'border-red-500' : ''"
                  >
                    <option value="">{{ t('tour.selectCategory') }}</option>
                    <option value="Nature">{{ t('tour.categories.nature') }}</option>
                    <option value="Adventure">{{ t('tour.categories.adventure') }}</option>
                    <option value="Cultural">{{ t('tour.categories.cultural') }}</option>
                    <option value="Wildlife">{{ t('tour.categories.wildlife') }}</option>
                    <option value="Historical">{{ t('tour.categories.historical') }}</option>
                  </select>
                  <p v-if="errors.category" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.category }}</p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t('tour.categoryHint') }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('tour.difficulty') }} *</label>
                  <select 
                    v-model="form.difficulty"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    :class="errors.difficulty ? 'border-red-500' : ''"
                  >
                    <option value="">{{ t('tour.selectDifficulty') }}</option>
                    <option value="Easy">{{ t('tour.difficulties.easy') }}</option>
                    <option value="Moderate">{{ t('tour.difficulties.moderate') }}</option>
                    <option value="Challenging">{{ t('tour.difficulties.challenging') }}</option>
                    <option value="Extreme">{{ t('tour.difficulties.extreme') }}</option>
                  </select>
                  <p v-if="errors.difficulty" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.difficulty }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('tour.pricePerPerson') }} (RWF) *</label>
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
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('tour.groupSize') }} *</label>
                  <Input 
                    v-model.number="form.groupSize" 
                    type="number"
                    placeholder="8"
                    :class="errors.groupSize ? 'border-red-500' : ''"
                  />
                  <p v-if="errors.groupSize" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.groupSize }}</p>
                </div>
              </div>
            </div>

            <!-- Images -->
            <div class="mb-8">
              <PhotoUploader
                v-model="tourImages"
                v-model:uploading="imagesUploading"
                :title="t('tour.tourImages')"
                :subtitle="t('tour.tourImagesSubtitle')"
                :min-photos="1"
                :max-photos="15"
                folder="merry360x/tours"
              />
            </div>

            <!-- Inclusions -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ t('tour.whatsIncluded') }}</h2>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label v-for="inclusion in availableInclusions" :key="inclusion" class="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    :value="inclusion" 
                    v-model="form.inclusions"
                    class="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ inclusion }}</span>
                </label>
              </div>
            </div>

            <!-- Itinerary -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ t('tour.itinerary') }}</h2>
              <textarea 
                v-model="form.itinerary"
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                :placeholder="t('tour.itineraryPlaceholder')"
              ></textarea>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-4">
              <Button type="submit" variant="primary" :disabled="isSubmitting || imagesUploading">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? t('common.creating') : (imagesUploading ? t('common.uploading') : t('tour.createTour')) }}
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
  title: '',
  location: '',
  description: '',
  category: '',
  durationDays: 0,
  durationHours: 0,
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
  
  if (!form.value.title?.trim()) errors.value.title = 'Please enter a tour title'
  if (!form.value.location?.trim()) errors.value.location = 'Please enter a location'
  if (!form.value.description?.trim()) errors.value.description = 'Please enter a description'
  if (!form.value.category) errors.value.category = 'Please select a category'
  if (form.value.durationDays === null || form.value.durationDays < 0) errors.value.durationDays = 'Please enter number of days'
  if (form.value.durationDays === 0 && form.value.durationHours === 0) errors.value.durationDays = 'Duration must be at least 1 hour or 1 day'
  if (!form.value.difficulty) errors.value.difficulty = 'Please select difficulty level'
  if (!form.value.price || form.value.price <= 0) errors.value.price = 'Please enter a valid price'
  if (!form.value.groupSize || form.value.groupSize <= 0) errors.value.groupSize = 'Please enter group size'
  if (tourImages.value.length === 0) errors.value.image = 'Please upload at least one image'
  
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
    const imageUrls = tourImages.value.map((img) => img.url || img.preview).filter(Boolean)

    if (imageUrls.length === 0) {
      throw new Error(t('validation.uploadAtLeastOneImage'))
    }

    const durationString = form.value.durationDays > 0 
      ? `${form.value.durationDays} ${form.value.durationDays === 1 ? 'day' : 'days'}${form.value.durationHours > 0 ? ` ${form.value.durationHours} ${form.value.durationHours === 1 ? 'hour' : 'hours'}` : ''}`
      : `${form.value.durationHours} ${form.value.durationHours === 1 ? 'hour' : 'hours'}`

    const tourData = {
      name: form.value.title,
      title: form.value.title,
      destination: form.value.location,
      location: form.value.location,
      description: form.value.description,
      category: form.value.category,
      duration_days: Number(form.value.durationDays) || 0,
      duration_hours: Number(form.value.durationHours) || 0,
      duration: durationString,
      difficulty: form.value.difficulty,
      price: Number(form.value.price),
      group_size: form.value.groupSize,
      max_participants: form.value.groupSize,
      main_image: imageUrls[0],
      image: imageUrls[0],
      images: imageUrls,
      inclusions: form.value.inclusions || [],
      itinerary: form.value.itinerary || '',
      available: true
    }

    // Direct API call - no timeout wrapper needed
    await api.tours.create(tourData)
    
    showSuccess.value = true
    showToast(t('tour.createSuccess'), 'success')
    
    setTimeout(() => {
      router.push(dashboardPath.value)
    }, 2000)
  } catch (error) {
    let errorMessage = t('tour.createError')
    if (error?.message) errorMessage = error.message
    showToast(errorMessage, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
