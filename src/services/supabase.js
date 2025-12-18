/**
 * Supabase Service
 * Handles authentication, database, realtime, and storage operations
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============ Auth ============
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function googleSignIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  if (error) throw error
  
  // Redirect to Google OAuth URL
  if (data?.url) {
    window.location.href = data.url
  }
  
  return data
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null
    callback(user ? {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.firstName || '',
      lastName: user.user_metadata?.lastName || '',
      displayName: user.user_metadata?.displayName || user.email,
      phone: user.user_metadata?.phone || null,
      avatar: user.user_metadata?.avatar || null
    } : null)
  })
}

// ============ User Profile ============
export async function setUserProfile(userId, profile) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile }, { onConflict: 'id' })
  if (error) throw error
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

// ============ Messaging (Real-time) ============
export async function createMessage(conversationId, senderId, content, attachmentUrl = null) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      attachment_url: attachmentUrl,
      created_at: new Date().toISOString()
    }])
    .select()
  if (error) throw error
  return data[0]
}

export function listenToMessages(conversationId, callback) {
  const subscription = supabase
    .channel(`messages:conversation_${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return subscription
}

export async function getConversationMessages(conversationId, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getOrCreateConversation(participantIds) {
  // Sort IDs to ensure consistency
  const sorted = participantIds.sort()
  const conversationKey = sorted.join('_')

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('participant_key', conversationKey)
    .single()

  if (error && error.code !== 'PGRST116') throw error

  if (data) return data

  // Create new conversation
  const { data: newConv, error: createError } = await supabase
    .from('conversations')
    .insert([{ participant_key: conversationKey, participants: participantIds }])
    .select()
    .single()

  if (createError) throw createError
  return newConv
}

export function listenToConversations(userId, callback) {
  const subscription = supabase
    .channel(`conversations:user_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `participants.cs.{"${userId}"}`
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return subscription
}

// ============ Storage (File Upload) ============
export async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })
  if (error) throw error
  return data
}

export function getFileUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(bucket, path) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  if (error) throw error
}

// ============ Bookings ============
export async function createBooking(bookingData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
  if (error) throw error
  return data[0]
}

export async function getMyBookings(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getBookingById(bookingId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()
  if (error) throw error
  return data
}

export async function updateBooking(bookingId, updates) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
  if (error) throw error
  return data[0]
}

// ============ Payments ============
export async function createPaymentRecord(bookingId, amount, currency, status = 'pending') {
  const { data, error } = await supabase
    .from('payments')
    .insert([{ booking_id: bookingId, amount, currency, status }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updatePaymentStatus(paymentId, status) {
  const { data, error } = await supabase
    .from('payments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', paymentId)
    .select()
  if (error) throw error
  return data[0]
}

export default {
  supabase,
  signUpWithEmail,
  signInWithEmail,
  googleSignIn,
  signOutUser,
  onAuthChange,
  setUserProfile,
  getUserProfile,
  createMessage,
  listenToMessages,
  getConversationMessages,
  getOrCreateConversation,
  listenToConversations,
  uploadFile,
  getFileUrl,
  deleteFile,
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  createPaymentRecord,
  updatePaymentStatus
}
