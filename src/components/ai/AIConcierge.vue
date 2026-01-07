<template>
  <transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <!-- Backdrop -->
      <div @click="close" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <!-- Chat Window -->
      <div class="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col animate-slide-up mb-0 sm:mb-0">
        <!-- Header -->
        <div class="bg-gradient-to-r from-brand-500 to-brand-600 text-white p-4 sm:p-6 rounded-t-3xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative">
              <svg v-if="props.mode === 'advisor' && !adminMode" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <svg v-else-if="props.mode === 'support' && !adminMode" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <svg v-else class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            </div>
            <div>
              <h3 class="font-bold text-base sm:text-lg">
                {{ adminMode ? adminName : (props.mode === 'advisor' ? 'Amani - AI Advisor' : 'Customer Support') }}
              </h3>
              <p class="text-white/80 text-xs sm:text-sm flex items-center gap-1">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                {{ adminMode ? `${adminRole} • Live Support` : (props.mode === 'advisor' ? 'AI • Ready to help' : 'Support • Here to assist') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <!-- Switch Mode Button -->
            <button 
              @click="emit('switchMode')"
              class="text-white hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors text-xs font-medium"
              :title="props.mode === 'advisor' ? 'Switch to Support' : 'Switch to Trip Advisor'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </button>
            <!-- Request Human Support Button -->
            <button 
              v-if="!adminMode && props.mode === 'support'"
              @click="requestHumanSupport"
              class="text-white hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors text-xs font-medium"
              title="Talk to a real person"
            >
              Live Agent
            </button>
            <button @click="minimize" class="text-white hover:bg-white/20 p-2 rounded-full transition-colors" title="Minimize">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <button @click="close" class="text-white hover:bg-white/20 p-2 rounded-full transition-colors" title="Close">
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="text-center py-4">
            <div class="w-20 h-20 bg-gradient-to-br from-brand-50 to-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <svg v-if="props.mode === 'advisor'" class="w-10 h-10 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h4 class="font-bold text-gray-900 mb-2 text-base sm:text-lg">
              {{ props.mode === 'advisor' ? 'Welcome! I\'m Amani' : 'Customer Support' }}
            </h4>
            <p class="text-gray-600 text-sm mb-6 max-w-md mx-auto">
              {{ props.mode === 'advisor' 
                ? 'Your personal AI Trip Advisor for Rwanda. I\'m here to help you plan the perfect adventure!' 
                : 'How can we help you today? Get support with bookings, payments, or any questions you have.' 
              }}
            </p>
            
            <!-- Category Options for Trip Advisor -->
            <div v-if="props.mode === 'advisor'" class="mb-6">
              <p class="text-sm font-semibold text-gray-700 mb-3">What can I help you with today?</p>
              <div class="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <button 
                  @click="sendMessage('Tell me about accommodations')"
                  class="p-4 bg-white hover:bg-brand-50 border-2 border-gray-200 hover:border-brand-500 rounded-xl transition-all shadow-sm hover:shadow-md group"
                >
                  <div class="text-sm font-bold text-gray-700 group-hover:text-brand-600">Accommodations</div>
                  <div class="text-xs text-gray-500 mt-1">Hotels & Lodges</div>
                </button>
                <button 
                  @click="sendMessage('Show me available tours')"
                  class="p-4 bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-green-500 rounded-xl transition-all shadow-sm hover:shadow-md group"
                >
                  <div class="text-sm font-bold text-gray-700 group-hover:text-green-600">Tours & Activities</div>
                  <div class="text-xs text-gray-500 mt-1">Explore Rwanda</div>
                </button>
                <button 
                  @click="sendMessage('I need transportation')"
                  class="p-4 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-xl transition-all shadow-sm hover:shadow-md group"
                >
                  <div class="text-sm font-bold text-gray-700 group-hover:text-blue-600">Transportation</div>
                  <div class="text-xs text-gray-500 mt-1">Get Around</div>
                </button>
                <button 
                  @click="sendMessage('Services available')"
                  class="p-4 bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 rounded-xl transition-all shadow-sm hover:shadow-md group"
                >
                  <div class="text-sm font-bold text-gray-700 group-hover:text-purple-600">Services</div>
                  <div class="text-xs text-gray-500 mt-1">Other Services</div>
                </button>
              </div>
            </div>
            
            <!-- Quick Questions -->
            <div class="border-t border-gray-200 pt-4 mt-4">
              <p class="text-xs font-semibold text-gray-600 mb-3">
                {{ props.mode === 'advisor' ? 'Quick Questions:' : 'Common Issues:' }}
              </p>
              <div class="flex flex-wrap gap-2 justify-center">
                <button 
                  v-for="suggestion in (props.mode === 'advisor' ? advisorSuggestions : supportSuggestions)" 
                  :key="suggestion"
                  @click="sendMessage(suggestion)"
                  :class="props.mode === 'advisor' ? 'hover:bg-brand-500' : 'hover:bg-blue-500'"
                  class="px-3 py-1.5 bg-white text-gray-700 rounded-full text-xs hover:text-white transition-colors shadow-sm border border-gray-200"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div v-for="(message, index) in messages" :key="index">
            <!-- User Message -->
            <div v-if="message.type === 'user'" class="flex justify-end">
              <div class="bg-brand-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] shadow-sm">
                <p class="text-sm">{{ message.text }}</p>
              </div>
            </div>

            <!-- AI/Admin Message -->
            <div v-else class="flex justify-start">
              <div class="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] shadow-sm border border-gray-100">
                <div v-if="message.isAdmin" class="flex items-center gap-2 mb-1">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ message.adminRole }}
                  </span>
                  <span class="text-xs text-gray-500">{{ message.adminName }}</span>
                </div>
                <p class="text-sm text-gray-900 whitespace-pre-line">{{ message.text }}</p>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-white border-t border-gray-200 rounded-b-3xl">
          <div class="flex gap-2">
            <input 
              v-model="inputMessage"
              @keypress.enter="sendUserMessage"
              type="text" 
              placeholder="Ask me anything..."
              class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
            />
            <button 
              @click="sendUserMessage"
              :disabled="!inputMessage.trim() || isTyping"
              class="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-medium transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'
import { getAIResponse as callOpenAI, isOpenAIConfigured } from '../../services/openai'
import { getMerry360XContext, formatContextForAI } from '../../services/aiContext'
import { supabase } from '../../services/supabase'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { useRouter } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'advisor', // 'advisor' or 'support'
    validator: (value) => ['advisor', 'support'].includes(value)
  }
})

const emit = defineEmits(['close', 'minimize', 'switchMode'])

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()

const messages = ref([])
const inputMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)
const adminMode = ref(false)
const adminName = ref('')
const adminRole = ref('')
const conversationHistory = ref([]) // Store conversation for context
const useOpenAI = ref(isOpenAIConfigured())
const conversationId = ref(null)
const showRating = ref(false)
const rating = ref(0)
const showCartTab = ref(false)

// Computed
const cartCount = computed(() => userStore.cartCount)

const advisorSuggestions = [
  'Show me hotels',
  'Gorilla trekking',
  'Airport transfer',
  'Best time to visit'
]

const supportSuggestions = [
  'I need help with my booking',
  'Payment issue',
  'Cancel reservation',
  'Change booking dates'
]

// Admin clearance levels
const CLEARANCE_LEVELS = {
  SUPPORT: 'Support Agent',
  MANAGER: 'Support Manager', 
  ADMIN: 'Administrator'
}

const close = () => {
  emit('close')
}

const minimize = () => {
  emit('minimize')
}

const requestHumanSupport = async () => {
  // Update conversation to request human support
  if (!conversationId.value) {
    messages.value.push({
      type: 'system',
      text: 'Please log in to request a live support agent.',
      isAdmin: false
    })
    scrollToBottom()
    return
  }

  if (conversationId.value) {
    await supabase
      .from('support_conversations')
      .update({ 
        needs_human: true,
        status: 'waiting'
      })
      .eq('id', conversationId.value)
    
    messages.value.push({
      type: 'system',
      text: 'Request sent! A support agent will join you shortly. Average wait time: 2-5 minutes.',
      isAdmin: false
    })
    scrollToBottom()
  }
}

const sendUserMessage = () => {
  if (!inputMessage.value.trim() || isTyping.value) return
  
  const userText = inputMessage.value.trim()
  sendMessage(userText)
}

const sendMessage = async (text) => {
  // Add user message
  messages.value.push({
    type: 'user',
    text: text
  })
  
  inputMessage.value = ''
  scrollToBottom()
  
  // Save user message to database
  if (conversationId.value) {
    await supabase.from('support_messages').insert({
      conversation_id: conversationId.value,
      sender: 'user',
      content: text
    })
  }
  
  // Don't auto-respond if in admin mode (wait for staff)
  if (adminMode.value) {
    return
  }
  
  // Show typing indicator
  isTyping.value = true
  
  try {
    let response
    
    if (useOpenAI.value) {
      // Fetch real-time data from Supabase before calling AI
      const realtimeContext = await getMerry360XContext()
      const formattedContext = formatContextForAI(realtimeContext)
      
      // Use OpenAI GPT API with real-time data
      response = await callOpenAI(text, conversationHistory.value, formattedContext)
      
      // Update conversation history for context
      conversationHistory.value.push(
        { role: 'user', content: text },
        { role: 'assistant', content: response }
      )
      
      // Keep only last 10 messages for context (5 exchanges)
      if (conversationHistory.value.length > 10) {
        conversationHistory.value = conversationHistory.value.slice(-10)
      }
    } else {
      // Fallback to rule-based responses
      response = getFallbackResponse(text)
    }
    
    messages.value.push({
      type: 'ai',
      text: response,
      isAdmin: false,
      adminName: null,
      adminRole: null
    })
    
    // Save AI response to database
    if (conversationId.value) {
      await supabase.from('support_messages').insert({
        conversation_id: conversationId.value,
        sender: 'ai',
        content: response,
        is_staff: false
      })
    }
  } catch (error) {
    console.error('AI Response Error:', error)
    messages.value.push({
      type: 'ai',
      text: "I'm having trouble connecting right now. Please try again or click 'Talk to Support' for immediate help.",
      isAdmin: false
    })
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

const getFallbackResponse = (userMessage) => {
  const msg = userMessage.toLowerCase()
  
  // Support/Help queries
  if (msg.includes('help') || msg.includes('support') || msg.includes('problem') || msg.includes('issue')) {
    return "I'm here to help! I can assist with:\n\n• Booking questions\n• Payment issues\n• Account problems\n• Travel information\n• General inquiries\n\nNeed to speak with a human? Click 'Talk to Support' above!"
  }
  
  // Accommodation queries
  if (msg.includes('hotel') || msg.includes('accommodation') || msg.includes('stay')) {
    return "We have hotels ranging from $20-500/night:\n\n• Budget: Clean guesthouses ($20-50)\n• Mid-range: Comfortable hotels ($50-150)\n• Luxury: Premium lodges ($150+)\n\nVisit Accommodations to browse and book!"
  }
  
  // Tour queries
  if (msg.includes('tour') || msg.includes('gorilla') || msg.includes('safari')) {
    return "Popular tours:\n\n• Gorilla Trekking - $1500\n• Safari in Akagera - $200-500\n• City tours - $50-100\n• Cultural experiences - $50-150\n\nCheck out our Tours section!"
  }
  
  // Transport queries
  if (msg.includes('transport') || msg.includes('airport') || msg.includes('car')) {
    return "Transportation options:\n\n• Airport transfer: $10-40\n• Car rental: $50-150/day\n• City transport available\n\nBook in our Transport section!"
  }
  
  // Pricing queries
  if (msg.includes('price') || msg.includes('cost') || msg.includes('budget')) {
    return "Daily budget guide:\n\n• Backpacker: $30-50\n• Mid-range: $100-200\n• Luxury: $300+\n\nWhat's your budget?"
  }
  
  // Weather/timing
  if (msg.includes('when') || msg.includes('weather') || msg.includes('season')) {
    return "Best time to visit:\n\n• Dry season (Jun-Sep, Dec-Feb) - Best for trekking\n• Wet season (Mar-May, Oct-Nov) - Lower prices\n\nYear-round spring weather (15-27°C)!"
  }
  
  // Safety
  if (msg.includes('safe') || msg.includes('security')) {
    return "Rwanda is very safe! It's one of Africa's safest countries with low crime rates. English is widely spoken and infrastructure is tourist-friendly."
  }
  
  // Visa
  if (msg.includes('visa') || msg.includes('passport')) {
    return "Visa info:\n\n• E-visa available online\n• $50 for 30 days\n• Valid passport required (6+ months)\n\nCheck irembo.gov.rw"
  }
  
  // Greetings
  if (msg.includes('hello') || msg.includes('hi') || msg === 'hey') {
    return "Hello! I'm Amani, your AI travel advisor. I can help with accommodations, tours, transport, and travel info. What would you like to know?"
  }
  
  // Thanks
  if (msg.includes('thank')) {
    return "You're welcome! Feel free to ask if you need anything else. Happy travels!"
  }
  
  // Need human help
  if (msg.includes('human') || msg.includes('person') || msg.includes('agent')) {
    return "Would you like to speak with a live support agent? Click the 'Talk to Support' button at the top!"
  }
  
  // Default
  return "I can help you with:\n\n• Accommodations\n• Tours & Activities\n• Transportation\n• Travel Information\n\nWhat would you like to know?"
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Initialize support conversation
onMounted(async () => {
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
      adminMode.value = !existingConversation.is_ai && existingConversation.staff_id
      adminName.value = existingConversation.staff_name || ''
      adminRole.value = CLEARANCE_LEVELS.SUPPORT
      
      // Load existing messages
      const { data: existingMessages } = await supabase
        .from('support_messages')
        .select('*')
        .eq('conversation_id', conversationId.value)
        .order('created_at', { ascending: true })
      
      if (existingMessages && existingMessages.length > 0) {
        messages.value = existingMessages.map(msg => ({
          type: msg.sender === 'user' ? 'user' : 'ai',
          text: msg.content,
          isAdmin: msg.is_staff,
          adminName: msg.staff_name,
          adminRole: msg.is_staff ? CLEARANCE_LEVELS.SUPPORT : null
        }))
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
    }
  } else {
    // Guest users can't create DB-backed conversations due to RLS.
    // Allow AI chat to run without persistence; require login for human support.
    conversationId.value = null
    messages.value.push({
      type: 'system',
      text: 'You can chat with the AI as a guest. To talk to a human support agent, please log in.',
      isAdmin: false
    })
  }
  
  // Subscribe to new messages from staff
  if (!conversationId.value) return

  const channel = supabase
    .channel(`support_${conversationId.value}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'support_messages',
      filter: `conversation_id=eq.${conversationId.value}`
    }, (payload) => {
      const message = payload.new
      if (message.sender !== 'user') {
        messages.value.push({
          type: 'ai',
          text: message.content,
          isAdmin: message.is_staff,
          adminName: message.staff_name,
          adminRole: message.is_staff ? CLEARANCE_LEVELS.SUPPORT : null
        })
        scrollToBottom()
        
        // Update admin mode if staff joined
        if (message.is_staff && !adminMode.value) {
          adminMode.value = true
          adminName.value = message.staff_name
          adminRole.value = CLEARANCE_LEVELS.SUPPORT
        }
      }
    })
    .subscribe()
  
  onUnmounted(() => {
    supabase.removeChannel(channel)
  })
})

// Watch for open state to reset
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      scrollToBottom()
    })
  }
})
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #F25757;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #e04545;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}
</style>
