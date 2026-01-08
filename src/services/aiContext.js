/**
 * AI Context Service
 * Fetches real-time data from Supabase to provide AI with current information
 */

import { supabase } from './supabase'

/**
 * Fetch available accommodations from database
 */
export async function getAccommodationsContext() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('id, name, property_type, location, city, price_per_night, bedrooms, bathrooms, max_guests, amenities, images, main_image, available')
      .eq('available', true)
      .limit(20)

    if (error) {
      console.warn('Supabase query error:', error)
      return 'Browse our Accommodations section for available properties.'
    }

    if (!data || data.length === 0) {
      return 'Currently updating our accommodations database. Browse our Accommodations section for the latest listings.'
    }

    // Format for AI context
    const summary = data.map(prop => {
      const amenitiesList = Array.isArray(prop.amenities) ? prop.amenities.slice(0, 3).join(', ') : ''
      const typeLabel = prop.property_type || 'Property'
      const where = prop.city || prop.location || 'Unknown location'
      const price = prop.price_per_night != null ? `$${prop.price_per_night}/night` : 'Price on request'
      const guests = prop.max_guests != null ? `${prop.max_guests} guests` : null

      return `${prop.name} (${typeLabel}) in ${where} - ${price}, ${prop.bedrooms || 0} bed, ${prop.bathrooms || 0} bath${guests ? `, ${guests}` : ''}${amenitiesList ? ` - ${amenitiesList}` : ''}`
    }).join('\n')

    return `Available Accommodations (${data.length} properties):\n${summary}`
  } catch (error) {
    console.error('Error fetching accommodations:', error)
    return 'Accommodations available - please browse our Accommodations section for current listings.'
  }
}

/**
 * Fetch available tours from database
 * NOTE: If tours table doesn't exist yet, returns helpful message
 */
export async function getToursContext() {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('id, name, destination, duration_days, price, available')
      .eq('available', true)
      .limit(15)

    if (error) {
      // Tours table might not exist yet
      console.warn('Tours table query error:', error)
      return 'Explore our Tours section to see available experiences including gorilla trekking, safaris, cultural tours, and more.'
    }

    if (!data || data.length === 0) {
      return 'Browse our Tours section for available experiences.'
    }

    // Format for AI context
    const summary = data.map(tour => {
      const name = tour.name || 'Tour'
      const destination = tour.destination || 'Rwanda'
      const days = tour.duration_days ? `${tour.duration_days} day${tour.duration_days === 1 ? '' : 's'}` : ''
      const price = tour.price != null ? `$${tour.price}` : ''
      return `${name} (${destination}) ${days} ${price}`.replace(/\s+/g, ' ').trim()
    }).join('\n')

    return `Available Tours (${data.length} tours):\n${summary}`
  } catch (error) {
    console.error('Error fetching tours:', error)
    return 'Visit our Tours section for gorilla trekking, safaris, cultural experiences, and more.'
  }
}

/**
 * Fetch available transport options from database
 */
export async function getTransportContext() {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('id, name, type, capacity, price_per_day, available')
      .eq('available', true)
      .limit(15)

    if (error) {
      console.warn('Vehicles table query error:', error)
      return 'Check our Transport section for airport transfers, car rentals, and private drivers.'
    }

    if (!data || data.length === 0) {
      return 'Browse our Transport section for available services.'
    }

    // Format for AI context
    const summary = data.map(vehicle => 
      `${vehicle.name}: ${vehicle.type} (Capacity: ${vehicle.capacity}, $${vehicle.price_per_day}/day)`
    ).join('\n')

    return `Available Transport (${data.length} vehicles):\n${summary}`
  } catch (error) {
    console.error('Error fetching transport:', error)
    return 'Visit our Transport section for airport transfers, car rentals, and more.'
  }
}

/**
 * Get comprehensive context for AI about current Merry360X offerings
 */
export async function getMerry360XContext() {
  try {
    const [accommodations, tours, transport] = await Promise.all([
      getAccommodationsContext(),
      getToursContext(),
      getTransportContext()
    ])

    return {
      accommodations,
      tours,
      transport,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching Merry360X context:', error)
    return {
      accommodations: 'Browse our Accommodations section for available properties.',
      tours: 'Browse our Tours section for available experiences.',
      transport: 'Browse our Transport section for available services.',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Format context for AI system prompt
 */
export function formatContextForAI(context) {
  return `
CURRENT MERRY360X OFFERINGS (Updated: ${new Date(context.timestamp).toLocaleString()}):

${context.accommodations}

${context.tours}

${context.transport}

Use this real-time data to answer questions about availability and current offerings.
If asked about specific properties/tours, reference the above list.
If something isn't listed above, guide users to browse the website sections.
`
}

export default {
  getAccommodationsContext,
  getToursContext,
  getTransportContext,
  getMerry360XContext,
  formatContextForAI
}
