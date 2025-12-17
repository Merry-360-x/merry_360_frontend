<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="container mx-auto px-4 lg:px-8">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Property Management</h1>
            <p class="text-gray-600 dark:text-gray-300">Manage all properties, photos, 360° tours, and VR content</p>
          </div>
          <Button @click="showAddModal = true" variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add New Property
          </Button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>

        <!-- Properties List -->
        <div v-else-if="properties.length > 0" class="space-y-6">
          <Card v-for="property in properties" :key="property.id" padding="lg">
            <div class="flex gap-6">
              <!-- Property Images -->
              <div class="w-64 flex-shrink-0">
                <div class="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3">
                  <img 
                    v-if="property.images && property.images[0]" 
                    :src="property.images[0]" 
                    :alt="property.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
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
                  Manage Photos
                </button>

                <!-- 360° & VR Buttons -->
                <div class="mt-2 grid grid-cols-2 gap-2">
                  <button 
                    @click="open360Upload(property)"
                    class="px-2 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    360° Tour
                  </button>
                  <button 
                    @click="openVRUpload(property)"
                    class="px-2 py-1.5 text-xs bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    VR Content
                  </button>
                </div>
              </div>

              <!-- Property Details -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ property.name || 'Untitled Property' }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {{ property.location || 'No location' }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button 
                      @click="editProperty(property)"
                      class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit Property"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteProperty(property.id)"
                      class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Property"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Price</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ property.price || '—' }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Bedrooms</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ property.bedrooms || 0 }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Bathrooms</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ property.bathrooms || 0 }}</p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Type</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ property.type || '—' }}</p>
                  </div>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                  {{ property.description || 'No description available.' }}
                </p>

                <!-- Amenities -->
                <div v-if="property.amenities && property.amenities.length > 0" class="flex flex-wrap gap-2">
                  <span 
                    v-for="amenity in property.amenities.slice(0, 5)" 
                    :key="amenity"
                    class="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full"
                  >
                    {{ amenity }}
                  </span>
                  <span 
                    v-if="property.amenities.length > 5"
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                  >
                    +{{ property.amenities.length - 5 }} more
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Properties Yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Start by adding your first property</p>
          <Button @click="showAddModal = true" variant="primary">Add Property</Button>
        </div>
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
              {{ editingProperty.id ? 'Edit Property' : 'Add New Property' }}
            </h2>
            <button @click="closeEditModal" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form @submit.prevent="saveProperty" class="space-y-6">
              <!-- Basic Info -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Name *</label>
                <input 
                  v-model="editingProperty.name" 
                  type="text" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="e.g., Luxury Villa in Kigali"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                  <input 
                    v-model="editingProperty.location" 
                    type="text" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="e.g., Kigali, Rwanda"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price *</label>
                  <input 
                    v-model="editingProperty.price" 
                    type="text" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="e.g., $250/night"
                  />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bedrooms</label>
                  <input 
                    v-model.number="editingProperty.bedrooms" 
                    type="number" 
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bathrooms</label>
                  <input 
                    v-model.number="editingProperty.bathrooms" 
                    type="number" 
                    min="0"
                    step="0.5"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Type</label>
                  <select 
                    v-model="editingProperty.type"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                    <option value="hotel">Hotel</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea 
                  v-model="editingProperty.description" 
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Describe your property..."
                ></textarea>
              </div>

              <!-- Amenities -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities (comma separated)</label>
                <input 
                  v-model="amenitiesInput" 
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="e.g., WiFi, Pool, Parking, Kitchen"
                />
              </div>

              <!-- Image URLs -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URLs (comma separated)</label>
                <textarea 
                  v-model="imagesInput" 
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                ></textarea>
              </div>

              <div class="flex gap-3 pt-4">
                <Button type="submit" variant="primary" :loading="saving" full-width>
                  {{ saving ? 'Saving...' : 'Save Property' }}
                </Button>
                <Button type="button" @click="closeEditModal" variant="outline" full-width>
                  Cancel
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
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Manage Property Photos</h2>
            <button @click="closeImageModal" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  accept="image/*"
                  multiple
                  class="hidden"
                  ref="imageInput"
                />
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-brand-500 transition-colors cursor-pointer">
                  <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p class="text-gray-600 dark:text-gray-300 font-medium mb-1">Click to upload images</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">PNG, JPG up to 10MB each</p>
                </div>
              </label>
            </div>

            <!-- Current Images -->
            <div v-if="selectedProperty?.images?.length > 0" class="grid grid-cols-3 gap-4">
              <div 
                v-for="(image, index) in selectedProperty.images" 
                :key="index"
                class="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 group"
              >
                <img :src="image" :alt="`Property image ${index + 1}`" class="w-full h-full object-cover" />
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
              <Button @click="closeImageModal" variant="primary">Done</Button>
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
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">360° Virtual Tour</h2>
            <button @click="close360Modal" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
                  accept="image/*"
                  multiple
                  class="hidden"
                  ref="tour360Input"
                />
                <div class="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-blue-50 dark:bg-blue-900/20">
                  <svg class="w-12 h-12 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <p class="text-blue-700 dark:text-blue-300 font-medium mb-1">Upload 360° panoramic images</p>
                  <p class="text-sm text-blue-600 dark:text-blue-400">Equirectangular projection images (2:1 ratio)</p>
                </div>
              </label>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p class="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> For best results, use 360° cameras or panoramic photo apps. Images should be in equirectangular format with 2:1 aspect ratio (e.g., 4096x2048px).
              </p>
            </div>

            <div class="mt-6 flex justify-end">
              <Button @click="close360Modal" variant="primary">Done</Button>
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
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">VR Content Upload</h2>
            <button @click="closeVRModal" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
                  accept="image/*,video/*"
                  multiple
                  class="hidden"
                  ref="vrInput"
                />
                <div class="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer bg-purple-50 dark:bg-purple-900/20">
                  <svg class="w-12 h-12 mx-auto text-purple-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-purple-700 dark:text-purple-300 font-medium mb-1">Upload VR content</p>
                  <p class="text-sm text-purple-600 dark:text-purple-400">360° videos, VR-ready images, or 3D models</p>
                </div>
              </label>
            </div>

            <div class="space-y-4">
              <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <p class="text-sm text-purple-800 dark:text-purple-200 font-medium mb-2">Supported VR Formats:</p>
                <ul class="text-sm text-purple-700 dark:text-purple-300 space-y-1 ml-4">
                  <li>• 360° Videos (MP4, WebM) - 4K or higher recommended</li>
                  <li>• Stereoscopic 3D images (side-by-side or top-bottom)</li>
                  <li>• 8K 360° panoramic photos for VR headsets</li>
                  <li>• VR180 content (180° field of view)</li>
                </ul>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <Button @click="closeVRModal" variant="primary">Done</Button>
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
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../services/supabase'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
import LoadingSpinner from '../../components/common/LoadingSpinner.vue'
import ToastNotification from '../../components/common/ToastNotification.vue'

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
  type: 'apartment',
  description: '',
  amenities: [],
  images: [],
  tour360: [],
  vrContent: []
})

const selectedProperty = ref(null)
const amenitiesInput = ref('')
const imagesInput = ref('')

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

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
    showToast('Failed to load properties', 'error')
  } finally {
    loading.value = false
  }
}

// Edit property
const editProperty = (property) => {
  editingProperty.value = { ...property }
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
      amenities: amenitiesInput.value.split(',').map(a => a.trim()).filter(Boolean),
      images: imagesInput.value.split(',').map(i => i.trim()).filter(Boolean),
      updated_at: new Date().toISOString()
    }

    if (propertyData.id) {
      // Update existing
      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', propertyData.id)
      
      if (error) throw error
      showToast('Property updated successfully', 'success')
    } else {
      // Create new
      const { error } = await supabase
        .from('properties')
        .insert([{ ...propertyData, created_at: new Date().toISOString() }])
      
      if (error) throw error
      showToast('Property created successfully', 'success')
    }

    closeEditModal()
    loadProperties()
  } catch (error) {
    console.error('Error saving property:', error)
    showToast('Failed to save property', 'error')
  } finally {
    saving.value = false
  }
}

// Delete property
const deleteProperty = async (id) => {
  if (!confirm('Are you sure you want to delete this property?')) return
  
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    showToast('Property deleted successfully', 'success')
    loadProperties()
  } catch (error) {
    console.error('Error deleting property:', error)
    showToast('Failed to delete property', 'error')
  }
}

// Image management
const openImageUpload = (property) => {
  selectedProperty.value = property
  showImageModal.value = true
}

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  // Here you would upload to Cloudinary or Supabase Storage
  showToast('Image upload functionality - integrate with Cloudinary/Supabase Storage', 'info')
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
      showToast('Image removed successfully', 'success')
      loadProperties()
    } catch (error) {
      console.error('Error removing image:', error)
      showToast('Failed to remove image', 'error')
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
  showToast('360° tour upload functionality - integrate with specialized VR hosting', 'info')
}

// VR Content management
const openVRUpload = (property) => {
  selectedProperty.value = property
  showVRModal.value = true
}

const handleVRUpload = async (event) => {
  const files = Array.from(event.target.files)
  showToast('VR content upload functionality - integrate with VR platform', 'info')
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
    type: 'apartment',
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
