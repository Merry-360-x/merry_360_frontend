/**
 * Supabase Service
 * Handles authentication, database, realtime, and storage operations
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
}

console.log('✅ Supabase initialized:', supabaseUrl)

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============ Auth ============
export async function signUpWithEmail(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: metadata  // This will be available in raw_user_meta_data
    }
  })
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
  
  // Supabase OAuth returns a URL to redirect to
  if (data?.url) {
    window.location.href = data.url
  }
  
  return data
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}

// Alias for compatibility
export const onAuthChange = onAuthStateChange

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ============ Profile ============
export async function setUserProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates }, { onConflict: 'id' })
  if (error) throw error
}

export async function updateUserProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
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

// ============ Listings ============
export async function getListings(filters = {}) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .match(filters)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// ============ Bookings ============
export async function createBooking(bookingData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getBookings(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, listings(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// ============ Realtime ============
export function subscribeToListings(callback) {
  const subscription = supabase
    .channel('listings')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'listings' },
      callback
    )
    .subscribe()
  
  return subscription
}

// ============ Storage ============
export async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  if (error) throw error
  return data
}

export function getPublicUrl(bucket, path) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// ============ Database Queries ============
export async function query(table, options = {}) {
  let query = supabase.from(table).select(options.select || '*')
  
  if (options.eq) {
    Object.entries(options.eq).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }
  
  if (options.order) {
    query = query.order(options.order.column, { ascending: options.order.ascending ?? true })
  }
  
  if (options.limit) {
    query = query.limit(options.limit)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function insert(table, data) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
  
  if (error) throw error
  return result
}

export async function update(table, id, data) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return result
}

export async function remove(table, id) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ============ RPC (Remote Procedure Calls) ============
export async function callFunction(functionName, params = {}) {
  const { data, error } = await supabase.rpc(functionName, params)
  if (error) throw error
  return data
}

// ============ Utilities ============
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here')
}

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    if (error) throw error
    return { success: true, message: 'Connected to Supabase successfully' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

export default supabase
