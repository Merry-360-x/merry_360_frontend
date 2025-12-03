<template>
  <transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <!-- Backdrop -->
      <div @click="close" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <!-- Chat Window -->
      <div class="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] flex flex-col animate-slide-up">
        <!-- Header -->
        <div class="bg-gradient-to-r from-brand-500 to-brand-600 text-white p-4 sm:p-6 rounded-t-3xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            </div>
            <div>
              <h3 class="font-bold text-base sm:text-lg">Amani - AI Trip Advisor</h3>
              <p class="text-white/80 text-xs sm:text-sm flex items-center gap-1">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online • Ready to help
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
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
              <svg class="w-10 h-10 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h4 class="font-bold text-gray-900 mb-2 text-base sm:text-lg">👋 Welcome! I'm Amani</h4>
            <p class="text-gray-600 text-sm mb-6 max-w-md mx-auto">Your personal AI Trip Advisor for Rwanda. I'm here to help you plan the perfect adventure!</p>
            
            <!-- Category Options -->
            <div class="mb-6">
              <p class="text-sm font-semibold text-gray-700 mb-3">What can I help you with today?</p>
              <div class="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <button 
                  @click="sendMessage('Tell me about accommodations in Kigali')"
                  class="p-4 bg-white hover:bg-brand-50 border-2 border-gray-200 hover:border-brand-500 rounded-xl transition-all shadow-sm hover:shadow-md group"
                >
                  <div class="text-2xl mb-2">🏨</div>
                  <div class="text-xs font-semibold text-gray-700 group-hover:text-brand-600">Accommodations</div>
                </button>
                <button 
                  @click="sendMessage('Show me available tours')"
                  class="p-4 bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-green-500 rounded-xl transition-all shadow-sm hover:shadow-md group"
                >
                  <div class="text-2xl mb-2">🌿</div>
                  <div class="text-xs font-semibold text-gray-700 group-hover:text-green-600">Tours & Activities</div>
                </button>
                <button 
                  @click="sendMessage('I need transportation options')"
                  class="p-4 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-xl transition-all shadow-sm hover:shadow-md group"
                >
                  <div class="text-2xl mb-2">🚗</div>
                  <div class="text-xs font-semibold text-gray-700 group-hover:text-blue-600">Transportation</div>
                </button>
                <button 
                  @click="sendMessage('What are popular destinations in Rwanda?')"
                  class="p-4 bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 rounded-xl transition-all shadow-sm hover:shadow-md group"
                >
                  <div class="text-2xl mb-2">💡</div>
                  <div class="text-xs font-semibold text-gray-700 group-hover:text-purple-600">Travel Tips</div>
                </button>
              </div>
            </div>
            
            <!-- Quick Questions -->
            <div class="border-t border-gray-200 pt-4 mt-4">
              <p class="text-xs font-semibold text-gray-600 mb-3">Quick Questions:</p>
              <div class="flex flex-wrap gap-2 justify-center">
                <button 
                  v-for="suggestion in quickSuggestions" 
                  :key="suggestion"
                  @click="sendMessage(suggestion)"
                  class="px-3 py-1.5 bg-white text-gray-700 rounded-full text-xs hover:bg-brand-500 hover:text-white transition-colors shadow-sm border border-gray-200"
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

            <!-- AI Message -->
            <div v-else class="flex justify-start">
              <div class="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] shadow-sm border border-gray-100">
                <p class="text-sm text-gray-900">{{ message.text }}</p>
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
              class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
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
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'minimize'])

const messages = ref([])
const inputMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)

const quickSuggestions = [
  'Budget hotels under $50',
  'Gorilla trekking tours',
  'Best time to visit',
  'Eco-lodges near parks'
]

const close = () => {
  emit('close')
}

const minimize = () => {
  emit('minimize')
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
  
  // Show typing indicator
  isTyping.value = true
  
  // Simulate AI response
  setTimeout(() => {
    const response = getAIResponse(text)
    messages.value.push({
      type: 'ai',
      text: response
    })
    isTyping.value = false
    scrollToBottom()
  }, 1000 + Math.random() * 1000)
}

const getAIResponse = (userMessage) => {
  const msg = userMessage.toLowerCase()
  
  // Accommodation queries
  if (msg.includes('hotel') || msg.includes('accommodation') || msg.includes('stay') || msg.includes('kigali')) {
    return "🏨 I'd be happy to help you find accommodations! We have amazing hotels, resorts, and guesthouses in Kigali and across Rwanda. Would you like to see luxury hotels, budget-friendly options, or eco-lodges? I can also help you filter by amenities like pools, wifi, or breakfast included."
  }
  
  // Tour queries
  if (msg.includes('tour') || msg.includes('activity') || msg.includes('gorilla') || msg.includes('safari')) {
    return "🦍 Rwanda offers incredible tours! Our most popular experiences include:\n\n• Gorilla trekking in Volcanoes National Park\n• Safari adventures in Akagera\n• Cultural tours in villages\n• City tours of Kigali\n\nWhich type of adventure interests you most?"
  }
  
  // Transport queries
  if (msg.includes('transport') || msg.includes('airport') || msg.includes('transfer') || msg.includes('taxi')) {
    return "🚗 We offer various transportation options:\n\n• Airport transfers (private & shared)\n• Car rentals with/without driver\n• City taxis and ride-sharing\n• Inter-city buses\n\nWhere would you like to go?"
  }
  
  // Eco-friendly queries
  if (msg.includes('eco') || msg.includes('sustainable') || msg.includes('green')) {
    return "🌿 We love eco-conscious travelers! We have certified eco-friendly accommodations and sustainable tour operators. These properties use solar power, practice waste reduction, and support local communities. Would you like to see our green-certified options?"
  }
  
  // Pricing queries
  if (msg.includes('price') || msg.includes('cost') || msg.includes('budget') || msg.includes('cheap')) {
    return "💰 I can help you find options for any budget! Accommodations range from $20/night for budget guesthouses to $500+ for luxury lodges. Tours typically range from $50-300 depending on the experience. What's your budget range?"
  }
  
  // Booking queries
  if (msg.includes('book') || msg.includes('reserve') || msg.includes('availability')) {
    return "📅 Great! To check availability and make a booking:\n\n1. Use our search to find your perfect accommodation/tour\n2. Select your dates\n3. Review details and pricing\n4. Complete secure checkout\n\nNeed help finding something specific?"
  }
  
  // Default helpful response
  return "I'm here to help you plan your perfect trip to Rwanda! I can assist you with:\n\n✨ Accommodations (hotels, lodges, apartments)\n🎯 Tours & activities\n🚗 Transportation\n💡 Travel tips & recommendations\n\nWhat would you like to know more about?"
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

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
