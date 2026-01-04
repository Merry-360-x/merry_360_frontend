/*
  This service worker exists only to safely clean up legacy registrations.
  A previous version attempted to cache non-GET requests which throws:
  "Failed to execute 'put' on 'Cache': Request method 'POST' is unsupported".

  Current behavior:
  - Never caches requests.
  - Ignores non-GET fetch events.
  - Clears existing caches and unregisters itself on activate.
*/

const CLEANUP_TRIGGERED_KEY = 'merry360-sw-cleanup-triggered'

self.addEventListener('install', (event) => {
  // Take control ASAP so we can clean up.
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Clear any caches created by older SW versions.
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))

        // Try to unregister so the app returns to normal network behavior.
        // This prevents the old buggy caching strategy from persisting.
        if (self.registration) {
          await self.registration.unregister()
        }

        // Refresh open tabs so they detach from SW control.
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        await Promise.all(
          clients.map((client) => {
            try {
              // Avoid infinite reload loops.
              if (client.url && !client.url.includes(CLEANUP_TRIGGERED_KEY)) {
                const url = new URL(client.url)
                url.searchParams.set(CLEANUP_TRIGGERED_KEY, '1')
                return client.navigate(url.toString())
              }
            } catch {
              // ignore
            }
            return Promise.resolve()
          })
        )
      } finally {
        await self.clients.claim()
      }
    })()
  )
})

self.addEventListener('fetch', (event) => {
  // Never attempt to cache non-GET requests (POST/HEAD/etc.)
  if (event.request.method !== 'GET') return

  // Pass-through network fetch; no Cache API writes.
  event.respondWith(fetch(event.request))
})
