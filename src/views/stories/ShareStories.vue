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
          <span class="text-white font-bold text-sm" style="font-family: 'Montserrat', sans-serif;">✨ {{ t('stories.communityStoriesBadge') }}</span>
        </div>
        <h1 class="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg" style="font-family: 'Montserrat', sans-serif; font-weight: 800;">
          {{ t('stories.shareYourTravelStory') }}
        </h1>
        <p class="text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed mb-10" style="font-family: 'Montserrat', sans-serif; font-weight: 500;">
          {{ t('stories.shareYourTravelStorySubtitle') }}
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
          {{ t('stories.shareYourStory') }}
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
      <div v-if="showShareForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="requestCloseShareForm">
        <Card class="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-text-brand-600">{{ t('stories.shareYourStory') }}</h2>
            <button @click="requestCloseShareForm" :disabled="mediaUploading || isSubmitting" class="text-gray-400 hover:text-gray-600 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitStory" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-text-brand-600 mb-2">{{ t('stories.form.yourNameLabel') }}</label>
              <input 
                v-model="storyForm.name"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                :placeholder="t('stories.form.yourNamePlaceholder')"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-text-brand-600 mb-2">{{ t('stories.form.storyTitleLabel') }}</label>
              <input 
                v-model="storyForm.title"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                :placeholder="t('stories.form.storyTitlePlaceholder')"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-text-brand-600 mb-2">{{ t('stories.form.locationLabel') }}</label>
              <input 
                v-model="storyForm.location"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                :placeholder="t('stories.form.locationPlaceholder')"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-text-brand-600 mb-2">{{ t('stories.form.contentLabel') }}</label>
              <textarea 
                v-model="storyForm.story"
                required
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                :placeholder="t('stories.form.shareContentPlaceholder')"
              ></textarea>
            </div>

            <div>
              <PhotoUploader
                v-model="storyPhotos"
                v-model:uploading="mediaUploading"
                title="Upload photos or videos"
                subtitle="Share your travel moments"
                :min-photos="1"
                :max-photos="10"
              />
            </div>

            <div class="flex gap-3">
              <Button type="button" variant="secondary" full-width :disabled="mediaUploading || isSubmitting" @click="requestCloseShareForm">
                {{ t('common.cancel') }}
              </Button>
              <Button type="submit" variant="primary" full-width class="bg-gradient-to-r from-teal-500 to-cyan-600" :disabled="isSubmitting || mediaUploading">
                {{ isSubmitting ? t('stories.sharing') : t('stories.shareStory') }}
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
          <h2 class="text-2xl md:text-3xl font-bold text-text-brand-600 mb-2">{{ t('stories.communityStoriesTitle') }}</h2>
          <p class="text-text-secondary">{{ t('stories.communityStoriesSubtitle') }}</p>
        </div>
        <select v-model="filterCategory" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="all">{{ t('stories.filterAll') }}</option>
          <option value="adventure">{{ t('stories.category.adventure') }}</option>
          <option value="culture">{{ t('stories.category.culture') }}</option>
          <option value="wildlife">{{ t('stories.category.wildlife') }}</option>
          <option value="relaxation">{{ t('stories.category.relaxation') }}</option>
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
            <video
              v-if="isVideoUrl(storyPrimaryMedia(story))"
              :src="storyPrimaryMedia(story)"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              muted
              playsinline
              preload="metadata"
            />
            <img
              v-else
              loading="lazy"
              :src="storyPrimaryMedia(story)"
              :alt="story.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div class="absolute top-3 left-3">
              <span class="px-3 py-1 bg-teal-500 text-white text-xs font-semibold rounded-full">
                {{ t(`stories.category.${story.category}`) }}
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
          {{ t('stories.loadMoreStories') }}
        </Button>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import PhotoUploader from '../../components/host/PhotoUploader.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
import { useToast } from '../../composables/useToast'
import api from '../../services/api'
import { useTranslation } from '@/composables/useTranslation'
const { error: showError } = useToast()

const router = useRouter()
const { t, currentLanguage } = useTranslation()

const dateLocale = computed(() => {
  const lang = currentLanguage.value
  if (lang === 'FR') return 'fr-FR'
  if (lang === 'RW') return 'rw-RW'
  if (lang === 'ZH') return 'zh-CN'
  if (lang === 'SW') return 'sw-KE'
  return 'en-US'
})
const showShareForm = ref(false)
const filterCategory = ref('all')
const isSubmitting = ref(false)
const storyPhotos = ref([])
const mediaUploading = ref(false)

const storyForm = ref({
  name: '',
  title: '',
  location: '',
  story: '',
  photos: []
})

// Watch for photo changes and update form
watch(storyPhotos, (newPhotos) => {
  storyForm.value.photos = newPhotos.map(p => p.url || p.preview).filter(Boolean)
}, { deep: true })

// Stories loaded from database
const stories = ref([])

const filteredStories = computed(() => {
  if (filterCategory.value === 'all') {
    return stories.value
  }
  return stories.value.filter(story => story.category === filterCategory.value)
})

const requestCloseShareForm = () => {
  if (mediaUploading.value) {
    alert('Please wait for your uploads to finish.')
    return
  }
  if (isSubmitting.value) return
  showShareForm.value = false
}

function storyPrimaryMedia(story) {
  return (
    story?.image ||
    story?.images?.[0] ||
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'
  )
}

function isVideoUrl(url) {
  if (!url) return false
  const u = String(url).toLowerCase()
  if (u.startsWith('data:video/')) return true
  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/.test(u)
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

  if (mediaUploading.value) {
    alert('Please wait for your uploads to finish.')
    return
  }
  
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
    
    // Add to local array for immediate display with proper reactivity
    stories.value = [{
      ...newStory,
      date: new Date().toLocaleDateString(dateLocale.value, { month: 'short', day: 'numeric', year: 'numeric' })
    }, ...stories.value]
    
    // Reset form
    storyForm.value = {
      name: '',
      title: '',
      location: '',
      story: '',
      photos: []
    }
    
    showShareForm.value = false
    alert(t('stories.shareSuccess'))
    
  } catch (error) {
    console.error('Story submission error:', error)
    showError(t('stories.shareFailed'))
  } finally {
    isSubmitting.value = false
  }
}

const viewStory = (story) => {
  // Navigate to story detail page (to be implemented)
  console.log('Viewing story:', story)
}
</script>
