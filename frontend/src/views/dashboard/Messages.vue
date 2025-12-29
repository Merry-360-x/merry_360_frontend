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
import { supabase } from '../../services/supabase'
import * as supabaseApi from '../../services/supabaseApi'

const userStore = useUserStore()
const useSupabase = true

const conversations = ref([])

const selectedConversation = ref(null)
const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)

let messagesChannel = null

onMounted(async () => {
  await loadConversations()
})

async function loadConversations() {
  try {
    const userId = userStore.user?.id
    if (!userId) {
      conversations.value = []
      return
    }

    const rows = await supabaseApi.getUserConversations(userId)
    // Group by conversation_id, keep latest message per conversation
    const byConversation = new Map()
    for (const msg of rows || []) {
      const key = msg.conversation_id
      if (!key) continue
      if (!byConversation.has(key)) byConversation.set(key, msg)
    }

    const convs = Array.from(byConversation.values())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((msg) => {
        const other = (msg.sender?.id === userId) ? msg.receiver : msg.sender
        const otherName = other ? `${other.first_name || ''} ${other.last_name || ''}`.trim() : 'Unknown'

        return {
          id: msg.conversation_id,
          with: otherName || 'Unknown',
          lastMessage: msg.content || '',
          updatedAt: msg.created_at ? new Date(msg.created_at).toLocaleDateString() : '',
          otherUserId: other?.id || null
        }
      })

    conversations.value = convs
  } catch (err) {
    console.error('Failed to load conversations:', err)
    conversations.value = []
  }
}

const selectConversation = async (conv) => {
  selectedConversation.value = conv
  messages.value = []

  // Clean up any existing realtime subscription
  try {
    if (messagesChannel) {
      await supabase.removeChannel(messagesChannel)
      messagesChannel = null
    }
  } catch (err) {
    // ignore
  }

  if (useSupabase) {
    try {
      // Load initial messages
      const { data: initial, error } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, content, created_at')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      const userId = userStore.user?.id
      messages.value = (initial || []).map((m) => ({
        id: m.id,
        from: m.sender_id === userId ? (userStore.user?.name || 'You') : conv.with,
        text: m.content,
        createdAt: m.created_at
      }))

      // Subscribe to new messages
      messagesChannel = supabase
        .channel(`messages:${conv.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conv.id}` },
          (payload) => {
            const row = payload.new
            messages.value.push({
              id: row.id,
              from: row.sender_id === userId ? (userStore.user?.name || 'You') : conv.with,
              text: row.content,
              createdAt: row.created_at
            })
            scrollToBottom()
          }
        )
        .subscribe()

      scrollToBottom()
    } catch (err) {
      console.error('Supabase messaging error:', err)
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
      const receiverId = selectedConversation.value.otherUserId
      if (!receiverId) throw new Error('Missing conversation recipient')

      await supabaseApi.sendMessage(receiverId, message.text, null, selectedConversation.value.id)
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
