<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6 sm:mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Live Support Conversations</h1>
            <p class="text-gray-600 dark:text-gray-300 mt-2">Monitor and respond to customer inquiries in real-time</p>
          </div>

          <button
            type="button"
            class="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="goBackToDashboard"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Conversations List -->
        <div class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200/60 dark:border-gray-700">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="font-semibold text-gray-900 dark:text-white">Active Conversations</h2>
            <div class="mt-3 flex gap-2">
              <button 
                @click="filter = 'waiting'"
                :class="filter === 'waiting' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Waiting ({{ waitingCount }})
              </button>
              <button 
                @click="filter = 'active'"
                :class="filter === 'active' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Active ({{ activeCount }})
              </button>
              <button 
                @click="filter = 'all'"
                :class="filter === 'all' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                All
              </button>
            </div>
          </div>

          <div class="overflow-y-auto max-h-[calc(100vh-300px)]">
            <div 
              v-for="conv in filteredConversations" 
              :key="conv.id"
              @click="selectConversation(conv)"
              :class="selectedConversation?.id === conv.id ? 'bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
              class="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                    <span class="text-brand-600 font-semibold text-sm">{{ getInitials(conv.user_email) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white text-sm">{{ conv.user_email }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(conv.created_at) }}</p>
                  </div>
                </div>
                <span 
                  :class="{
                    'bg-yellow-100 text-yellow-700': conv.status === 'waiting',
                    'bg-green-100 text-green-700': conv.status === 'active',
                    'bg-gray-100 text-gray-700': conv.status === 'closed'
                  }"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ conv.status }}
                </span>
              </div>
              <p v-if="conv.last_message" class="text-sm text-gray-600 dark:text-gray-300 truncate">{{ conv.last_message }}</p>
              <div v-if="conv.needs_human && conv.status === 'waiting'" class="mt-2 flex items-center gap-1 text-orange-600">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-xs font-medium">Requested human support</span>
              </div>
            </div>
            
            <div v-if="filteredConversations.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <p>No conversations found</p>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-200/60 dark:border-gray-700" style="height: calc(100vh - 200px)">
          <div v-if="selectedConversation" class="flex flex-col h-full">
            <!-- Chat Header -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                  <span class="text-brand-600 font-semibold">{{ getInitials(selectedConversation.user_email) }}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ selectedConversation.user_email }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ selectedConversation.staff_id ? `Handled by ${selectedConversation.staff_name}` : 'No staff assigned' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  v-if="!selectedConversation.staff_id"
                  @click="takeOverConversation"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Take Over
                </button>
                <button 
                  v-if="selectedConversation.staff_id && selectedConversation.status === 'active'"
                  @click="endConversation"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  End Conversation
                </button>
              </div>
            </div>

            <!-- Messages -->
            <div ref="chatMessages" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
              <div v-for="message in currentMessages" :key="message.id" :class="message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'">
                <div :class="message.sender === 'user' ? 'bg-brand-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'" class="max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm">
                  <div v-if="message.sender !== 'user'" class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-medium opacity-75">
                      {{ message.sender === 'ai' ? 'AI Assistant' : message.is_staff ? message.staff_name || 'Staff' : 'System' }}
                    </span>
                    <span v-if="message.is_staff" class="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Live</span>
                  </div>
                  <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
                  <span class="text-xs opacity-75 mt-1 block">{{ formatFullTime(message.created_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Input Area -->
            <div v-if="selectedConversation.staff_id && selectedConversation.status === 'active'" class="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
              <div class="flex gap-3">
                <input 
                  v-model="replyMessage"
                  @keypress.enter="sendReply"
                  type="text"
                  placeholder="Type your message..."
                  class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <button 
                  @click="sendReply"
                  :disabled="!replyMessage.trim()"
                  class="px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white rounded-xl transition-colors font-medium"
                >
                  Send
                </button>
              </div>
            </div>

            <div v-else-if="!selectedConversation.staff_id" class="border-t border-gray-200 dark:border-gray-700 p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <p class="text-center text-sm text-yellow-800 dark:text-yellow-200">Click "Take Over" to start responding to this conversation</p>
            </div>

            <div v-else class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
              <p class="text-center text-sm text-gray-600 dark:text-gray-300">This conversation has ended</p>
            </div>
          </div>

          <div v-else class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div class="text-center">
              <svg class="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <p class="text-lg">Select a conversation to view messages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../../components/layout/AdminLayout.vue'
import { supabase } from '../../services/supabase'
import { useUserStore } from '../../stores/userStore'
import { useToast } from '../../composables/useToast'

const userStore = useUserStore()
const { showToast } = useToast()
const router = useRouter()

const conversations = ref([])
const selectedConversation = ref(null)
const currentMessages = ref([])
const replyMessage = ref('')
const filter = ref('waiting')
const chatMessages = ref(null)

let conversationsSubscription = null
let messagesSubscription = null

const filteredConversations = computed(() => {
  if (filter.value === 'all') return conversations.value
  if (filter.value === 'waiting') return conversations.value.filter(c => c.status === 'waiting' || (c.needs_human && !c.staff_id))
  if (filter.value === 'active') return conversations.value.filter(c => c.status === 'active' && c.staff_id)
  return conversations.value
})

const waitingCount = computed(() => conversations.value.filter(c => c.status === 'waiting' || (c.needs_human && !c.staff_id)).length)
const activeCount = computed(() => conversations.value.filter(c => c.status === 'active' && c.staff_id).length)

const loadConversations = async () => {
  try {
    const { data, error } = await supabase
      .from('support_conversations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    conversations.value = data || []
  } catch (error) {
    console.error('Error loading conversations:', error)
  }
}

const selectConversation = async (conversation) => {
  selectedConversation.value = conversation
  await loadMessages(conversation.id)
}

const loadMessages = async (conversationId) => {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    currentMessages.value = data || []
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error loading messages:', error)
  }
}

const takeOverConversation = async () => {
  if (!selectedConversation.value) return

  const staff = userStore.user
  if (!staff?.id) {
    showToast('You must be logged in as admin to take over', 'error')
    return
  }

  try {
    const { error } = await supabase
      .from('support_conversations')
      .update({
        staff_id: staff.id,
        staff_name: staff.name || staff.email,
        status: 'active',
        is_ai: false
      })
      .eq('id', selectedConversation.value.id)

    if (error) throw error

    // Send system message
    await supabase
      .from('support_messages')
      .insert({
        conversation_id: selectedConversation.value.id,
        sender: 'system',
        content: `${staff.name || staff.email} joined the conversation`,
        is_staff: false
      })

    showToast('You are now handling this conversation', 'success')
    await loadConversations()
    await loadMessages(selectedConversation.value.id)
  } catch (error) {
    console.error('Error taking over conversation:', error)
    showToast('Failed to take over conversation', 'error')
  }
}

const sendReply = async () => {
  if (!replyMessage.value.trim() || !selectedConversation.value) return

  const staff = userStore.user
  if (!staff?.id) {
    showToast('You must be logged in as admin to reply', 'error')
    return
  }

  const messageContent = replyMessage.value.trim()
  replyMessage.value = ''

  try {
    const { error } = await supabase
      .from('support_messages')
      .insert({
        conversation_id: selectedConversation.value.id,
        sender: 'staff',
        content: messageContent,
        is_staff: true,
        staff_id: staff.id,
        staff_name: staff.name || staff.email
      })

    if (error) throw error
  } catch (error) {
    console.error('Error sending reply:', error)
    showToast('Failed to send message', 'error')
  }
}

const endConversation = async () => {
  if (!selectedConversation.value) return

  if (!confirm('Are you sure you want to end this conversation? The user will be asked to rate their experience.')) return

  try {
    const staff = userStore.user
    const { error } = await supabase
      .from('support_conversations')
      .update({ status: 'closed' })
      .eq('id', selectedConversation.value.id)

    if (error) throw error

    // Send system message
    await supabase
      .from('support_messages')
      .insert({
        conversation_id: selectedConversation.value.id,
        sender: 'system',
        content: `${staff?.name || staff?.email || 'Staff'} has ended the conversation. If you need further assistance, feel free to start a new chat.`,
        is_staff: false
      })

    showToast('Conversation ended', 'success')
    selectedConversation.value = null
    await loadConversations()
  } catch (error) {
    console.error('Error ending conversation:', error)
    showToast('Failed to end conversation', 'error')
  }
}

const scrollToBottom = () => {
  if (chatMessages.value) {
    setTimeout(() => {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }, 100)
  }
}

const getInitials = (email) => {
  return email.substring(0, 2).toUpperCase()
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return date.toLocaleDateString()
}

const formatFullTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    month: 'short',
    day: 'numeric'
  })
}

const setupRealtimeSubscriptions = () => {
  // Subscribe to conversation changes
  conversationsSubscription = supabase
    .channel('support_conversations')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'support_conversations'
    }, () => {
      loadConversations()
    })
    .subscribe()

  // Subscribe to message changes
  messagesSubscription = supabase
    .channel('support_messages')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'support_messages'
    }, (payload) => {
      if (selectedConversation.value && payload.new.conversation_id === selectedConversation.value.id) {
        currentMessages.value.push(payload.new)
        scrollToBottom()
      }
    })
    .subscribe()
}

onMounted(async () => {
  await loadConversations()
  setupRealtimeSubscriptions()
})

onUnmounted(() => {
  if (conversationsSubscription) {
    supabase.removeChannel(conversationsSubscription)
  }
  if (messagesSubscription) {
    supabase.removeChannel(messagesSubscription)
  }
})

const goBackToDashboard = () => {
  router.push('/admin')
}
</script>
