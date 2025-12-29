/**
 * Flutterwave checkout (frontend)
 *
 * Uses Flutterwave Inline (https://checkout.flutterwave.com/v3.js)
 * Requires: VITE_FLUTTERWAVE_PUBLIC_KEY
 */

const FLUTTERWAVE_SCRIPT_URL = 'https://checkout.flutterwave.com/v3.js'

let scriptLoadingPromise = null

function loadFlutterwaveScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser only'))
  if (window.FlutterwaveCheckout) return Promise.resolve()

  if (scriptLoadingPromise) return scriptLoadingPromise

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${FLUTTERWAVE_SCRIPT_URL}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Flutterwave script')))
      return
    }

    const script = document.createElement('script')
    script.src = FLUTTERWAVE_SCRIPT_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Flutterwave script'))
    document.head.appendChild(script)
  })

  return scriptLoadingPromise
}

function randomTxRef(prefix = 'MERRY360') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

/**
 * Start a Flutterwave payment.
 *
 * NOTE: Proper verification should be done server-side with the secret key.
 */
export async function startFlutterwavePayment({
  amount,
  currency,
  customer,
  title = 'Merry 360 Payment',
  description = 'Booking payment',
  txRef,
  meta = {}
}) {
  const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY

  if (!publicKey || publicKey.length < 10) {
    throw new Error('Flutterwave public key missing (VITE_FLUTTERWAVE_PUBLIC_KEY)')
  }

  await loadFlutterwaveScript()

  const finalTxRef = txRef || randomTxRef()

  return await new Promise((resolve, reject) => {
    try {
      const checkout = window.FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: finalTxRef,
        amount,
        currency,
        payment_options: 'card,mobilemoney,ussd,banktransfer',
        customer: {
          email: customer?.email || 'guest@merry360.com',
          phonenumber: customer?.phone || '',
          name: customer?.name || 'Guest'
        },
        customizations: {
          title,
          description
        },
        meta,
        callback: (response) => {
          // response.status is commonly "successful" when user completes payment
          resolve({ txRef: finalTxRef, response })
          if (checkout?.close) checkout.close()
        },
        onclose: () => {
          // User closed without completing payment
          reject(new Error('Payment cancelled'))
        }
      })

      if (!checkout) {
        reject(new Error('Failed to start Flutterwave checkout'))
      }
    } catch (err) {
      reject(err)
    }
  })
}
