/**
 * Firebase Compatibility Shim (Supabase-only project)
 *
 * This project has migrated off Firebase. This file intentionally contains
 * no Firebase SDK imports so builds work without the firebase package.
 *
 * If something still imports from '@/services/firebase', it will use Supabase.
 */

import { supabase } from './supabase'

export function initFirebase() {
  // No-op for backwards compatibility
  return {}
}

// Auth helpers (map to Supabase)
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return { user: data.user, session: data.session }
}

export async function googleSignIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  })
  if (error) throw error
  if (data?.url) window.location.href = data.url
  return data
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function onAuthChange(cb) {
  return supabase.auth.onAuthStateChange((_event, session) => cb(session?.user || null))
}

// Messaging helpers (simple messages table)
export async function createMessage(conversationId, message) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('messages')
    .insert([{ conversation_id: conversationId, sender_id: user.id, content: message.text }])
    .select()
    .single()

  if (error) throw error
  return data
}

export function listenToMessages(conversationId, cb) {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

        if (!error) cb(data || [])
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Storage helpers: not supported here (use Cloudinary/Supabase Storage)
export async function uploadFileToStorage() {
  throw new Error('Firebase storage is not available. Use Cloudinary or Supabase Storage.')
}

export async function setUserProfile(uid, data) {
  const { error } = await supabase.from('profiles').upsert({ id: uid, ...data }, { onConflict: 'id' })
  if (error) throw error
  return true
}

export async function getUserProfile(uid) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single()
  if (error) throw error
  return data
}

export default {
  initFirebase,
  signUpWithEmail,
  signInWithEmail,
  googleSignIn,
  signOutUser,
  onAuthChange,
  createMessage,
  listenToMessages,
  uploadFileToStorage,
  setUserProfile,
  getUserProfile
}
