// Supabase Edge Function: create-staff-user
// Creates a new Supabase Auth user (email+password) and assigns profile role = 'staff'.
// Only callable by an authenticated admin.
//
// Configure secrets in Supabase (Supabase CLI blocks SUPABASE_* secret names):
//   supabase secrets set SB_URL=... SB_SERVICE_ROLE_KEY=...
//
// Body:
// {
//   email: string,
//   password: string,
//   firstName?: string,
//   lastName?: string
// }

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      ...corsHeaders,
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers ?? {})
    },
    ...init
  })
}

function getBearerToken(req: Request) {
  const auth = req.headers.get('authorization') || ''
  const match = auth.match(/^Bearer\s+(.+)$/i)
  return match?.[1] || ''
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const supabaseUrl = Deno.env.get('SB_URL') || Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SB_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: 'Missing SB_URL / SB_SERVICE_ROLE_KEY' }, { status: 500 })
    }

    const token = getBearerToken(req)
    if (!token) {
      return json({ error: 'Missing Authorization token' }, { status: 401 })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    })

    // Validate caller
    const { data: callerData, error: callerError } = await adminClient.auth.getUser(token)
    if (callerError || !callerData?.user) {
      return json({ error: 'Invalid session' }, { status: 401 })
    }

    const callerId = callerData.user.id
    const { data: callerProfile, error: profileError } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', callerId)
      .single()

    if (profileError) {
      return json({ error: 'Failed to verify admin profile' }, { status: 403 })
    }

    if (callerProfile?.role !== 'admin') {
      return json({ error: 'Admin privileges required' }, { status: 403 })
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const email = (body as any).email
    const password = (body as any).password
    const firstName = (body as any).firstName || ''
    const lastName = (body as any).lastName || ''

    if (!email || typeof email !== 'string') {
      return json({ error: 'email is required' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return json({ error: 'password must be at least 6 characters' }, { status: 400 })
    }

    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'staff',
        firstName,
        lastName
      }
    })

    if (createError || !created.user) {
      return json({ error: createError?.message || 'Failed to create user' }, { status: 400 })
    }

    const staffUserId = created.user.id

    // Ensure profile exists and is marked as staff
    const { error: upsertError } = await adminClient
      .from('profiles')
      .upsert(
        {
          id: staffUserId,
          first_name: firstName,
          last_name: lastName,
          role: 'staff',
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      )

    if (upsertError) {
      return json({ error: upsertError.message || 'Failed to create staff profile' }, { status: 500 })
    }

    return json({
      ok: true,
      staffUser: { id: staffUserId, email: created.user.email }
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return json({ ok: false, error: message }, { status: 500 })
  }
})
