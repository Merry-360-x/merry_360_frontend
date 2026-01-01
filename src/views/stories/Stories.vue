<template>
  <MainLayout>
    <!-- Stories Header -->
    <section class="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-purple-900 dark:via-pink-800 dark:to-orange-700 py-12 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold mb-3 text-white">Travel Stories</h1>
          <p class="text-base md:text-lg text-white/90">Share your adventures and discover amazing experiences from fellow travelers</p>
        </div>
        
        <!-- Add Story Button -->
        <div class="flex justify-center">
          <button 
            @click="openCreateStory"
            class="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Share Your Story
          </button>
        </div>
      </div>
    </section>

    <!-- Stories Grid -->
    <section class="py-12 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">Loading stories...</p>
        </div>

        <!-- Stories Grid -->
        <div v-else-if="stories.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <div
            v-for="story in stories"
            :key="story.id"
            @click="openStory(story)"
            class="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <!-- Story Image -->
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
              :src="storyPrimaryMedia(story)"
              :alt="story.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70"></div>
            
            <!-- User Info -->
            <div class="absolute top-4 left-4 right-4 flex items-center gap-2">
              <div class="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-brand-500 flex-shrink-0">
                <img
                  v-if="story.user_avatar"
                  :src="story.user_avatar"
                  :alt="story.author"
                  class="w-full h-full object-cover"
                />
                <span v-else class="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                  {{ (story.author || 'U').charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white font-semibold text-sm truncate">{{ story.author || 'Anonymous' }}</p>
                <p class="text-white/80 text-xs">{{ formatTimeAgo(story.created_at) }}</p>
              </div>
            </div>

            <!-- Story Info -->
            <div class="absolute bottom-4 left-4 right-4">
              <p class="text-white font-semibold text-sm mb-2 line-clamp-2">{{ story.title }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <svg class="w-3 h-3 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-xs font-semibold text-gray-800 truncate">{{ story.location || 'Unknown' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1 text-white">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-xs">{{ story.likes_count || 0 }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span class="text-xs">{{ story.comments_count || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No stories yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Be the first to share your travel experience!</p>
          <button 
            @click="openCreateStory"
            class="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full transition-colors"
          >
            Share Your Story
          </button>
        </div>
      </div>
    </section>

    <!-- Create Story Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Share Your Story</h2>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="createStory" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
            <input 
              v-model="newStory.title"
              type="text" 
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Give your story a title"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
            <input 
              v-model="newStory.location"
              type="text" 
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Where did this happen?"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Story *</label>
            <textarea 
              v-model="newStory.content"
              required
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Share your experience..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo</label>
            <div 
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-brand-500 transition-colors"
              @click="$refs.storyImageInput.click()"
            >
              <input 
                ref="storyImageInput"
                type="file" 
                accept="image/*,video/*" 
                class="hidden" 
                @change="handleStoryImage"
              />
              <div v-if="newStory.imagePreview">
                <video
                  v-if="newStory.mediaType === 'video'"
                  :src="newStory.imagePreview"
                  class="w-full h-40 object-cover rounded-lg mb-2"
                  muted
                  playsinline
                  preload="metadata"
                />
                <img v-else :src="newStory.imagePreview" class="w-full h-40 object-cover rounded-lg mb-2" />
                <p class="text-sm text-gray-500 dark:text-gray-400">Click to change image</p>
              </div>
              <div v-else>
                <svg class="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-sm text-gray-600 dark:text-gray-400">Click to upload a photo or video</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button 
              type="button"
              @click="showCreateModal = false"
              class="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="creating"
              class="flex-1 px-4 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {{ creating ? 'Sharing...' : 'Share Story' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Story Viewer Modal -->
    <div v-if="activeStory" class="fixed inset-0 z-50 bg-black" @click="closeStory">
      <div class="h-full max-w-lg mx-auto relative" @click.stop>
        <!-- Story Content -->
        <div class="relative h-full">
          <video
            v-if="isVideoUrl(storyPrimaryMedia(activeStory))"
            :src="storyPrimaryMedia(activeStory)"
            class="w-full h-full object-cover"
            muted
            playsinline
            preload="metadata"
            controls
          />
          <img
            v-else
            :src="storyPrimaryMedia(activeStory)"
            :alt="activeStory.title"
            class="w-full h-full object-cover"
          />
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>

          <!-- Top Right Actions -->
          <div class="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              v-if="activeStory && canDeleteStory(activeStory)"
              @click="deleteStory(activeStory)"
              :disabled="deletingStoryId === activeStory.id"
              class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-50"
              title="Delete story"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </button>

            <button
              @click="closeStory"
              class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              title="Close"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- User Header -->
          <div class="absolute top-4 left-4 right-16 flex items-center gap-3 z-10">
            <div class="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-brand-500">
              <img
                v-if="activeStory.user_avatar"
                :src="activeStory.user_avatar"
                :alt="activeStory.author"
                class="w-full h-full object-cover"
              />
              <span v-else class="w-full h-full flex items-center justify-center text-white font-bold">
                {{ (activeStory.author || 'U').charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <p class="text-white font-semibold">{{ activeStory.author || 'Anonymous' }}</p>
              <p class="text-white/80 text-sm">{{ activeStory.location }} • {{ formatTimeAgo(activeStory.created_at) }}</p>
            </div>
          </div>

          <!-- Story Content -->
          <div class="absolute bottom-32 left-4 right-4 z-10">
            <h3 class="text-white text-xl font-bold mb-2">{{ activeStory.title }}</h3>
            <p class="text-white/90 text-sm line-clamp-3">{{ activeStory.content }}</p>
          </div>

          <!-- Engagement Actions -->
          <div class="absolute bottom-4 left-4 right-4 z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-6">
                <!-- Like Button -->
                <button 
                  @click="toggleLike(activeStory)"
                  class="flex items-center gap-2 text-white hover:scale-110 transition-transform"
                >
                  <svg 
                    class="w-7 h-7" 
                    :class="activeStory.isLiked ? 'text-red-500 fill-current' : ''"
                    :fill="activeStory.isLiked ? 'currentColor' : 'none'" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <span>{{ activeStory.likes_count || 0 }}</span>
                </button>

                <!-- Comment Button -->
                <button 
                  @click="showComments = !showComments"
                  class="flex items-center gap-2 text-white hover:scale-110 transition-transform"
                >
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <span>{{ activeStory.comments_count || 0 }}</span>
                </button>
              </div>
            </div>

            <!-- Comments Section -->
            <div v-if="showComments" class="bg-black/60 backdrop-blur-md rounded-xl p-4 max-h-60 overflow-y-auto">
              <h4 class="text-white font-semibold mb-3">Comments</h4>
              
              <!-- Comment Input -->
              <div class="flex gap-2 mb-4">
                <input 
                  v-model="newComment"
                  type="text" 
                  :placeholder="userStore.isAuthenticated ? 'Add a comment...' : 'Login to comment'"
                  class="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  :disabled="!userStore.isAuthenticated"
                  @keyup.enter="addComment"
                />
                <button 
                  @click="addComment"
                  :disabled="!userStore.isAuthenticated || !newComment.trim() || addingComment"
                  class="px-4 py-2 bg-brand-500 text-white rounded-full disabled:opacity-50"
                >
                  Post
                </button>
              </div>

              <!-- Comments List -->
              <div v-if="storyComments.length > 0" class="space-y-3">
                <div v-for="comment in storyComments" :key="comment.id" class="flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-brand-500 flex-shrink-0 flex items-center justify-center">
                    <span class="text-white text-xs font-bold">{{ (comment.author || 'U').charAt(0).toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="text-white/90 text-sm">
                      <span class="font-semibold">{{ comment.author || 'Anonymous' }}</span>
                      {{ comment.content }}
                    </p>
                    <p class="text-white/50 text-xs mt-1">{{ formatTimeAgo(comment.created_at) }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-white/60 text-sm text-center py-4">No comments yet. Be the first!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase } from '../../services/supabase'
import { uploadToCloudinary } from '../../services/cloudinary'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()

const loading = ref(true)
const stories = ref([])
const activeStory = ref(null)
const showCreateModal = ref(false)
const showComments = ref(false)
const creating = ref(false)
const storyComments = ref([])
const newComment = ref('')
const addingComment = ref(false)
const uploadingMedia = ref(false)
const deletingStoryId = ref(null)

const newStory = ref({
  title: '',
  location: '',
  content: '',
  image: null,
  imagePreview: null,
  mediaType: 'image'
})

onMounted(async () => {
  await loadStories()
})

async function loadStories() {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('stories')
      .select('*, story_likes(count), story_comments(count)')
      .gte('created_at', since)
      .order('created_at', { ascending: false })

    if (error) {
      // Table might not exist yet
      console.warn('Stories table not found, will show empty state')
      stories.value = []
    } else {
      // Process stories with counts
      stories.value = (data || []).map(story => ({
        // Support both embedded relation names and legacy aliased names.
        ...story,
        likes_count: (story.story_likes || story.likes)?.[0]?.count || 0,
        comments_count: (story.story_comments || story.comments)?.[0]?.count || 0
      }))

      // Check which stories user has liked
      if (userStore.user?.id) {
        const { data: userLikes } = await supabase
          .from('story_likes')
          .select('story_id')
          .eq('user_id', userStore.user.id)

        const likedIds = new Set((userLikes || []).map(l => l.story_id))
        stories.value = stories.value.map(s => ({ ...s, isLiked: likedIds.has(s.id) }))
      }
    }
  } catch (error) {
    console.error('Error loading stories:', error)
    stories.value = []
  } finally {
    loading.value = false
  }
}

function openCreateStory() {
  if (!userStore.isAuthenticated) {
    alert('Please login to share your story')
    return
  }
  showCreateModal.value = true
}

async function handleStoryImage(event) {
  const file = event.target.files[0]
  if (!file) return

  uploadingMedia.value = true
  newStory.value.mediaType = file.type?.startsWith('video/') ? 'video' : 'image'

  try {
    // Show preview
    // Use an object URL for videos to avoid huge base64 strings.
    if (newStory.value.mediaType === 'video') {
      newStory.value.imagePreview = URL.createObjectURL(file)
    } else {
      const preview = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
      newStory.value.imagePreview = preview
    }

    // Upload to Cloudinary if configured
    if (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) {
      const result = await uploadToCloudinary(file, { folder: 'merry360x/stories' })
      newStory.value.image = result.secure_url
    } else {
      // Without Cloudinary, videos cannot be stored reliably (object URLs won't work for others).
      if (newStory.value.mediaType === 'video') {
        alert('Video uploads require Cloudinary configuration. Please upload an image instead.')
        newStory.value.image = null
        newStory.value.imagePreview = null
        newStory.value.mediaType = 'image'
      } else {
        newStory.value.image = newStory.value.imagePreview
      }
    }
  } catch (error) {
    console.error('Upload error:', error)
    // Best-effort fallback for images
    if (newStory.value.mediaType !== 'video') {
      newStory.value.image = newStory.value.imagePreview
    }
  } finally {
    uploadingMedia.value = false
  }
}

function storyPrimaryMedia(story) {
  return (
    story?.image ||
    story?.images?.[0] ||
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'
  )
}

function isVideoUrl(url) {
  if (!url) return false
  const u = String(url).toLowerCase()
  if (u.startsWith('data:video/')) return true
  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/.test(u)
}

function canDeleteStory(story) {
  if (!story) return false
  if (!userStore.isAuthenticated) return false
  if (userStore.isAdmin) return true
  return Boolean(userStore.user?.id) && story.user_id === userStore.user.id
}

async function deleteStory(story) {
  if (!story) return
  if (!canDeleteStory(story)) {
    alert('You can only delete your own story')
    return
  }

  const ok = confirm('Delete this story? This cannot be undone.')
  if (!ok) return

  deletingStoryId.value = story.id

  try {
    // Best-effort: some schemas have FKs without cascade.
    // Try delete story first, then clean up likes/comments and retry if needed.

    let baseDelete = supabase
      .from('stories')
      .delete()
      .eq('id', story.id)

    if (!userStore.isAdmin) {
      baseDelete = baseDelete.eq('user_id', userStore.user.id)
    }

    const { error: deleteError } = await baseDelete

    if (deleteError) {
      await supabase.from('story_likes').delete().eq('story_id', story.id)
      await supabase.from('story_comments').delete().eq('story_id', story.id)

      let retryDelete = supabase
        .from('stories')
        .delete()
        .eq('id', story.id)

      if (!userStore.isAdmin) {
        retryDelete = retryDelete.eq('user_id', userStore.user.id)
      }

      const { error: retryError } = await retryDelete
      if (retryError) throw retryError
    }

    stories.value = stories.value.filter(s => s.id !== story.id)
    if (activeStory.value?.id === story.id) {
      closeStory()
    }
  } catch (error) {
    console.error('Error deleting story:', error)
    alert('Failed to delete story. Please try again.')
  } finally {
    deletingStoryId.value = null
  }
}

async function createStory() {
  if (!newStory.value.title || !newStory.value.content) {
    alert('Please fill in all required fields')
    return
  }

  if (uploadingMedia.value) {
    alert('Please wait for your media to finish uploading')
    return
  }

  creating.value = true

  try {
    const storyData = {
      title: newStory.value.title,
      location: newStory.value.location,
      content: newStory.value.content,
      image: newStory.value.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
      images: newStory.value.image ? [newStory.value.image] : [],
      author: userStore.user?.name || `${userStore.user?.firstName || ''} ${userStore.user?.lastName || ''}`.trim() || 'Anonymous',
      user_id: userStore.user?.id,
      user_avatar: userStore.user?.avatar_url || null
    }

    const { data, error } = await supabase
      .from('stories')
      .insert([storyData])
      .select()
      .single()

    if (error) throw error

    // Add to local list
    stories.value.unshift({
      ...data,
      likes_count: 0,
      comments_count: 0,
      isLiked: false
    })

    // Reset form
    newStory.value = { title: '', location: '', content: '', image: null, imagePreview: null, mediaType: 'image' }
    showCreateModal.value = false

  } catch (error) {
    console.error('Error creating story:', error)
    alert('Failed to share story. Please try again.')
  } finally {
    creating.value = false
  }
}

async function openStory(story) {
  activeStory.value = story
  showComments.value = false
  await loadComments(story.id)
}

function closeStory() {
  activeStory.value = null
  showComments.value = false
  storyComments.value = []
}

async function loadComments(storyId) {
  try {
    const { data, error } = await supabase
      .from('story_comments')
      .select('*')
      .eq('story_id', storyId)
      .order('created_at', { ascending: false })

    if (!error) {
      storyComments.value = data || []
    }
  } catch (error) {
    console.error('Error loading comments:', error)
  }
}

async function toggleLike(story) {
  if (!userStore.isAuthenticated) {
    alert('Please login to like stories')
    return
  }

  try {
    if (story.isLiked) {
      // Unlike
      const { error } = await supabase
        .from('story_likes')
        .delete()
        .eq('story_id', story.id)
        .eq('user_id', userStore.user.id)

      if (error) throw error

      story.isLiked = false
      story.likes_count = Math.max(0, (story.likes_count || 1) - 1)
    } else {
      // Like
      const { error } = await supabase
        .from('story_likes')
        .upsert(
          [{ story_id: story.id, user_id: userStore.user.id }],
          { onConflict: 'story_id,user_id', ignoreDuplicates: true }
        )

      if (error) throw error

      story.isLiked = true
      story.likes_count = (story.likes_count || 0) + 1
    }

    // Update in stories array
    const idx = stories.value.findIndex(s => s.id === story.id)
    if (idx !== -1) {
      stories.value[idx] = { ...story }
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    alert('Failed to update like. Please try again.')
  }
}

async function addComment() {
  if (!newComment.value.trim() || !userStore.isAuthenticated) {
    if (!userStore.isAuthenticated) alert('Please login to comment')
    return
  }

  addingComment.value = true

  try {
    const commentData = {
      story_id: activeStory.value.id,
      user_id: userStore.user.id,
      author: userStore.user?.name || `${userStore.user?.firstName || ''} ${userStore.user?.lastName || ''}`.trim() || 'Anonymous',
      content: newComment.value.trim()
    }

    const { data, error } = await supabase
      .from('story_comments')
      .insert([commentData])
      .select()
      .single()

    if (error) throw error

    storyComments.value.unshift(data)
    activeStory.value.comments_count = (activeStory.value.comments_count || 0) + 1
    newComment.value = ''

    // Update in stories array
    const idx = stories.value.findIndex(s => s.id === activeStory.value.id)
    if (idx !== -1) {
      stories.value[idx].comments_count = activeStory.value.comments_count
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    alert('Failed to add comment. Please try again.')
  } finally {
    addingComment.value = false
  }
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return 'just now'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}
</script>
