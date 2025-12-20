<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 md:py-32 px-4 bg-gradient-to-br from-red-500 via-orange-500 to-pink-500">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div class="absolute top-40 right-20 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style="animation-delay: 2s"></div>
      </div>
      
      <div class="container mx-auto max-w-4xl relative z-10 text-center pt-16">
        <div class="inline-block bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full mb-6 border border-white/30">
          <span class="text-white font-bold text-sm" style="font-family: 'Montserrat', sans-serif;">✨ Community Stories</span>
        </div>
        <h1 class="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg" style="font-family: 'Montserrat', sans-serif; font-weight: 800;">
          Share Your Travel Story
        </h1>
        <p class="text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed mb-10" style="font-family: 'Montserrat', sans-serif; font-weight: 500;">
          Inspire fellow travelers by sharing your unforgettable experiences across Africa
        </p>
        <Button 
          variant="primary" 
          size="lg" 
          @click="showShareForm = true"
          class="bg-white text-red-600 hover:bg-gray-50 shadow-2xl hover:shadow-3xl transition-all font-semibold px-8 py-4 rounded-full"
          style="font-family: 'Montserrat', sans-serif;"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Share Your Story
        </Button>
      </div>
    </section>

    <!-- Share Story Form Modal -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="showShareForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showShareForm = false">
        <Card class="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-text-brand-600">Share Your Story</h2>
            <button @click="showShareForm = false" class="text-gray-400 hover:text-gray-600 text-gray-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitStory" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-text-brand-600 mb-2">Your Name</label>
              <input 
                v-model="storyForm.name"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-text-brand-600 mb-2">Story Title</label>
              <input 
                v-model="storyForm.title"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Give your story a catchy title"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-text-brand-600 mb-2">Location</label>
              <input 
                v-model="storyForm.location"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Where did this happen?"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-text-brand-600 mb-2">Your Story</label>
              <textarea 
                v-model="storyForm.story"
                required
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Tell us about your amazing experience..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-text-brand-600 mb-2">Upload Photos</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer">
                <input type="file" accept="image/*" multiple class="hidden" id="photo-upload" @change="handlePhotoUpload" />
                <label for="photo-upload" class="cursor-pointer">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-sm text-gray-600">Click to upload photos or drag and drop</p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                </label>
              </div>
              <div v-if="storyForm.photos.length > 0" class="mt-3 flex flex-wrap gap-2">
                <div v-for="(photo, index) in storyForm.photos" :key="index" class="relative">
                  <img loading="lazy" :src="photo" class="w-20 h-20 object-cover rounded-lg" />
                  <button 
                    type="button"
                    @click="removePhoto(index)"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <Button type="button" variant="secondary" full-width @click="showShareForm = false">
                Cancel
              </Button>
              <Button type="submit" variant="primary" full-width class="bg-gradient-to-r from-teal-500 to-cyan-600" :disabled="isSubmitting">
                {{ isSubmitting ? 'Sharing...' : 'Share Story' }}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </transition>

    <!-- Stories Grid -->
    <section class="container mx-auto px-4 lg:px-8 py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-text-brand-600 mb-2">Community Stories</h2>
          <p class="text-text-secondary">Real experiences from real travelers</p>
        </div>
        <select v-model="filterCategory" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="all">All Stories</option>
          <option value="adventure">Adventure</option>
          <option value="culture">Culture</option>
          <option value="wildlife">Wildlife</option>
          <option value="relaxation">Relaxation</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="story in filteredStories" 
          :key="story.id"
          hover
          clickable
          @click="viewStory(story)"
          class="overflow-hidden group"
        >
          <div class="relative h-56 overflow-hidden">
            <img loading="lazy" :src="story.image" :alt="story.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div class="absolute top-3 left-3">
              <span class="px-3 py-1 bg-teal-500 text-white text-xs font-semibold rounded-full">
                {{ story.category }}
              </span>
            </div>
            <div class="absolute bottom-3 left-3 right-3">
              <h3 class="text-white font-bold text-lg mb-1 line-clamp-2">{{ story.title }}</h3>
              <p class="text-white/90 text-sm flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {{ story.location }}
              </p>
            </div>
          </div>
          <div class="p-5">
            <p class="text-text-secondary text-sm mb-4 line-clamp-3">{{ story.excerpt }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {{ story.author.charAt(0) }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-semibold text-text-brand-600">{{ story.author }}</p>
                  <p class="text-xs text-text-muted">{{ story.date }}</p>
                </div>
              </div>
              <div class="flex items-center text-text-muted text-sm">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>
                {{ story.views }}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Load More -->
      <div class="text-center mt-12">
        <Button variant="secondary" size="lg">
          Load More Stories
        </Button>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
import { uploadToCloudinary } from '@/services/cloudinary'
import api from '../../services/api'

const router = useRouter()
const showShareForm = ref(false)
const filterCategory = ref('all')
const isSubmitting = ref(false)

const storyForm = ref({
  name: '',
  title: '',
  location: '',
  story: '',
  photos: []
})

// Stories loaded from database
const stories = ref([])

const filteredStories = computed(() => {
  if (filterCategory.value === 'all') {
    return stories.value
  }
  return stories.value.filter(story => story.category === filterCategory.value)
})

const handlePhotoUpload = async (event) => {
  const files = event.target.files
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) {
      try {
        const result = await uploadToCloudinary(file, { folder: 'merry360x/stories' })
        storyForm.value.photos.push(result.secure_url)
      } catch (err) {
        console.warn('Cloudinary upload failed, falling back to base64', err.message)
        const reader = new FileReader()
        reader.onload = (e) => {
          storyForm.value.photos.push(e.target.result)
        }
        reader.readAsDataURL(file)
      }
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        storyForm.value.photos.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
}

const removePhoto = (index) => {
  storyForm.value.photos.splice(index, 1)
}

// Load stories from database on mount
onMounted(async () => {
  try {
    const data = await api.stories.getAll()
    stories.value = data
  } catch (error) {
    console.warn('Failed to load stories:', error)
    // Stories will remain empty array if table doesn't exist yet
  }
})

const submitStory = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Create story in database
    const storyData = {
      title: storyForm.value.title,
      content: storyForm.value.story,
      excerpt: storyForm.value.story.substring(0, 150) + '...',
      location: storyForm.value.location,
      author: storyForm.value.name,
      images: storyForm.value.photos,
      image: storyForm.value.photos[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
      category: 'adventure'
    }
    
    const newStory = await api.stories.create(storyData)
    
    // Add to local array for immediate display
    stories.value.unshift({
      ...newStory,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    })
    
    // Reset form
    storyForm.value = {
      name: '',
      title: '',
      location: '',
      story: '',
      photos: []
    }
    
    showShareForm.value = false
    alert('Your story has been shared successfully!')
    
  } catch (error) {
    console.error('Story submission error:', error)
    alert('Failed to share your story. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const viewStory = (story) => {
  // Navigate to story detail page (to be implemented)
  console.log('Viewing story:', story)
}
</script>
