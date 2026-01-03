<template>
  <MainLayout>
    <!-- Stories Header -->
    <section class="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 dark:from-brand-800 dark:via-brand-900 dark:to-gray-900 py-8 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-white">{{ t('stories.travelStoriesTitle') }}</h1>
        
        <!-- Instagram-style Stories Carousel -->
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <!-- Add Your Story -->
          <button 
            @click="openCreateStory"
            class="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 p-0.5 shadow-lg">
              <div class="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
            </div>
            <span class="text-white text-xs font-medium">{{ t('stories.addStory') }}</span>
          </button>

          <!-- User Stories -->
          <div
            v-for="userStory in groupedStories"
            :key="userStory.userId"
            @click="openUserStories(userStory)"
            class="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
          >
            <div class="relative">
              <!-- Story Ring with Segments -->
              <svg class="w-20 h-20 absolute -inset-0.5 -rotate-90" viewBox="0 0 100 100">
                <circle 
                  v-for="(story, index) in userStory.stories"
                  :key="story.id"
                  cx="50" 
                  cy="50" 
                  r="48"
                  fill="none"
                  :stroke="story.viewed ? '#9CA3AF' : 'url(#gradient)'"
                  stroke-width="3"
                  :stroke-dasharray="`${segmentLength(userStory.stories.length)} ${circleCircumference - segmentLength(userStory.stories.length)}`"
                  :stroke-dashoffset="segmentOffset(index, userStory.stories.length)"
                  stroke-linecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
              
              <!-- Profile Picture -->
              <div class="w-20 h-20 rounded-full overflow-hidden bg-brand-500 border-2 border-white group-hover:scale-105 transition-transform">
                <img
                  v-if="userStory.avatar"
                  :src="userStory.avatar"
                  :alt="userStory.author"
                  class="w-full h-full object-cover"
                />
                <span v-else class="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                  {{ (userStory.author || 'U').charAt(0).toUpperCase() }}
                </span>
              </div>
              
              <!-- Story Count Badge -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                {{ userStory.stories.length }}
              </div>
            </div>
            <span class="text-white text-xs font-medium truncate max-w-[80px]">{{ userStory.author }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Stories Section -->
    <section class="py-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">{{ t('stories.loadingStories') }}</p>
        </div>

        <!-- Stories Grid -->
        <div v-else-if="stories.length > 0">
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ t('stories.recentStories') }}</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                <p class="text-white font-semibold text-sm truncate">{{ story.author || t('common.anonymous') }}</p>
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
                  <span class="text-xs font-semibold text-gray-800 truncate">{{ story.location || t('common.unknown') }}</span>
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
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('stories.noStories') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ t('stories.noStoriesDesc') }}</p>
          <button 
            @click="openCreateStory"
            class="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full transition-colors"
          >
            {{ t('stories.shareYourStory') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Create / Edit Story Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ isEditing ? t('stories.editStory') : t('stories.shareYourStory') }}</h2>
            <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="createStory" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('stories.form.titleLabel') }} *</label>
            <input 
              v-model="newStory.title"
              type="text" 
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              :placeholder="t('stories.form.titlePlaceholder')"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('stories.form.locationLabel') }} *</label>
            <input 
              v-model="newStory.location"
              type="text" 
              required
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              :placeholder="t('stories.form.locationPlaceholder')"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('stories.form.contentLabel') }} *</label>
            <textarea 
              v-model="newStory.content"
              required
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              :placeholder="t('stories.form.contentPlaceholder')"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('stories.form.mediaLabel') }}</label>
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
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('stories.clickToChangeMedia') }}</p>
              </div>
              <div v-else>
                <svg class="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('stories.clickToUploadMedia') }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button 
              type="button"
              @click="showCreateModal = false"
              class="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
            >
              {{ t('common.cancel') }}
            </button>
            <button 
              type="submit"
              :disabled="creating || uploadingMedia"
              class="flex-1 px-4 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {{ creating ? (isEditing ? t('stories.saving') : t('stories.sharing')) : (isEditing ? t('common.saveChanges') : t('stories.shareStory')) }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Instagram-Style Story Viewer Modal -->
    <div v-if="activeUserStories" class="fixed inset-0 z-50 bg-black" @click="closeStoryViewer">
      <div class="h-full max-w-lg mx-auto relative" @click.stop>
        <!-- Progress Bars -->
        <div class="absolute top-2 left-2 right-2 z-30 flex gap-1">
          <div
            v-for="(story, index) in activeUserStories.stories"
            :key="story.id"
            class="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
          >
            <div 
              class="h-full bg-white transition-all duration-300"
              :style="{ width: getProgressWidth(index) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Story Content -->
        <div class="relative h-full" v-if="currentStory">
          <video
            v-if="isVideoUrl(storyPrimaryMedia(currentStory))"
            ref="storyVideo"
            :src="storyPrimaryMedia(currentStory)"
            class="w-full h-full object-contain bg-black"
            playsinline
            @ended="nextStory"
            @loadedmetadata="onMediaLoaded"
          />
          <img
            v-else
            :src="storyPrimaryMedia(currentStory)"
            :alt="currentStory.title"
            class="w-full h-full object-contain bg-black"
            @load="onMediaLoaded"
          />

          <!-- Navigation Areas -->
          <div class="absolute inset-0 flex">
            <div class="w-1/3 h-full cursor-pointer" @click="previousStory"></div>
            <div class="w-1/3 h-full cursor-pointer" @click="togglePause"></div>
            <div class="w-1/3 h-full cursor-pointer" @click="nextStory"></div>
          </div>
          
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none"></div>

          <!-- User Header -->
          <div class="absolute top-12 left-4 right-16 flex items-center gap-3 z-20 pointer-events-none">
            <div class="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-brand-500 flex-shrink-0">
              <img
                v-if="activeUserStories.avatar"
                :src="activeUserStories.avatar"
                :alt="activeUserStories.author"
                class="w-full h-full object-cover"
              />
              <span v-else class="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                {{ (activeUserStories.author || 'U').charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold text-sm">{{ activeUserStories.author }}</p>
              <p class="text-white/80 text-xs">{{ formatTimeAgo(currentStory.created_at) }}</p>
            </div>
          </div>

          <!-- Close Button -->
          <button
            @click.stop="closeStoryViewer"
            class="absolute top-12 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors z-20 pointer-events-auto"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Story Content Info -->
          <div class="absolute bottom-24 left-4 right-4 z-20 pointer-events-none">
            <h3 class="text-white text-lg font-bold mb-1">{{ currentStory.title }}</h3>
            <p class="text-white/90 text-sm line-clamp-2">{{ currentStory.content }}</p>
            <div class="flex items-center gap-2 mt-2">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-white text-sm">{{ currentStory.location }}</span>
            </div>
          </div>

          <!-- Engagement Actions -->
          <div class="absolute bottom-6 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
            <div class="flex items-center gap-6">
              <!-- Like Button -->
              <button 
                @click.stop="toggleLike(currentStory)"
                class="flex items-center gap-2 text-white hover:scale-110 transition-transform"
              >
                <svg 
                  class="w-7 h-7" 
                  :class="currentStory.isLiked ? 'text-red-500 fill-current' : ''"
                  :fill="currentStory.isLiked ? 'currentColor' : 'none'" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span class="text-sm font-semibold">{{ currentStory.likes_count || 0 }}</span>
              </button>

              <!-- Comment Button -->
              <button 
                @click.stop="showComments = !showComments"
                class="flex items-center gap-2 text-white hover:scale-110 transition-transform"
              >
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span class="text-sm font-semibold">{{ currentStory.comments_count || 0 }}</span>
              </button>
            </div>

            <!-- Edit/Delete Actions (if own story) -->
            <div v-if="canEditStory(currentStory)" class="flex items-center gap-2">
              <button
                @click.stop="startEditStory(currentStory)"
                class="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click.stop="deleteStory(currentStory)"
                :disabled="deletingStoryId === currentStory.id"
                class="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-50"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Story Viewer Modal (OLD - keeping for fallback) -->
    <div v-if="activeStory && !activeUserStories" class="fixed inset-0 z-50 bg-black" @click="closeStory">
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
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>

          <!-- Top Right Actions -->
          <div class="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              v-if="activeStory && canEditStory(activeStory)"
              @click.stop.prevent="startEditStory(activeStory)"
              class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              :title="t('stories.editStory')"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>

            <button
              v-if="activeStory && canDeleteStory(activeStory)"
              @click.stop.prevent="deleteStory(activeStory)"
              :disabled="deletingStoryId === activeStory.id"
              class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-50"
              :title="t('stories.deleteStory')"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </button>

            <button
              @click.stop.prevent="closeStory"
              class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              :title="t('common.close')"
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
              <p class="text-white font-semibold">{{ activeStory.author || t('common.anonymous') }}</p>
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
              <h4 class="text-white font-semibold mb-3">{{ t('stories.comments') }}</h4>
              
              <!-- Comment Input -->
              <div class="flex gap-2 mb-4">
                <input 
                  v-model="newComment"
                  type="text" 
                  :placeholder="userStore.isAuthenticated ? t('stories.addCommentPlaceholder') : t('stories.loginToCommentPlaceholder')"
                  class="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  :disabled="!userStore.isAuthenticated"
                  @keyup.enter="addComment"
                />
                <button 
                  @click="addComment"
                  :disabled="!userStore.isAuthenticated || !newComment.trim() || addingComment"
                  class="px-4 py-2 bg-brand-500 text-white rounded-full disabled:opacity-50"
                >
                  {{ t('common.post') }}
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
              <p v-else class="text-white/60 text-sm text-center py-4">{{ t('stories.noComments') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch, nextTick } from 'vue'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase } from '../../services/supabase'
import { uploadToCloudinary } from '../../services/cloudinary'
import { useUserStore } from '../../stores/userStore'
import { confirmDialog } from '../../composables/useConfirm'
import { useTranslation } from '@/composables/useTranslation'

const userStore = useUserStore()
const { t, currentLanguage } = useTranslation()

const dateLocale = computed(() => {
  const lang = currentLanguage.value
  if (lang === 'FR') return 'fr-FR'
  if (lang === 'RW') return 'rw-RW'
  if (lang === 'ZH') return 'zh-CN'
  if (lang === 'SW') return 'sw-KE'
  return 'en-US'
})

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
const isEditing = ref(false)
const editingStoryId = ref(null)

// Instagram-style story viewer state
const activeUserStories = ref(null)
const currentStoryIndex = ref(0)
const storyProgress = ref(0)
const storyTimer = ref(null)
const isPaused = ref(false)
const storyVideo = ref(null)
const STORY_DURATION = 30000 // 30 seconds

// Story ring segments
const circleCircumference = 2 * Math.PI * 48
const segmentLength = (totalStories) => {
  const gapSize = 2
  return (circleCircumference / totalStories) - gapSize
}
const segmentOffset = (index, totalStories) => {
  const gapSize = 2
  return -index * (circleCircumference / totalStories) - gapSize * index
}

const newStory = ref({
  title: '',
  location: '',
  content: '',
  image: null,
  imagePreview: null,
  mediaType: 'image'
})

// Group stories by user
const groupedStories = computed(() => {
  const groups = {}
  
  stories.value.forEach(story => {
    const userId = story.user_id || 'anonymous'
    if (!groups[userId]) {
      groups[userId] = {
        userId,
        author: story.author,
        avatar: story.user_avatar,
        stories: []
      }
    }
    groups[userId].stories.push(story)
  })
  
  return Object.values(groups)
})

const currentStory = computed(() => {
  if (!activeUserStories.value) return null
  return activeUserStories.value.stories[currentStoryIndex.value]
})

function resetStoryForm() {
  if (newStory.value.imagePreview?.startsWith('blob:')) {
    URL.revokeObjectURL(newStory.value.imagePreview)
  }
  newStory.value = { title: '', location: '', content: '', image: null, imagePreview: null, mediaType: 'image' }
  isEditing.value = false
  editingStoryId.value = null
}

function closeCreateModal() {
  showCreateModal.value = false
  resetStoryForm()
}

// Instagram-style story viewer functions
function openUserStories(userStory) {
  activeUserStories.value = userStory
  currentStoryIndex.value = 0
  storyProgress.value = 0
  isPaused.value = false
  showComments.value = false
  nextTick(() => {
    startStoryTimer()
  })
}

function closeStoryViewer() {
  stopStoryTimer()
  if (storyVideo.value) {
    storyVideo.value.pause()
    storyVideo.value.currentTime = 0
  }
  activeUserStories.value = null
  currentStoryIndex.value = 0
  storyProgress.value = 0
  isPaused.value = false
  showComments.value = false
}

function startStoryTimer() {
  stopStoryTimer()
  
  const story = currentStory.value
  if (!story) return

  // If it's a video, let the video control the duration
  if (isVideoUrl(storyPrimaryMedia(story))) {
    if (storyVideo.value) {
      storyVideo.value.play()
    }
    return
  }

  // For images, use 30-second timer
  const startTime = Date.now()
  const duration = STORY_DURATION

  storyTimer.value = setInterval(() => {
    if (isPaused.value) return

    const elapsed = Date.now() - startTime
    storyProgress.value = (elapsed / duration) * 100

    if (elapsed >= duration) {
      nextStory()
    }
  }, 50)
}

function stopStoryTimer() {
  if (storyTimer.value) {
    clearInterval(storyTimer.value)
    storyTimer.value = null
  }
}

function nextStory() {
  if (!activeUserStories.value) return

  if (currentStoryIndex.value < activeUserStories.value.stories.length - 1) {
    currentStoryIndex.value++
    storyProgress.value = 0
    nextTick(() => {
      startStoryTimer()
    })
  } else {
    // Move to next user's stories or close
    closeStoryViewer()
  }
}

function previousStory() {
  if (!activeUserStories.value) return

  if (currentStoryIndex.value > 0) {
    currentStoryIndex.value--
    storyProgress.value = 0
    nextTick(() => {
      startStoryTimer()
    })
  }
}

function togglePause() {
  isPaused.value = !isPaused.value
  if (storyVideo.value) {
    if (isPaused.value) {
      storyVideo.value.pause()
    } else {
      storyVideo.value.play()
    }
  }
}

function onMediaLoaded() {
  // Media is loaded, start timer if not video
  if (!isVideoUrl(storyPrimaryMedia(currentStory.value))) {
    startStoryTimer()
  }
}

function getProgressWidth(index) {
  if (index < currentStoryIndex.value) return 100
  if (index === currentStoryIndex.value) return storyProgress.value
  return 0
}

// Watch for story changes to restart timer
watch(currentStoryIndex, () => {
  storyProgress.value = 0
})

// Cleanup on unmount
onBeforeUnmount(() => {
  stopStoryTimer()
  if (newStory.value.imagePreview?.startsWith('blob:')) {
    URL.revokeObjectURL(newStory.value.imagePreview)
  }
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
    alert(t('stories.loginToShare'))
    return
  }
  resetStoryForm()
  showCreateModal.value = true
}

async function handleStoryImage(event) {
  const file = event.target.files[0]
  if (!file) return

  uploadingMedia.value = true
  newStory.value.mediaType = file.type?.startsWith('video/') ? 'video' : 'image'

  try {
    // Show preview
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
      // Without Cloudinary, videos cannot be stored reliably
      if (newStory.value.mediaType === 'video') {
        alert(t('stories.videoRequiresCloudinary'))
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

function canEditStory(story) {
  return canDeleteStory(story)
}

function startEditStory(story) {
  if (!canEditStory(story)) {
    alert(t('stories.editOwnStoryOnly'))
    return
  }

  isEditing.value = true
  editingStoryId.value = story.id

  const primary = storyPrimaryMedia(story)
  const mediaType = isVideoUrl(primary) ? 'video' : 'image'

  newStory.value = {
    title: story.title || '',
    location: story.location || '',
    content: story.content || '',
    image: primary || null,
    imagePreview: primary || null,
    mediaType
  }

  showCreateModal.value = true
  closeStoryViewer()
}

function canDeleteStory(story) {
  if (!story) return false
  if (!userStore.isAuthenticated) return false
  return Boolean(userStore.user?.id) && story.user_id === userStore.user.id
}

async function deleteStory(story) {
  if (!story) return
  if (!canDeleteStory(story)) {
    alert(t('stories.deleteOwnStoryOnly'))
    return
  }

  const ok = await confirmDialog(t('stories.deleteConfirmMessage'), {
    title: t('stories.deleteConfirmTitle'),
    confirmText: t('common.delete'),
    cancelText: t('common.cancel')
  })
  if (!ok) return

  deletingStoryId.value = story.id

  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', story.id)
      .eq('user_id', userStore.user.id)

    if (error) throw error

    stories.value = stories.value.filter(s => s.id !== story.id)
    if (activeStory.value?.id === story.id) {
      closeStory()
    }
  } catch (error) {
    console.error('Error deleting story:', error)
    alert(t('stories.deleteFailed', { error: error?.message || '' }))
  } finally {
    deletingStoryId.value = null
  }
}

async function createStory() {
  if (!newStory.value.title || !newStory.value.content) {
    alert(t('stories.fillRequiredFields'))
    return
  }

  if (uploadingMedia.value) {
    alert(t('stories.waitForUpload'))
    return
  }

  creating.value = true

  try {
    if (isEditing.value && editingStoryId.value) {
      const updateData = {
        title: newStory.value.title,
        location: newStory.value.location,
        content: newStory.value.content,
        image: newStory.value.image || null,
        images: newStory.value.image ? [newStory.value.image] : [],
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('stories')
        .update(updateData)
        .eq('id', editingStoryId.value)
        .eq('user_id', userStore.user.id)
        .select('*, story_likes(count), story_comments(count)')
        .single()

      if (error) throw error

      const updated = {
        ...data,
        likes_count: (data.story_likes || data.likes)?.[0]?.count || 0,
        comments_count: (data.story_comments || data.comments)?.[0]?.count || 0,
        isLiked: Boolean(activeStory.value?.isLiked)
      }

      const idx = stories.value.findIndex(s => s.id === updated.id)
      if (idx !== -1) stories.value[idx] = { ...stories.value[idx], ...updated }
      if (activeStory.value?.id === updated.id) activeStory.value = { ...activeStory.value, ...updated }

      closeCreateModal()
    } else {
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

      closeCreateModal()
    }

  } catch (error) {
    console.error('Error creating story:', error)
    alert(isEditing.value ? t('stories.updateFailed') : t('stories.shareFailed'))
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
    alert(t('stories.loginToLike'))
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
    alert(t('stories.likeUpdateFailed'))
  }
}

async function addComment() {
  if (!newComment.value.trim() || !userStore.isAuthenticated) {
    if (!userStore.isAuthenticated) alert(t('stories.loginToCommentAlert'))
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
    alert(t('stories.addCommentFailed'))
  } finally {
    addingComment.value = false
  }
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return t('time.justNow')
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return t('time.justNow')
  if (diffMins < 60) return t('time.minutesAgo', { count: diffMins })
  if (diffHours < 24) return t('time.hoursAgo', { count: diffHours })
  if (diffDays < 7) return t('time.daysAgo', { count: diffDays })
  return date.toLocaleDateString(dateLocale.value)
}
</script>
