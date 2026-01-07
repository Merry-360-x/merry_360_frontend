<template>
  <!-- Chat Button -->
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Window -->
    <transition name="slide-up">
      <div v-if="isOpen" class="mb-4 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <div v-if="isStaffLive" class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div class="text-white">
              <h3 class="font-semibold">{{ isStaffLive ? staffName : 'Support Chat' }}</h3>
              <p class="text-xs opacity-90">{{ isStaffLive ? 'Live now' : 'AI Assistant' }}</p>
            </div>
          </div>
          <button @click="isOpen = false" class="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

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
        <div ref="messagesContainer" class="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div v-for="message in messages" :key="message.id" :class="message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'">
            <div :class="message.sender === 'user' ? 'bg-brand-600 text-white' : 'bg-white text-gray-900'" class="max-w-[80%] rounded-2xl px-4 py-3 shadow-sm">
              <!-- Staff/AI Badge -->
              <div v-if="message.sender !== 'user'" class="flex items-center gap-2 mb-1">
                <span class="text-xs font-medium opacity-75">{{ message.is_staff ? message.staff_name : 'AI Assistant' }}</span>
                <span v-if="message.is_staff" class="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Live</span>
              </div>
              <p class="text-sm leading-relaxed">{{ message.content }}</p>
              <span class="text-xs opacity-75 mt-1 block">{{ formatTime(message.created_at) }}</span>
            </div>
          </div>

          <!-- Typing Indicator -->
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

        <!-- Rating Form (shown after staff ends conversation) -->
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
              class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
            <button 
              @click="sendMessage"
              :disabled="!newMessage.trim()"
              class="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white rounded-xl transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
          <button 
            v-if="!isStaffLive && !requestedHuman"
            @click="requestHumanSupport"
            class="mt-3 w-full py-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            🙋 Request Human Support
          </button>
          <p v-if="requestedHuman && !isStaffLive" class="mt-3 text-xs text-center text-gray-500">
            Waiting for available staff...
          </p>
        </div>
      </div>
    </transition>

    <!-- Chat Toggle Button -->
    <button 
      @click="toggleChat"
      class="w-16 h-16 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative"
    >
      <svg v-if="!isOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
      <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
      <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
        {{ unreadCount }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { supabase } from '../../services/supabase'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()
const isOpen = ref(false)
const messages = ref([])
const newMessage = ref('')
const conversationId = ref(null)
const isTyping = ref(false)
const messagesContainer = ref(null)
const requestedHuman = ref(false)
const isStaffLive = ref(false)
const staffName = ref('')
const showStaffJoinedNotification = ref(false)
const showRating = ref(false)
const rating = ref(0)
const unreadCount = ref(0)
const chatUnavailable = ref(false)
let messageSubscription = null
let conversationSubscription = null

const toggleChat = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    if (chatUnavailable.value) {
      return
    }
    if (!conversationId.value) {
      await createConversation()
    }
    await loadMessages()
    scrollToBottom()
  }
}

const createConversation = async () => {
  try {
    // Avoid RLS/permission errors for anonymous users.
    if (!userStore.user?.id) {
      chatUnavailable.value = true
      messages.value = [
        {
          id: Date.now(),
          sender: 'ai',
          content: 'Please login to start a support chat.',
          created_at: new Date().toISOString(),
          is_staff: false
        }
      ]
      return
    }

    const { data, error } = await supabase
      .from('support_conversations')
      .insert({
        user_id: userStore.user?.id || null,
        user_email: userStore.user?.email || 'guest@merry360.com',
        status: 'active',
        is_ai: true
      })
      .select()
      .single()

    if (error) throw error
    conversationId.value = data.id
    
    // Send welcome message
    await sendSystemMessage('Hello! I\'m your AI assistant. How can I help you today? You can request to speak with a human at any time.')
  } catch (error) {
    console.error('Error creating conversation:', error)
    if (error?.status === 401 || error?.status === 403) {
      chatUnavailable.value = true
      messages.value = [
        {
          id: Date.now(),
          sender: 'ai',
          content: 'Support chat is unavailable right now. Please try again later.',
          created_at: new Date().toISOString(),
          is_staff: false
        }
      ]
    }
  }
}

const loadMessages = async () => {
  if (!conversationId.value) return

  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('conversation_id', conversationId.value)
      .order('created_at', { ascending: true })

    if (error) throw error
    messages.value = data || []
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error loading messages:', error)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !conversationId.value) return

  const messageContent = newMessage.value.trim()
  newMessage.value = ''

  try {
    const { error } = await supabase
      .from('support_messages')
      .insert({
        conversation_id: conversationId.value,
        sender: 'user',
        content: messageContent,
        is_staff: false
      })

    if (error) throw error

    // Simulate AI response if no staff is live
    if (!isStaffLive.value) {
      isTyping.value = true
      setTimeout(async () => {
        await sendAIResponse(messageContent)
        isTyping.value = false
      }, 1500)
    }
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

const sendSystemMessage = async (content) => {
  try {
    await supabase
      .from('support_messages')
      .insert({
        conversation_id: conversationId.value,
        sender: 'system',
        content,
        is_staff: false
      })
  } catch (error) {
    console.error('Error sending system message:', error)
  }
}

const sendAIResponse = async (userMessage) => {
  // Simple AI responses
  const responses = {
    booking: 'I can help you with bookings! You can browse our accommodations, tours, and transport services. Would you like me to show you our available options?',
    price: 'Our prices vary by property and season. You can check specific pricing on each listing page. Is there a particular property you\'re interested in?',
    cancel: 'For cancellations, please visit your dashboard and go to "My Bookings". You can cancel bookings there based on the cancellation policy. Need help with a specific booking?',
    payment: 'We accept credit cards, debit cards, and mobile money. All payments are secure. What would you like to know about payments?',
    default: 'I understand. Let me help you with that. Could you provide more details? If you need personalized assistance, feel free to request human support.'
  }

  const lowerMessage = userMessage.toLowerCase()
  let response = responses.default

  if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) response = responses.booking
  else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pay')) response = responses.price
  else if (lowerMessage.includes('cancel')) response = responses.cancel
  else if (lowerMessage.includes('payment') || lowerMessage.includes('card')) response = responses.payment

  try {
    await supabase
      .from('support_messages')
      .insert({
        conversation_id: conversationId.value,
        sender: 'ai',
        content: response,
        is_staff: false
      })
  } catch (error) {
    console.error('Error sending AI response:', error)
  }
}

const requestHumanSupport = async () => {
  requestedHuman.value = true
  
  try {
    await supabase
      .from('support_conversations')
      .update({ 
        needs_human: true,
        status: 'waiting'
      })
      .eq('id', conversationId.value)

    await sendSystemMessage('🙋 You\'ve requested human support. A staff member will join shortly...')
  } catch (error) {
    console.error('Error requesting human support:', error)
  }
}

const submitRating = async () => {
  if (!rating.value || !conversationId.value) return

  try {
    await supabase
      .from('support_conversations')
      .update({ rating: rating.value })
      .eq('id', conversationId.value)

    showRating.value = false
    await sendSystemMessage(`Thank you for your rating! If you need anything else, feel free to ask.`)
  } catch (error) {
    console.error('Error submitting rating:', error)
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }, 100)
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const setupRealtimeSubscription = () => {
  if (!conversationId.value) return

  // Subscribe to new messages
  messageSubscription = supabase
    .channel(`messages:${conversationId.value}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'support_messages',
      filter: `conversation_id=eq.${conversationId.value}`
    }, (payload) => {
      messages.value.push(payload.new)
      scrollToBottom()
      
      // Show unread count if chat is closed
      if (!isOpen.value && payload.new.sender !== 'user') {
        unreadCount.value++
      }
    })
    .subscribe()

  // Subscribe to conversation updates (staff joining, ending, etc.)
  conversationSubscription = supabase
    .channel(`conversation:${conversationId.value}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'support_conversations',
      filter: `id=eq.${conversationId.value}`
    }, (payload) => {
      const updated = payload.new
      
      // Staff joined
      if (updated.staff_id && !isStaffLive.value) {
        isStaffLive.value = true
        staffName.value = updated.staff_name || 'Staff Member'
        showStaffJoinedNotification.value = true
        setTimeout(() => {
          showStaffJoinedNotification.value = false
        }, 5000)
      }
      
      // Conversation ended by staff
      if (updated.status === 'closed' && isStaffLive.value) {
        isStaffLive.value = false
        showRating.value = true
      }
    })
    .subscribe()
}

onMounted(() => {
  if (userStore.isAuthenticated) {
    setupRealtimeSubscription()
  }
})

onUnmounted(() => {
  if (messageSubscription) {
    supabase.removeChannel(messageSubscription)
  }
  if (conversationSubscription) {
    supabase.removeChannel(conversationSubscription)
  }
})
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
