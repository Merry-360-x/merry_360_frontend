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
            <h4 class="font-bold text-gray-900 mb-2 text-base sm:text-lg">Welcome! I'm Amani</h4>
            <p class="text-gray-600 text-sm mb-6 max-w-md mx-auto">Your personal AI Trip Advisor for Rwanda. I'm here to help you plan the perfect adventure!</p>
            
            <!-- Category Options -->
            <div class="mb-6">
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
  'Airport transfer options',
  'Is Rwanda safe?',
  'Visa requirements',
  'Eco-friendly lodges'
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
    return "I can help you find the perfect place to stay in Rwanda!\n\nWe offer a wide range of accommodations:\n\n**Luxury Options** (from $150/night)\n• Premium hotels in Kigali\n• Safari lodges near national parks\n• Lakeside resorts\n\n**Mid-Range** ($50-150/night)\n• Comfortable hotels with modern amenities\n• Boutique guesthouses\n• City center locations\n\n**Budget-Friendly** ($20-50/night)\n• Clean hostels and guesthouses\n• Local homestays for authentic experiences\n\nBrowse our Accommodations section to see available properties, check real-time availability, and book instantly with secure payment options."
  }
  
  // Tour queries
  if (msg.includes('tour') || msg.includes('activity') || msg.includes('gorilla') || msg.includes('safari')) {
    return "Rwanda offers incredible tour experiences!\n\n**Gorilla Trekking** - from $1500\n• Volcanoes National Park\n• Once-in-a-lifetime wildlife experience\n• Permits and guides included\n\n**Safari Adventures** - $200-500\n• Akagera National Park\n• Big 5 game viewing opportunities\n• Day trips or multi-day packages\n\n**Cultural Experiences** - $50-150\n• Kigali city historical tours\n• Traditional village visits\n• Genocide memorial and museums\n\n**Adventure Activities** - $30-200\n• Mountain hiking and trekking\n• Kayaking on Lake Kivu\n• Forest canopy walks\n\nVisit our Tours section to browse all experiences and book your adventure with instant confirmation!"
  }
  
  // Transport queries
  if (msg.includes('transport') || msg.includes('airport') || msg.includes('transfer') || msg.includes('taxi') || msg.includes('car')) {
    return " Transportation made easy in Rwanda:\n\n **Airport Transfers**\n• Private: $25-40 (Kigali)\n• Shared shuttle: $10-15\n\n **Car Rentals**\n• With driver: $80-150/day\n• Self-drive: $50-100/day\n• 4x4 available for safaris\n\n **City Transport**\n• Ride apps (Yego, Move, Uber)\n• Taxi services\n• Motorcycle taxis (moto)\n\n **Inter-City**\n• Comfortable bus services\n• Scheduled routes\n\nCheck our 'Transport' section to book your ride!"
  }
  
  // Eco-friendly queries
  if (msg.includes('eco') || msg.includes('sustainable') || msg.includes('green') || msg.includes('environment')) {
    return " Sustainable travel in Rwanda:\n\n **Eco-Certified Lodges**\n• Solar-powered properties\n• Rainwater harvesting\n• Local community support\n\n **Sustainable Activities**\n• Community-based tourism\n• Conservation projects\n• Wildlife protection programs\n\n **Rwanda is a leader in eco-tourism**\n• Plastic bag ban since 2008\n• Monthly community clean-up\n• Protected national parks\n\nWould you like to see our eco-certified properties?"
  }
  
  // Pricing queries
  if (msg.includes('price') || msg.includes('cost') || msg.includes('budget') || msg.includes('cheap') || msg.includes('expensive') || msg.includes('$')) {
    return " Budget planning for Rwanda:\n\n**Accommodation:**\n• Budget: $20-50/night\n• Mid-range: $50-150/night\n• Luxury: $150-500/night\n\n**Tours:**\n• City tours: $50-100\n• Day trips: $100-300\n• Gorilla trekking: $1500\n• Safari packages: $200-500/day\n\n**Transport:**\n• Airport transfer: $10-40\n• Car rental: $50-150/day\n• Local taxis: $5-20\n\n**Daily Budget:**\n• Backpacker: $30-50\n• Mid-range: $100-200\n• Luxury: $300+\n\nAll prices in USD. What's your budget range?"
  }
  
  // Booking queries
  if (msg.includes('book') || msg.includes('reserve') || msg.includes('availability') || msg.includes('how to')) {
    return " Easy booking process:\n\n**Step 1:** Browse\n• Explore accommodations, tours, or transport\n• Filter by price, location, ratings\n\n**Step 2:** Select\n• Choose your dates\n• Review details & amenities\n• Check availability\n\n**Step 3:** Book\n• Add to Trip Cart\n• Secure checkout\n• Instant confirmation\n\n **Benefits:**\n• Best price guarantee\n• Instant confirmation\n• 24/7 customer support\n• Flexible cancellation\n\nReady to start exploring?"
  }
  
  // Best time to visit
  if (msg.includes('when') || msg.includes('best time') || msg.includes('season') || msg.includes('weather')) {
    return " Best time to visit Rwanda:\n\n **Dry Season (Jun-Sep, Dec-Feb)**\n• Best for gorilla trekking\n• Clear skies, great views\n• Peak safari season\n• Higher prices\n\n **Wet Season (Mar-May, Oct-Nov)**\n• Lush green landscapes\n• Fewer tourists\n• Lower prices\n• Some roads challenging\n\n **Climate:**\n• Year-round spring-like weather\n• 15-27°C (59-81°F)\n• Pleasant temperatures\n\n **Gorilla Trekking:** Year-round (book 6+ months ahead)\n\nWhen are you planning to visit?"
  }
  
  // Safety queries
  if (msg.includes('safe') || msg.includes('security') || msg.includes('danger')) {
    return " Safety in Rwanda:\n\n **Rwanda is very safe!**\n• One of Africa's safest countries\n• Low crime rate\n• Clean & organized\n• Friendly locals\n\n **Safety Tips:**\n• Keep valuables secure\n• Use registered taxis/rides\n• Follow park ranger guidance\n• Respect local customs\n\n **Tourist Police:**\n• Available in major areas\n• English-speaking\n• Very helpful\n\n **Cultural Note:**\n• Rwandans are welcoming\n• English widely spoken\n• Tourist-friendly infrastructure\n\nFeel confident exploring Rwanda!"
  }
  
  // Visa & entry
  if (msg.includes('visa') || msg.includes('passport') || msg.includes('entry') || msg.includes('requirements')) {
    return " Visa & Entry Requirements:\n\n **Visa on Arrival**\n• Available for most nationalities\n• $50 for 30 days\n• Apply online before travel\n\n **Visa-Free:**\n• African Union members\n• Some Commonwealth countries\n\n **E-Visa:**\n• Apply online: irembo.gov.rw\n• 3-7 days processing\n• Easier than arrival visa\n\n **Requirements:**\n• Valid passport (6+ months)\n• Return ticket\n• Proof of accommodation\n• Yellow fever certificate (if from endemic area)\n\n Check specific requirements for your nationality!"
  }
  
  // Food queries
  if (msg.includes('food') || msg.includes('restaurant') || msg.includes('eat') || msg.includes('cuisine')) {
    return " Rwandan Cuisine & Dining:\n\n **Traditional Dishes:**\n• Isombe - cassava leaves\n• Brochettes - grilled meat skewers\n• Ugali - maize porridge\n• Matoke - cooked plantains\n\n **International Options:**\n• Indian, Chinese, Italian\n• French fine dining\n• American fast food\n• Fusion restaurants\n\n **Must-Try:**\n• Rwandan coffee (world-class!)\n• Local tea\n• Fresh tropical fruits\n\n **Prices:**\n• Street food: $2-5\n• Local restaurants: $5-15\n• Mid-range: $15-30\n• Fine dining: $30-60\n\nKigali has excellent dining scene!"
  }
  
  // Greetings
  if (msg.includes('hello') || msg.includes('hi') || msg === 'hey' || msg.includes('good morning') || msg.includes('good afternoon')) {
    return " Hello! Welcome to Merry360X - your gateway to Rwanda!\n\nI'm Amani, your AI travel advisor. I'm here to help you discover:\n\n Perfect accommodations\n Unforgettable tours\n Easy transportation\n Insider travel tips\n\nHow can I help you plan your Rwandan adventure today?"
  }
  
  // Thank you
  if (msg.includes('thank') || msg.includes('thanks')) {
    return "You're very welcome! \n\nI'm always here to help you plan the perfect trip to Rwanda. If you have any more questions about accommodations, tours, transportation, or anything else, just ask!\n\nHappy travels! "
  }
  
  // Default helpful response
  return "I'm Amani, your AI travel advisor for Rwanda! \n\nI can help you with:\n\n **Accommodations** - Hotels, lodges, guesthouses\n **Tours & Activities** - Gorilla trekking, safaris, cultural tours\n **Transportation** - Airport transfers, car rentals, taxis\n **Budget Planning** - Price ranges and tips\n **Travel Info** - Best time to visit, visas, safety\n **Dining** - Restaurants and local cuisine\n\nWhat would you like to know? Just type your question!"
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
