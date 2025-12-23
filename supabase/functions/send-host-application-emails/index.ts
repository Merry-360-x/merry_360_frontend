// Supabase Edge Function: send-host-application-emails
// Sends:
//  1) confirmation email to the applicant
//  2) notification email to admin
//
// Configure secrets in Supabase:
//   supabase secrets set BREVO_API_KEY=... ADMIN_NOTIFICATION_EMAIL=... FROM_EMAIL=... [FROM_NAME=...]
//
// Body:
// {
//   applicantEmail: string,
//   applicantName?: string,
//   applicantId?: string,
//   appliedAt?: string,
//   siteUrl?: string
// }

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

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

async function sendBrevoEmail(payload: {
  sender: { name?: string; email: string }
  to: Array<{ email: string; name?: string }>
  subject: string
  htmlContent: string
}) {
  const apiKey = Deno.env.get('BREVO_API_KEY')
  if (!apiKey) {
    throw new Error('Missing BREVO_API_KEY')
  }

  const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const text = await resp.text()
  if (!resp.ok) {
    throw new Error(`Brevo error (${resp.status}): ${text}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    return { ok: true, raw: text }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const fromEmail = Deno.env.get('FROM_EMAIL')
    const fromName = Deno.env.get('FROM_NAME') || undefined
    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL')

    if (!fromEmail) {
      return json({ error: 'Missing FROM_EMAIL secret' }, { status: 500 })
    }
    if (!adminEmail) {
      return json({ error: 'Missing ADMIN_NOTIFICATION_EMAIL secret' }, { status: 500 })
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const applicantEmail = (body as any).applicantEmail
    const applicantName = (body as any).applicantName || ''
    const applicantId = (body as any).applicantId || ''
    const appliedAt = (body as any).appliedAt || new Date().toISOString()
    const siteUrl = (body as any).siteUrl || req.headers.get('origin') || ''

    if (!applicantEmail || typeof applicantEmail !== 'string') {
      return json({ error: 'applicantEmail is required' }, { status: 400 })
    }

    const safeName = applicantName && typeof applicantName === 'string' ? applicantName : ''
    const adminLink = siteUrl ? `${siteUrl.replace(/\/$/, '')}/admin/host-applications` : ''

    const hostSubject = 'Merry360: Host application received'
    const hostHtml = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">We received your host application</h2>
        <p style="margin: 0 0 12px;">Hi${safeName ? ` ${safeName}` : ''},</p>
        <p style="margin: 0 0 12px;">Your application to become a host on Merry360 was submitted successfully.</p>
        <p style="margin: 0 0 12px;">Our team will review it and notify you once it’s approved or rejected.</p>
        <p style="margin: 0; color: #555; font-size: 13px;">Submitted at: ${appliedAt}</p>
      </div>
    `

    const adminSubject = 'New Host Application (Merry360)'
    const adminHtml = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">New host application submitted</h2>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${applicantEmail}</p>
        ${safeName ? `<p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>` : ''}
        ${applicantId ? `<p style="margin: 0 0 8px;"><strong>User ID:</strong> ${applicantId}</p>` : ''}
        <p style="margin: 0 0 12px;"><strong>Applied at:</strong> ${appliedAt}</p>
        ${adminLink ? `<p style="margin: 0;"><a href="${adminLink}">Open Admin → Host Applications</a></p>` : ''}
      </div>
    `

    const [hostResult, adminResult] = await Promise.all([
      sendBrevoEmail({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: applicantEmail }],
        subject: hostSubject,
        htmlContent: hostHtml
      }),
      sendBrevoEmail({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: adminEmail }],
        subject: adminSubject,
        htmlContent: adminHtml
      })
    ])

    return json({ ok: true, hostResult, adminResult })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return json({ ok: false, error: message }, { status: 500 })
  }
})
