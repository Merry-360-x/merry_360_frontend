<template>
  <MainLayout>
    <!-- Stories Header -->
    <section class="bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white">{{ t('stories.title') }}</h1>
          <p class="text-base md:text-lg text-gray-600 dark:text-gray-300">{{ t('stories.subtitle') }}</p>
        </div>
      </div>
    </section>

    <!-- Stories Grid -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <div
            v-for="story in stories"
            :key="story.id"
            @click="openStory(story)"
            class="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <!-- Story Image -->
            <img
              :src="story.thumbnail"
              :alt="story.userName"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
            
            <!-- User Info -->
            <div class="absolute top-4 left-4 right-4 flex items-center gap-2">
              <div class="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-brand-500 flex-shrink-0">
                <img
                  v-if="story.userAvatar"
                  :src="story.userAvatar"
                  :alt="story.userName"
                  class="w-full h-full object-cover"
                />
                <span v-else class="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                  {{ story.userName.charAt(0) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white font-semibold text-sm truncate">{{ story.userName }}</p>
                <p class="text-white/80 text-xs">{{ story.timeAgo }}</p>
              </div>
            </div>

            <!-- Location Badge -->
            <div class="absolute bottom-4 left-4 right-4">
              <div class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <svg class="w-3 h-3 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-xs font-semibold text-gray-800 truncate">{{ story.location }}</span>
              </div>
            </div>

            <!-- Unviewed Indicator -->
            <div
              v-if="!story.viewed"
              class="absolute inset-0 rounded-2xl border-3 border-brand-500 pointer-events-none"
            ></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="stories.length === 0" class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('stories.noStories') }}</h3>
          <p class="text-gray-600">{{ t('stories.subtitle') }}</p>
        </div>
      </div>
    </section>

    <!-- Story Viewer Modal -->
    <transition name="modal">
      <div
        v-if="activeStory"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black"
        @click="closeStory"
      >
        <div class="relative w-full h-full max-w-md mx-auto" @click.stop>
          <!-- Story Content -->
          <div class="relative w-full h-full">
            <img
              :src="activeStory.image"
              :alt="activeStory.userName"
              class="w-full h-full object-contain"
            />
            
            <!-- Progress Bars -->
            <div class="absolute top-0 left-0 right-0 flex gap-1 p-4">
              <div class="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div class="h-full bg-white rounded-full transition-all duration-300" :style="{ width: '100%' }"></div>
              </div>
            </div>

            <!-- User Header -->
            <div class="absolute top-8 left-4 right-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-brand-500">
                  <img
                    v-if="activeStory.userAvatar"
                    :src="activeStory.userAvatar"
                    :alt="activeStory.userName"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                    {{ activeStory.userName.charAt(0) }}
                  </span>
                </div>
                <div>
                  <p class="text-white font-semibold text-sm">{{ activeStory.userName }}</p>
                  <p class="text-white/80 text-xs">{{ activeStory.timeAgo }}</p>
                </div>
              </div>
              <button
                @click="closeStory"
                class="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 transition-colors"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Story Caption -->
            <div v-if="activeStory.caption" class="absolute bottom-20 left-4 right-4">
              <div class="bg-black/40 backdrop-blur-sm rounded-2xl px-4 py-3">
                <p class="text-white text-sm">{{ activeStory.caption }}</p>
              </div>
            </div>

            <!-- Navigation -->
            <button
              @click="previousStory"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 transition-colors"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              @click="nextStory"
              class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 transition-colors"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useTranslation } from '../../composables/useTranslation'
import MainLayout from '../../components/layout/MainLayout.vue'

const { t } = useTranslation()
const activeStory = ref(null)
const currentStoryIndex = ref(0)

const stories = ref([
  {
    id: 1,
    userName: 'Sarah Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    location: 'Kigali, Rwanda',
    caption: 'Amazing stay at this beautiful hotel! The view is breathtaking 🌅',
    timeAgo: '2h ago',
    viewed: false
  },
  {
    id: 2,
    userName: 'Michael Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    thumbnail: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    location: 'Musanze, Rwanda',
    caption: 'Gorilla trekking adventure of a lifetime! 🦍',
    timeAgo: '5h ago',
    viewed: false
  },
  {
    id: 3,
    userName: 'Emma Wilson',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    thumbnail: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    location: 'Lake Kivu, Rwanda',
    caption: 'Sunset by the lake is pure magic ✨',
    timeAgo: '8h ago',
    viewed: false
  },
  {
    id: 4,
    userName: 'James Miller',
    userAvatar: 'https://i.pravatar.cc/150?img=8',
    thumbnail: 'https://images.unsplash.com/photo-1587899897387-091ebd01a6b2?w=400&q=80',
    image: 'https://images.unsplash.com/photo-1587899897387-091ebd01a6b2?w=800&q=80',
    location: 'Akagera National Park',
    caption: 'Safari experience was incredible! Saw the Big 5 🦁',
    timeAgo: '12h ago',
    viewed: false
  },
  {
    id: 5,
    userName: 'Sophie Anderson',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    thumbnail: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=80',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
    location: 'Kigali, Rwanda',
    caption: 'Trying local Rwandan cuisine - absolutely delicious! 🍽️',
    timeAgo: '1d ago',
    viewed: false
  },
  {
    id: 6,
    userName: 'David Brown',
    userAvatar: 'https://i.pravatar.cc/150?img=13',
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80&crop=bottom',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&crop=bottom',
    location: 'Nyungwe Forest',
    caption: 'Canopy walk through the rainforest 🌳',
    timeAgo: '1d ago',
    viewed: true
  }
])

const openStory = (story) => {
  activeStory.value = story
  currentStoryIndex.value = stories.value.findIndex(s => s.id === story.id)
  story.viewed = true
}

const closeStory = () => {
  activeStory.value = null
}

const nextStory = () => {
  const nextIndex = (currentStoryIndex.value + 1) % stories.value.length
  currentStoryIndex.value = nextIndex
  activeStory.value = stories.value[nextIndex]
  stories.value[nextIndex].viewed = true
}

const previousStory = () => {
  const prevIndex = currentStoryIndex.value === 0 ? stories.value.length - 1 : currentStoryIndex.value - 1
  currentStoryIndex.value = prevIndex
  activeStory.value = stories.value[prevIndex]
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
