<template>
  <AdminLayout>
    <div class="container mx-auto px-4 lg:px-8">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ t('admin.manageProperties.pageTitle') }}</h1>
            <p class="text-gray-600 dark:text-gray-400">{{ t('admin.manageProperties.pageSubtitle') }}</p>
          </div>
          <Button @click="showAddModal = true" variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {{ t('admin.manageProperties.addNewProperty') }}
          </Button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>

        <!-- Properties List -->
        <div v-else-if="properties.length > 0" class="space-y-6">
          <Card v-for="property in properties" :key="property.id" padding="lg">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Property Images -->
              <div class="w-full md:w-64 flex-shrink-0">
                <div class="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3">
                  <img 
                    v-if="property.images && property.images[0]" 
                    :src="property.images[0]" 
                    :alt="property.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                
                <!-- Image Upload Button -->
                <button 
                  @click="openImageUpload(property)"
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  {{ t('admin.manageProperties.managePhotos') }}
                </button>

                <!-- 360° & VR Buttons -->
                <div class="mt-2 grid grid-cols-2 gap-2">
                  <button 
                    @click="open360Upload(property)"
                    class="px-2 py-1.5 text-xs bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 rounded text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
                  >
                    {{ t('admin.manageProperties.tour360') }}
                  </button>
                  <button 
                    @click="openVRUpload(property)"
                    class="px-2 py-1.5 text-xs bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    {{ t('admin.manageProperties.vrContent') }}
                  </button>
                </div>
              </div>

              <!-- Property Details -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ property.name || t('admin.manageProperties.untitledProperty') }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {{ property.location || t('admin.manageProperties.noLocation') }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button 
                      @click="editProperty(property)"
                      class="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg transition-colors"
                      :title="t('admin.manageProperties.editProperty')"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteProperty(property.id)"
                      class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      :title="t('admin.manageProperties.deleteProperty')"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.manageProperties.stats.price') }}</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ property.price || '—' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.manageProperties.stats.bedrooms') }}</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ property.bedrooms || 0 }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.manageProperties.stats.bathrooms') }}</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ property.bathrooms || 0 }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ t('admin.manageProperties.stats.type') }}</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ property.property_type || '—' }}</p>
                  </div>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {{ property.description || t('admin.manageProperties.noDescription') }}
                </p>

                <!-- Amenities -->
                <div v-if="property.amenities && property.amenities.length > 0" class="flex flex-wrap gap-2">
                  <span 
                    v-for="amenity in property.amenities.slice(0, 5)" 
                    :key="amenity"
                    class="px-2 py-1 text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full"
                  >
                    {{ amenity }}
                  </span>
                  <span 
                    v-if="property.amenities.length > 5"
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                  >
                    +{{ property.amenities.length - 5 }} {{ t('admin.manageProperties.more') }}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ t('admin.manageProperties.emptyTitle') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('admin.manageProperties.emptySubtitle') }}</p>
          <Button @click="showAddModal = true" variant="primary">{{ t('admin.manageProperties.addProperty') }}</Button>
        </div>
    </div>

    <!-- Edit Property Modal -->
    <teleport to="body">
      <div 
        v-if="showEditModal" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeEditModal"
      >
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ editingProperty.id ? t('admin.manageProperties.editPropertyTitle') : t('admin.manageProperties.addPropertyTitle') }}
            </h2>
            <button @click="closeEditModal" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form @submit.prevent="saveProperty" class="space-y-6">
              <!-- Basic Info -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.manageProperties.form.propertyNameLabel') }} *</label>
                <input 
                  v-model="editingProperty.name" 
                  type="text" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  :placeholder="t('admin.manageProperties.form.propertyNamePlaceholder')"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.manageProperties.form.locationLabel') }} *</label>
                  <input 
                    v-model="editingProperty.location" 
                    type="text" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    :placeholder="t('admin.manageProperties.form.locationPlaceholder')"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.manageProperties.form.priceLabel') }} *</label>
                  <input 
                    v-model="editingProperty.price" 
                    type="text" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    :placeholder="t('admin.manageProperties.form.pricePlaceholder')"
                  />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.manageProperties.form.bedroomsLabel') }}</label>
                  <input 
                    v-model.number="editingProperty.bedrooms" 
                    type="number" 
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.manageProperties.form.bathroomsLabel') }}</label>
                  <input 
                    v-model.number="editingProperty.bathrooms" 
                    type="number" 
                    min="0"
                    step="0.5"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.manageProperties.form.propertyTypeLabel') }}</label>
                  <select 
                    v-model="editingProperty.property_type"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Hotel">{{ t('admin.manageProperties.propertyType.hotel') }}</option>
                    <option value="Motel">{{ t('admin.manageProperties.propertyType.motel') }}</option>
                    <option value="Resort">{{ t('admin.manageProperties.propertyType.resort') }}</option>
                    <option value="Lodge">{{ t('admin.manageProperties.propertyType.lodge') }}</option>
                    <option value="Apartment">{{ t('admin.manageProperties.propertyType.apartment') }}</option>
                    <option value="Guesthouse">{{ t('admin.manageProperties.propertyType.guesthouse') }}</option>
                    <option value="Villa">{{ t('admin.manageProperties.propertyType.villa') }}</option>
                    <option value="House">{{ t('admin.manageProperties.propertyType.house') }}</option>
                    <option value="Condo">{{ t('admin.manageProperties.propertyType.condo') }}</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.manageProperties.form.descriptionLabel') }}</label>
                <textarea 
                  v-model="editingProperty.description" 
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  :placeholder="t('admin.manageProperties.form.descriptionPlaceholder')"
                ></textarea>
              </div>

              <!-- Amenities -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.manageProperties.form.amenitiesLabel') }}</label>
                <input 
                  v-model="amenitiesInput" 
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  :placeholder="t('admin.manageProperties.form.amenitiesPlaceholder')"
                />
              </div>

              <!-- Image URLs -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.manageProperties.form.imageUrlsLabel') }}</label>
                <textarea 
                  v-model="imagesInput" 
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  :placeholder="t('admin.manageProperties.form.imageUrlsPlaceholder')"
                ></textarea>
              </div>

              <div class="flex gap-3 pt-4">
                <Button type="submit" variant="primary" :loading="saving" full-width>
                  {{ saving ? t('admin.manageProperties.saving') : t('admin.manageProperties.saveProperty') }}
                </Button>
                <Button type="button" @click="closeEditModal" variant="outline" full-width>
                  {{ t('common.cancel') }}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Image Upload Modal -->
    <teleport to="body">
      <div 
        v-if="showImageModal" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeImageModal"
      >
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('admin.manageProperties.photosTitle') }}</h2>
            <button @click="closeImageModal" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="p-6">
            <!-- File Upload -->
            <div class="mb-6">
              <label class="block w-full">
                <input 
                  type="file" 
                  @change="handleImageUpload"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  class="hidden"
                  ref="imageInput"
                />
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-500 transition-colors cursor-pointer">
                  <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p class="text-gray-600 font-medium mb-1">{{ t('admin.manageProperties.clickToUploadImages') }}</p>
                  <p class="text-sm text-gray-500">{{ t('admin.manageProperties.uploadHint') }}</p>
                </div>
              </label>
            </div>

            <!-- Current Images -->
            <div v-if="selectedProperty?.images?.length > 0" class="grid grid-cols-3 gap-4">
              <div 
                v-for="(image, index) in selectedProperty.images" 
                :key="index"
                class="relative aspect-video rounded-lg overflow-hidden bg-gray-200 group"
              >
                <img :src="image" :alt="t('admin.manageProperties.propertyImageAlt', { index: index + 1 })" class="w-full h-full object-cover" />
                <button 
                  @click="removeImage(index)"
                  class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <Button @click="closeImageModal" variant="primary">{{ t('common.done') }}</Button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 360° Tour Modal -->
    <teleport to="body">
      <div 
        v-if="show360Modal" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="close360Modal"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
          <div class="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">{{ t('admin.manageProperties.tour360Title') }}</h2>
            <button @click="close360Modal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="p-6">
            <div class="mb-6">
              <label class="block w-full">
                <input 
                  type="file" 
                  @change="handle360Upload"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  class="hidden"
                  ref="tour360Input"
                />
                <div class="border-2 border-dashed border-brand-300 rounded-lg p-8 text-center hover:border-brand-500 transition-colors cursor-pointer bg-brand-50">
                  <svg class="w-12 h-12 mx-auto text-brand-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <p class="text-brand-700 font-medium mb-1">{{ t('admin.manageProperties.tour360UploadTitle') }}</p>
                  <p class="text-sm text-brand-600">{{ t('admin.manageProperties.tour360UploadHint') }}</p>
                </div>
              </label>
            </div>

            <div class="bg-brand-50 border border-brand-200 rounded-lg p-4">
              <p class="text-sm text-brand-800">
                {{ t('admin.manageProperties.tour360Tip') }}
              </p>
            </div>

            <div class="mt-6 flex justify-end">
              <Button @click="close360Modal" variant="primary">{{ t('common.done') }}</Button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- VR Content Modal -->
    <teleport to="body">
      <div 
        v-if="showVRModal" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeVRModal"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
          <div class="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">{{ t('admin.manageProperties.vrTitle') }}</h2>
            <button @click="closeVRModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="p-6">
            <div class="mb-6">
              <label class="block w-full">
                <input 
                  type="file" 
                  @change="handleVRUpload"
                  accept="image/jpeg,image/png,image/webp,video/*"
                  multiple
                  class="hidden"
                  ref="vrInput"
                />
                <div class="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer bg-purple-50">
                  <svg class="w-12 h-12 mx-auto text-purple-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-purple-700 font-medium mb-1">{{ t('admin.manageProperties.vrUploadTitle') }}</p>
                  <p class="text-sm text-purple-600">{{ t('admin.manageProperties.vrUploadHint') }}</p>
                </div>
              </label>
            </div>

            <div class="space-y-4">
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p class="text-sm text-purple-800 font-medium mb-2">{{ t('admin.manageProperties.vrSupportedFormats') }}</p>
                <ul class="text-sm text-purple-700 space-y-1 ml-4">
                  <li>• {{ t('admin.manageProperties.vrFormat1') }}</li>
                  <li>• {{ t('admin.manageProperties.vrFormat2') }}</li>
                  <li>• {{ t('admin.manageProperties.vrFormat3') }}</li>
                  <li>• {{ t('admin.manageProperties.vrFormat4') }}</li>
                </ul>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <Button @click="closeVRModal" variant="primary">{{ t('common.done') }}</Button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Toast Notification -->
    <ToastNotification 
      v-if="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../services/supabase'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'
import ToastNotification from '../../components/common/ToastNotification.vue'
import { confirmDialog } from '../../composables/useConfirm'
import { useTranslation } from '@/composables/useTranslation'
import { uploadToCloudinary } from '@/services/cloudinary'
import { optimizeImageFile, fileToDataUrl } from '@/utils/imageOptimization'
import { IMAGE_UPLOAD_RULES, getImageValidationError, getFinalImageSizeError } from '@/utils/imageUploadRules'

const properties = ref([])
const loading = ref(true)
const saving = ref(false)

const showEditModal = ref(false)
const showAddModal = ref(false)
const showImageModal = ref(false)
const show360Modal = ref(false)
const showVRModal = ref(false)

const editingProperty = ref({
  name: '',
  location: '',
  price: '',
  bedrooms: 0,
  bathrooms: 0,
  property_type: 'Apartment',
  available: true,
  description: '',
  amenities: [],
  images: [],
  tour360: [],
  vrContent: []
})

function normalizePropertyType(rawType) {
  const value = String(rawType || '').trim()
  if (!value) return 'Accommodation'

  const normalized = value
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const map = {
    hotel: 'Hotel',
    motel: 'Motel',
    resort: 'Resort',
    lodge: 'Lodge',
    apartment: 'Apartment',
    villa: 'Villa',
    guesthouse: 'Guesthouse',
    'guest house': 'Guesthouse',
    house: 'House',
    condo: 'Condo'
  }

  return map[normalized] || value.charAt(0).toUpperCase() + value.slice(1)
}

const selectedProperty = ref(null)
const amenitiesInput = ref('')
const imagesInput = ref('')

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const { t } = useTranslation()

// Load properties from database
const loadProperties = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    properties.value = data || []
  } catch (error) {
    console.error('Error loading properties:', error)
    showToast(t('admin.manageProperties.loadFailed'), 'error')
  } finally {
    loading.value = false
  }
}

// Edit property
const editProperty = (property) => {
  editingProperty.value = {
    ...property,
    property_type: normalizePropertyType(property.property_type || property.type)
  }
  amenitiesInput.value = property.amenities?.join(', ') || ''
  imagesInput.value = property.images?.join(', ') || ''
  showEditModal.value = true
}

// Save property
const saveProperty = async () => {
  saving.value = true
  try {
    const propertyData = {
      ...editingProperty.value,
      property_type: normalizePropertyType(editingProperty.value.property_type),
      available: editingProperty.value.available ?? true,
      amenities: amenitiesInput.value.split(',').map(a => a.trim()).filter(Boolean),
      images: imagesInput.value.split(',').map(i => i.trim()).filter(Boolean),
      updated_at: new Date().toISOString()
    }

    // Ensure we don't try to write legacy UI fields that are not DB columns.
    delete propertyData.type

    if (propertyData.id) {
      // Update existing
      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', propertyData.id)
      
      if (error) throw error
      showToast(t('admin.manageProperties.updated'), 'success')
    } else {
      // Create new
      const { error } = await supabase
        .from('properties')
        .insert([{ ...propertyData, created_at: new Date().toISOString() }])
      
      if (error) throw error
      showToast(t('admin.manageProperties.created'), 'success')
    }

    closeEditModal()
    loadProperties()
  } catch (error) {
    console.error('Error saving property:', error)
    showToast(t('admin.manageProperties.saveFailed'), 'error')
  } finally {
    saving.value = false
  }
}

// Delete property
const deleteProperty = async (id) => {
  const ok = await confirmDialog(t('admin.manageProperties.deleteConfirmMessage'), {
    title: t('admin.manageProperties.deleteConfirmTitle'),
    confirmText: t('common.delete'),
    cancelText: t('common.cancel')
  })
  if (!ok) return
  
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    showToast(t('admin.manageProperties.deleted'), 'success')
    loadProperties()
  } catch (error) {
    console.error('Error deleting property:', error)
    showToast(t('admin.manageProperties.deleteFailed'), 'error')
  }
}

// Image management
const openImageUpload = (property) => {
  selectedProperty.value = property
  showImageModal.value = true
}

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files || [])
  event.target.value = ''

  if (!selectedProperty.value?.id) {
    showToast(t('admin.manageProperties.saveFailed'), 'error')
    return
  }
  if (!files.length) return

  const invalid = files
    .map((f) => ({ file: f, err: getImageValidationError(f) }))
    .filter((x) => x.err)
  if (invalid.length > 0) {
    showToast(invalid[0].err, 'error')
    return
  }

  const isCloudinaryConfigured = Boolean(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  )

  try {
    showToast(t('admin.manageProperties.imageUploadInfo'), 'info')

    const uploadedUrls = []
    for (const file of files) {
      const optimized = await optimizeImageFile(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 })
      const finalSizeError = getFinalImageSizeError(optimized, IMAGE_UPLOAD_RULES)
      if (finalSizeError) throw new Error(finalSizeError)

      if (isCloudinaryConfigured) {
        const result = await uploadToCloudinary(optimized, { folder: 'merry360x/properties' })
        uploadedUrls.push(result.secure_url)
      } else {
        uploadedUrls.push(await fileToDataUrl(optimized))
      }
    }

    const nextImages = [...(selectedProperty.value.images || []), ...uploadedUrls]
    selectedProperty.value.images = nextImages

    const { error } = await supabase
      .from('properties')
      .update({ images: nextImages })
      .eq('id', selectedProperty.value.id)

    if (error) throw error

    showToast(t('admin.manageProperties.updated'), 'success')
    await loadProperties()
  } catch (error) {
    console.error('Error uploading images:', error)
    showToast(String(error?.message || t('admin.manageProperties.saveFailed')), 'error')
  }
}

const removeImage = async (index) => {
  if (selectedProperty.value?.images) {
    selectedProperty.value.images.splice(index, 1)
    // Save to database
    try {
      const { error } = await supabase
        .from('properties')
        .update({ images: selectedProperty.value.images })
        .eq('id', selectedProperty.value.id)
      
      if (error) throw error
      showToast(t('admin.manageProperties.imageRemoved'), 'success')
      loadProperties()
    } catch (error) {
      console.error('Error removing image:', error)
      showToast(t('admin.manageProperties.imageRemoveFailed'), 'error')
    }
  }
}

// 360° Tour management
const open360Upload = (property) => {
  selectedProperty.value = property
  show360Modal.value = true
}

const handle360Upload = async (event) => {
  const files = Array.from(event.target.files)
  
  // Check for large files and warn
  const largeFiles = files.filter(file => file.size > 5 * 1024 * 1024)
  if (largeFiles.length > 0) {
    const totalSizeMB = (largeFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)
    showToast(`Large files detected (${totalSizeMB}MB total). Upload may take longer.`, 'warning', 1000)
  }
  
  showToast(t('admin.manageProperties.tour360UploadInfo'), 'info')
}

// VR Content management
const openVRUpload = (property) => {
  selectedProperty.value = property
  showVRModal.value = true
}

const handleVRUpload = async (event) => {
  const files = Array.from(event.target.files)
  
  // Check for large files and warn
  const largeFiles = files.filter(file => file.size > 5 * 1024 * 1024)
  if (largeFiles.length > 0) {
    const totalSizeMB = (largeFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)
    showToast(`Large files detected (${totalSizeMB}MB total). Upload may take longer.`, 'warning', 1000)
  }
  
  showToast(t('admin.manageProperties.vrUploadInfo'), 'info')
}

// Modal controls
const closeEditModal = () => {
  showEditModal.value = false
  editingProperty.value = {
    name: '',
    location: '',
    price: '',
    bedrooms: 0,
    bathrooms: 0,
    property_type: 'Apartment',
    available: true,
    description: '',
    amenities: [],
    images: []
  }
  amenitiesInput.value = ''
  imagesInput.value = ''
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedProperty.value = null
}

const close360Modal = () => {
  show360Modal.value = false
  selectedProperty.value = null
}

const closeVRModal = () => {
  showVRModal.value = false
  selectedProperty.value = null
}

// Toast notification
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Watch for add modal
const editPropertyValue = computed(() => {
  if (showAddModal.value) {
    editingProperty.value = {
      name: '',
      location: '',
      price: '',
      bedrooms: 0,
      bathrooms: 0,
      type: 'apartment',
      description: '',
      amenities: [],
      images: []
    }
    showEditModal.value = true
    showAddModal.value = false
  }
  return editingProperty.value
})

onMounted(() => {
  loadProperties()
})
</script>
