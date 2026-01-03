// Supabase Edge Function: send-booking-emails
// Sends:
//  1) confirmation email to the customer
//  2) notification email to admin
//
// Configure secrets in Supabase:
//   supabase secrets set BREVO_API_KEY=... ADMIN_NOTIFICATION_EMAIL=... FROM_EMAIL=... [FROM_NAME=...]
//
// Body:
// {
//   bookingId: string,
//   customerEmail: string,
//   customerName: string,
//   propertyName: string,
//   checkIn: string,
//   checkOut: string,
//   guests: number,
//   totalPrice: number,
//   currency: string,
//   bookingStatus: string,
//   specialRequests?: string,
//   phone?: string
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
    const fromName = Deno.env.get('FROM_NAME') || 'Merry360'
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

    const {
      bookingId,
      customerEmail,
      customerName,
      propertyName,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      currency,
      bookingStatus,
      specialRequests,
      phone
    } = body as any

    if (!bookingId || !customerEmail) {
      return json({ error: 'bookingId and customerEmail are required' }, { status: 400 })
    }

    const formatDate = (dateStr: string) => {
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return dateStr
      }
    }

    const formatCurrency = (amount: number, curr: string) => {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: curr || 'USD'
        }).format(amount)
      } catch {
        return `${curr} ${amount}`
      }
    }

    // Customer confirmation email
    const customerSubject = `Booking Confirmation #${bookingId} - ${propertyName}`
    const customerHtml = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
          <p style="color: #ffffff; margin: 10px 0 0; opacity: 0.9;">Thank you for choosing Merry360</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 20px;">
          <p style="margin: 0 0 20px; font-size: 16px; color: #333;">Hi ${customerName || 'there'},</p>
          <p style="margin: 0 0 30px; font-size: 16px; color: #555; line-height: 1.6;">
            Your booking has been ${bookingStatus === 'confirmed' ? 'confirmed' : 'received'}! 
            We're excited to host you at <strong>${propertyName || 'our property'}</strong>.
          </p>
          
          <!-- Booking Details Card -->
          <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; margin: 30px 0;">
            <h2 style="margin: 0 0 20px; font-size: 20px; color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
              📋 Booking Details
            </h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Booking ID:</td>
                <td style="padding: 12px 0; color: #333; font-weight: 600; text-align: right;">#${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Property:</td>
                <td style="padding: 12px 0; color: #333; font-weight: 600; text-align: right;">${propertyName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Check-in:</td>
                <td style="padding: 12px 0; color: #333; font-weight: 600; text-align: right;">${checkIn ? formatDate(checkIn) : 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Check-out:</td>
                <td style="padding: 12px 0; color: #333; font-weight: 600; text-align: right;">${checkOut ? formatDate(checkOut) : 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Guests:</td>
                <td style="padding: 12px 0; color: #333; font-weight: 600; text-align: right;">${guests || 1} ${guests > 1 ? 'guests' : 'guest'}</td>
              </tr>
              <tr style="border-top: 2px solid #dee2e6;">
                <td style="padding: 20px 0 0; color: #667eea; font-size: 16px; font-weight: 700;">Total Amount:</td>
                <td style="padding: 20px 0 0; color: #667eea; font-weight: 700; text-align: right; font-size: 20px;">${formatCurrency(totalPrice, currency)}</td>
              </tr>
            </table>
            
            ${specialRequests ? `
              <div style="margin-top: 25px; padding: 20px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 6px;">
                <p style="margin: 0 0 8px; font-weight: 700; color: #856404; font-size: 14px;">📝 Special Requests:</p>
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">${specialRequests}</p>
              </div>
            ` : ''}
          </div>
          
          <!-- Status Badge -->
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 12px 30px; background: ${bookingStatus === 'confirmed' ? '#28a745' : '#ffc107'}; color: ${bookingStatus === 'confirmed' ? '#ffffff' : '#333'}; border-radius: 25px; font-weight: 700; font-size: 14px; text-transform: uppercase;">
              ${bookingStatus === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
            </span>
          </div>
          
          <!-- What's Next -->
          <div style="margin: 30px 0;">
            <h3 style="margin: 0 0 15px; font-size: 18px; color: #333;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
              <li>You'll receive a reminder email before your check-in date</li>
              <li>Keep your booking ID handy for check-in</li>
              <li>If you have any questions, feel free to contact us</li>
            </ul>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #999; font-size: 13px;">
            <p style="margin: 0 0 10px;">Need help? Contact us at <a href="mailto:${fromEmail}" style="color: #667eea; text-decoration: none;">${fromEmail}</a></p>
            <p style="margin: 0;">© ${new Date().getFullYear()} Merry360. All rights reserved.</p>
          </div>
        </div>
      </div>
    `

    // Admin notification email
    const adminSubject = `New Booking #${bookingId} - ${propertyName}`
    const adminHtml = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a1a; padding: 20px; color: #ffffff;">
          <h2 style="margin: 0;">🎉 New Booking Received</h2>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <p style="margin: 0 0 20px; font-size: 16px; color: #333;">A new booking has been placed on Merry360:</p>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px; color: #667eea;">Booking Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Booking ID:</td>
                <td style="padding: 8px 0; font-weight: 600;">#${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Property:</td>
                <td style="padding: 8px 0; font-weight: 600;">${propertyName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Status:</td>
                <td style="padding: 8px 0; font-weight: 600;">
                  <span style="padding: 4px 12px; background: ${bookingStatus === 'confirmed' ? '#28a745' : '#ffc107'}; color: ${bookingStatus === 'confirmed' ? '#fff' : '#333'}; border-radius: 12px; font-size: 12px;">${bookingStatus?.toUpperCase()}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Total Amount:</td>
                <td style="padding: 8px 0; font-weight: 700; color: #667eea; font-size: 18px;">${formatCurrency(totalPrice, currency)}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e3f2fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px; color: #1976d2;">Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Name:</td>
                <td style="padding: 8px 0; font-weight: 600;">${customerName || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${customerEmail}" style="color: #1976d2; text-decoration: none;">${customerEmail}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 8px 0; color: #666;">Phone:</td>
                <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #1976d2; text-decoration: none;">${phone}</a></td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #666;">Check-in:</td>
                <td style="padding: 8px 0; font-weight: 600;">${checkIn ? formatDate(checkIn) : 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Check-out:</td>
                <td style="padding: 8px 0; font-weight: 600;">${checkOut ? formatDate(checkOut) : 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Guests:</td>
                <td style="padding: 8px 0; font-weight: 600;">${guests || 1}</td>
              </tr>
            </table>
            
            ${specialRequests ? `
              <div style="margin-top: 15px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-weight: 700; color: #856404;">Special Requests:</p>
                <p style="margin: 0; color: #856404;">${specialRequests}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${req.headers.get('origin') || ''}/admin/bookings" style="display: inline-block; padding: 12px 30px; background: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
              View in Admin Panel
            </a>
          </div>
          
          <p style="margin: 30px 0 0; padding-top: 20px; border-top: 1px solid #dee2e6; color: #999; font-size: 12px; text-align: center;">
            This is an automated notification from Merry360
          </p>
        </div>
      </div>
    `

    // Send both emails
    const results = await Promise.allSettled([
      sendBrevoEmail({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: customerEmail, name: customerName || undefined }],
        subject: customerSubject,
        htmlContent: customerHtml
      }),
      sendBrevoEmail({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: adminEmail }],
        subject: adminSubject,
        htmlContent: adminHtml
      })
    ])

    const customerResult = results[0]
    const adminResult = results[1]

    return json({
      success: true,
      customerEmail: customerResult.status === 'fulfilled' ? 'sent' : 'failed',
      adminEmail: adminResult.status === 'fulfilled' ? 'sent' : 'failed',
      customerError: customerResult.status === 'rejected' ? customerResult.reason.message : null,
      adminError: adminResult.status === 'rejected' ? adminResult.reason.message : null
    })

  } catch (error: any) {
    console.error('Function error:', error)
    return json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
})
