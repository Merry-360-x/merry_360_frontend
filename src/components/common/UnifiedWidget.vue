<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Widget Window -->
    <transition name="slide-up">
      <div v-if="isOpen" class="mb-4 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <!-- Tabs Header -->
        <div class="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-white font-semibold">{{ currentTab === 'chat' ? 'Support' : 'Trip Cart' }}</h3>
            <button @click="isOpen = false" class="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- Tab Buttons -->
          <div class="flex gap-2">
            <button
              @click="currentTab = 'chat'"
              :class="currentTab === 'chat' ? 'bg-white text-brand-600' : 'bg-white/20 text-white hover:bg-white/30'"
              class="flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all relative"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                <span>Chat</span>
                <div v-if="unreadMessages > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {{ unreadMessages }}
                </div>
              </div>
            </button>
            
            <button
              @click="currentTab = 'cart'"
              :class="currentTab === 'cart' ? 'bg-white text-brand-600' : 'bg-white/20 text-white hover:bg-white/30'"
              class="flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all relative"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Cart</span>
                <div v-if="userStore.cartCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {{ userStore.cartCount }}
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Chat Tab Content -->
        <div v-if="currentTab === 'chat'" class="h-[500px] flex flex-col">
          <!-- Staff Join Notification -->
          <transition name="fade">
            <div v-if="showStaffJoinedNotification" class="bg-green-50 border-b border-green-200 px-6 py-3">
              <div class="flex items-center gap-2 text-green-800">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm font-medium">{{ staffName }} joined the conversation</span>
              </div>
            </div>
          </transition>

          <!-- Messages Area -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            <div v-for="message in messages" :key="message.id" :class="message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'">
              <div :class="message.sender === 'user' ? 'bg-brand-600 text-white' : 'bg-white text-gray-900'" class="max-w-[80%] rounded-2xl px-4 py-3 shadow-sm">
                <div v-if="message.sender !== 'user'" class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-medium opacity-75">{{ message.is_staff ? message.staff_name : 'AI Assistant' }}</span>
                  <span v-if="message.is_staff" class="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Live</span>
                </div>
                <p class="text-sm leading-relaxed">{{ message.content }}</p>
                <span class="text-xs opacity-75 mt-1 block">{{ formatTime(message.created_at) }}</span>
              </div>
            </div>

            <div v-if="isTyping" class="flex justify-start">
              <div class="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rating Form -->
          <transition name="fade">
            <div v-if="showRating" class="border-t border-gray-200 bg-white px-6 py-4">
              <p class="text-sm text-gray-700 mb-3 font-medium">How was your experience?</p>
              <div class="flex gap-2 mb-3">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  @click="rating = star"
                  class="p-2 hover:scale-110 transition-transform"
                >
                  <svg class="w-6 h-6" :class="star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </button>
              </div>
              <button 
                @click="submitRating" 
                :disabled="!rating"
                class="w-full py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Submit Rating
              </button>
            </div>
          </transition>

          <!-- Input Area -->
          <div v-if="!showRating" class="border-t border-gray-200 bg-white px-6 py-4">
            <div class="flex gap-3">
              <input 
                v-model="newMessage"
                @keypress.enter="sendMessage"
                type="text"
                placeholder="Type your message..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-sm"
              >
              <button 
                @click="sendMessage"
                :disabled="!newMessage.trim()"
                class="px-6 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Tab Content -->
        <div v-else class="h-[500px] overflow-y-auto">
          <div v-if="userStore.tripCart.length === 0" class="flex flex-col items-center justify-center h-full p-6 text-center">
            <svg class="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p class="text-sm text-gray-500 mb-4">Start exploring and add items to your trip!</p>
            <button 
              @click="goToExplore"
              class="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
            >
              Explore Now
            </button>
          </div>

          <div v-else class="p-6 space-y-4">
            <div v-for="item in userStore.tripCart" :key="item.id" class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div class="flex gap-4 p-4">
                <img 
                  :src="item.media?.[0]?.url || '/placeholder.jpg'" 
                  :alt="item.title"
                  class="w-24 h-24 object-cover rounded-lg"
                >
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-gray-900 truncate mb-1">{{ item.title }}</h4>
                  <p class="text-sm text-gray-500 mb-2">{{ item.location }}</p>
                  <div class="flex items-center justify-between">
                    <div class="text-brand-600 font-bold">
                      {{ currencyStore.formatPrice(item.price) }}
                    </div>
                    <button 
                      @click="removeFromCart(item.id)"
                      class="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4 mt-4">
              <div class="flex items-center justify-between mb-4">
                <span class="text-lg font-semibold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-brand-600">
                  {{ currencyStore.formatPrice(cartTotal) }}
                </span>
              </div>
              <button 
                @click="goToCheckout"
                class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Toggle Button -->
    <button 
      @click="isOpen = !isOpen"
      class="w-16 h-16 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center relative"
    >
      <!-- Combined Badge -->
      <div v-if="totalBadgeCount > 0" class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold ring-4 ring-white">
        {{ totalBadgeCount }}
      </div>
      
      <svg v-if="!isOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
      <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { supabase } from '../../services/supabase'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()

// Widget state
const isOpen = ref(false)
const currentTab = ref('chat')

// Chat state
const messages = ref([])
const newMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)
const conversationId = ref(null)
const isStaffLive = ref(false)
const staffName = ref('')
const showStaffJoinedNotification = ref(false)
const showRating = ref(false)
const rating = ref(0)
const unreadMessages = ref(0)

// Combined badge count
const totalBadgeCount = computed(() => {
  return userStore.cartCount + unreadMessages.value
})

// Cart total
const cartTotal = computed(() => {
  return userStore.tripCart.reduce((sum, item) => sum + item.price, 0)
})

// Initialize chat session
onMounted(async () => {
  // Create or get existing conversation
  if (userStore.user) {
    // Try to find existing active conversation
    const { data: existingConversation } = await supabase
      .from('support_conversations')
      .select('*')
      .eq('user_id', userStore.user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (existingConversation) {
      conversationId.value = existingConversation.id
      isStaffLive.value = !existingConversation.is_ai
      staffName.value = existingConversation.staff_name || ''
      
      // Load existing messages
      const { data: existingMessages } = await supabase
        .from('support_messages')
        .select('*')
        .eq('conversation_id', conversationId.value)
        .order('created_at', { ascending: true })
      
      if (existingMessages) {
        messages.value = existingMessages
      }
    } else {
      // Create new conversation
      const { data: newConversation } = await supabase
        .from('support_conversations')
        .insert({
          user_id: userStore.user.id,
          user_email: userStore.user.email,
          status: 'active',
          is_ai: true
        })
        .select()
        .single()
      
      conversationId.value = newConversation.id
      
      // Add welcome message
      await supabase.from('support_messages').insert({
        conversation_id: conversationId.value,
        sender: 'ai',
        content: 'Hello! How can I help you today?',
        is_staff: false
      })
      
      messages.value.push({
        id: Date.now(),
        sender: 'ai',
        content: 'Hello! How can I help you today?',
        created_at: new Date().toISOString(),
        is_staff: false
      })
    }
  } else {
    // Guest user - create anonymous conversation
    const guestEmail = `guest_${Date.now()}@temp.com`
    const { data: newConversation } = await supabase
      .from('support_conversations')
      .insert({
        user_email: guestEmail,
        status: 'active',
        is_ai: true
      })
      .select()
      .single()
    
    conversationId.value = newConversation.id
    
    // Add welcome message
    messages.value.push({
      id: Date.now(),
      sender: 'ai',
      content: 'Hello! How can I help you today?',
      created_at: new Date().toISOString(),
      is_staff: false
    })
  }
  
  // Subscribe to chat messages
  const channel = supabase
    .channel(`chat_${conversationId.value}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'support_messages',
      filter: `conversation_id=eq.${conversationId.value}`
    }, (payload) => {
      const message = payload.new
      if (message.sender !== 'user') {
        messages.value.push(message)
        scrollToBottom()
        
        // Show unread badge if widget is closed or on different tab
        if (!isOpen.value || currentTab.value !== 'chat') {
          unreadMessages.value++
        }
        
        // Handle staff join
        if (message.is_staff && !isStaffLive.value) {
          isStaffLive.value = true
          staffName.value = message.staff_name
          showStaffJoinedNotification.value = true
          setTimeout(() => {
            showStaffJoinedNotification.value = false
          }, 5000)
        }
      }
    })
    .subscribe()
  
  // Cleanup on unmount
  onUnmounted(() => {
    supabase.removeChannel(channel)
  })
})

// Clear unread count when switching to chat tab
watch([isOpen, currentTab], ([newIsOpen, newTab]) => {
  if (newIsOpen && newTab === 'chat') {
    unreadMessages.value = 0
  }
})

// Send message
const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  const messageText = newMessage.value.trim()
  newMessage.value = ''
  
  // Add user message
  const userMessage = {
    id: Date.now(),
    sender: 'user',
    content: messageText,
    created_at: new Date().toISOString()
  }
  messages.value.push(userMessage)
  scrollToBottom()
  
  // Save to database
  await supabase.from('support_messages').insert({
    conversation_id: conversationId.value,
    sender: 'user',
    content: messageText
  })
  
  // Show typing indicator
  isTyping.value = true
  
  // Simulate AI response (replace with actual AI service)
  setTimeout(async () => {
    isTyping.value = false
    
    const aiMessage = {
      id: Date.now() + 1,
      sender: 'ai',
      content: 'Thank you for your message! A support representative will be with you shortly.',
      created_at: new Date().toISOString(),
      is_staff: false
    }
    messages.value.push(aiMessage)
    scrollToBottom()
    
    // Save AI message
    await supabase.from('support_messages').insert({
      conversation_id: conversationId.value,
      sender: 'ai',
      content: aiMessage.content,
      is_staff: false
    })
  }, 1500)
}

// Submit rating
const submitRating = async () => {
  await supabase
    .from('support_conversations')
    .update({ rating: rating.value })
    .eq('id', conversationId.value)
  
  showRating.value = false
  rating.value = 0
  
  // Show thank you message
  messages.value.push({
    id: Date.now(),
    sender: 'ai',
    content: 'Thank you for your feedback!',
    created_at: new Date().toISOString(),
    is_staff: false
  })
}

// Scroll to bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Format time
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// Cart functions
const removeFromCart = (itemId) => {
  userStore.removeFromCart(itemId)
}

const goToCheckout = () => {
  isOpen.value = false
  router.push('/checkout')
}

const goToExplore = () => {
  isOpen.value = false
  router.push('/accommodations')
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
