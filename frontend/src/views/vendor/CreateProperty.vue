<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div class="mb-8">
          <router-link to="/vendor" class="text-brand-600 hover:text-brand-700 flex items-center gap-2 mb-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('vendor.createListing') }}</h1>
          <p class="text-gray-600">{{ t('vendor.createListingDesc') }}</p>
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
              <h2 class="text-xl font-bold text-gray-900 mb-4">{{ t('vendor.basicInfo') }}</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ t('vendor.propertyType') }}
                  </label>
                  <select 
                    v-model="form.type"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-900"
                    :class="errors.type ? 'border-red-500' : ''"
                  >
                    <option value="">{{ t('vendor.selectType') }}</option>
                    <option value="Hotel">{{ t('accommodation.hotel') }}</option>
                    <option value="Resort">{{ t('accommodation.resort') }}</option>
                    <option value="Lodge">{{ t('accommodation.lodge') }}</option>
                    <option value="Apartment">{{ t('accommodation.apartment') }}</option>
                    <option value="Guesthouse">{{ t('accommodation.guesthouse') }}</option>
                  </select>
                  <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ t('vendor.description') }}
                  </label>
                  <textarea 
                    v-model="form.description"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-gray-900"
                    :placeholder="t('vendor.descriptionPlaceholder')"
                    :class="errors.description ? 'border-red-500' : ''"
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                </div>
              </div>
            </div>

            <!-- Property Details -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">{{ t('vendor.propertyDetails') }}</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">
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
              <h2 class="text-xl font-bold text-gray-900 mb-4">{{ t('vendor.pricing') }}</h2>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('vendor.pricePerNight') }}
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-3 text-gray-500">$</span>
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
              <h2 class="text-xl font-bold text-gray-900 mb-4">{{ t('vendor.propertyImages') }}</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ t('vendor.mainImage') }}
                  </label>
                  <Input 
                    v-model="form.image" 
                    :placeholder="t('vendor.imageUrlPlaceholder')"
                    :class="errors.image ? 'border-red-500' : ''"
                  />
                  <p class="mt-1 text-sm text-gray-500">{{ t('vendor.imageUrlHelper') }}</p>
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

            <!-- Amenities -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">{{ t('vendor.amenities') }}</h2>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    :value="amenity"
                    v-model="form.amenities"
                    class="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span class="text-sm text-gray-700">{{ amenity }}</span>
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
                  <span class="text-sm font-medium text-gray-700">{{ t('vendor.ecoFriendly') }}</span>
                  <p class="text-sm text-gray-500">{{ t('vendor.ecoFriendlyDesc') }}</p>
                </div>
              </label>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-4">
              <Button type="submit" variant="primary" :disabled="isSubmitting">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? t('common.loading') : t('vendor.createListing') }}
              </Button>
              <Button type="button" variant="secondary" @click="$router.push('/vendor')">
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
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'
import api from '../../services/api'

const { t } = useTranslation()
const router = useRouter()
const { showToast } = useToast()

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
  ecoFriendly: false
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
      beds: form.value.beds,
      baths: form.value.baths,
      area: form.value.area,
      image: form.value.image,
      images: [form.value.image, ...form.value.additionalImages.filter(img => img)],
      amenities: form.value.amenities,
      eco_friendly: form.value.ecoFriendly
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
