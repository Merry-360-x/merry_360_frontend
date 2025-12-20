<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8 max-w-6xl">
      <h1 class="text-2xl font-bold mb-4">Messages</h1>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Conversations list -->
        <div class="col-span-1 bg-white border border-gray-200 rounded-xl p-4">
          <div class="font-semibold mb-3">Conversations</div>
          <div v-if="conversations.length === 0" class="text-sm text-gray-500 py-4">
            You don't have any conversations yet. Messages from hosts and vendors will appear here.
          </div>
          <div v-else>
            <div
              v-for="conv in conversations"
              :key="conv.id"
              class="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
              @click="selectConversation(conv)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-medium">{{ conv.with }}</div>
                  <div class="text-xs text-gray-500">{{ conv.lastMessage }}</div>
                </div>
                <div class="text-xs text-gray-400">{{ conv.updatedAt }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div class="col-span-2 bg-white border border-gray-200 rounded-xl p-4 flex flex-col">
          <div class="flex-1 overflow-y-auto p-4 space-y-3" ref="messagesContainer">
            <div v-if="selectedConversation === null" class="text-center text-gray-400">Select a conversation to start</div>
            <div v-else>
              <div v-for="(msg, index) in messages" :key="msg.id || index" class="mb-2">
                <div class="text-xs text-gray-500">{{ msg.from }} · {{ formatDate(msg.createdAt) }}</div>
                <div class="mt-2 bg-gray-100 p-3 rounded-md max-w-xl">{{ msg.text }}</div>
              </div>
            </div>
          </div>

          <div class="pt-3">
            <form @submit.prevent="sendMessage">
              <div class="flex gap-2">
                <input v-model="newMessage" placeholder="Type a message..." class="flex-1 px-4 py-3 border border-gray-200 rounded-button bg-white focus:outline-none" />
                <button class="px-4 py-2 bg-brand-500 text-white rounded-lg">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import MainLayout from '../../components/layout/MainLayout.vue'
import { useUserStore } from '../../stores/userStore'
import * as supabaseService from '../../services/supabase'
import { initFirebase, createMessage as createFirestoreMessage, listenToMessages as listenFirestoreMessages } from '../../services/firebase'

const userStore = useUserStore()
const useSupabase = import.meta.env.VITE_USE_SUPABASE === 'true'

const conversations = ref([])

const selectedConversation = ref(null)
const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)

onMounted(async () => {
  // Initialize Firebase if configured
  if (!useSupabase) {
    try {
      initFirebase()
    } catch (err) {
      console.warn('Firebase not initialized:', err.message)
    }
  }
})

const selectConversation = async (conv) => {
  selectedConversation.value = conv
  messages.value = []

  if (useSupabase) {
    // Listen via Supabase real-time
    try {
      supabaseService.listenToMessages(conv.id, (payload) => {
        if (payload.eventType === 'INSERT') {
          messages.value.push({
            id: payload.new.id,
            from: 'User',
            text: payload.new.content,
            createdAt: payload.new.created_at
          })
          scrollToBottom()
        }
      })
      // Load initial messages
      const msgs = await supabaseService.getConversationMessages(conv.id)
      messages.value = msgs.map(m => ({
        id: m.id,
        from: 'User',
        text: m.content,
        createdAt: m.created_at
      })).reverse()
      scrollToBottom()
    } catch (err) {
      console.error('Supabase messaging error:', err)
      showLocalMessages()
    }
  } else {
    // Fallback to Firebase or local
    try {
      const unsubscribe = listenFirestoreMessages(conv.id, (msgs) => {
        messages.value = msgs
        scrollToBottom()
      })
      conv.unsubscribe = unsubscribe
    } catch (err) {
      console.warn('Firestore not configured; showing local messages')
      showLocalMessages()
    }
  }
}

function showLocalMessages() {
  messages.value = []
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  if (!selectedConversation.value) return alert('Select a conversation first')

  const message = {
    from: userStore.user?.name || 'Guest',
    text: newMessage.value.trim(),
    createdAt: new Date().toISOString()
  }

  try {
    if (useSupabase) {
      const userId = userStore.user?.id || 'guest'
      await supabaseService.createMessage(
        selectedConversation.value.id,
        userId,
        message.text
      )
    } else {
      await createFirestoreMessage(selectedConversation.value.id, message)
    }
    newMessage.value = ''
  } catch (err) {
    console.error('Send message error:', err)
    // Fallback to local echo
    messages.value.push({ ...message, id: Date.now() })
    newMessage.value = ''
  }
}

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch (err) {
    return iso
  }
}

</script>
