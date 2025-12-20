/**
 * OpenAI Service
 * Handles AI chat interactions using OpenAI GPT API
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * System prompt for the AI travel advisor
 */
const SYSTEM_PROMPT = `You are Amani, a friendly and knowledgeable AI travel advisor for Merry360X, a Rwanda travel platform.

Your role:
- Help travelers plan trips to Rwanda
- Provide concise, helpful information about accommodations, tours, and transportation
- Keep responses brief (2-4 sentences or short bullet points)
- Always encourage users to browse the website sections for booking
- If you don't know something specific, suggest they contact support

Available services on Merry360X:
- Accommodations: Hotels, lodges, guesthouses ($20-500/night)
- Tours: Gorilla trekking ($1500), safaris ($200-500), cultural tours ($50-150)
- Transport: Airport transfers ($10-40), car rentals ($50-150/day)

Rwanda highlights:
- Very safe, English-speaking, clean country
- Year-round spring weather (15-27°C)
- E-visa available online ($50 for 30 days)
- Best for gorilla trekking, safaris, cultural experiences

Keep responses helpful but brief. Direct users to specific website sections when appropriate.`

/**
 * Chat with OpenAI GPT
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} model - GPT model to use (default: gpt-3.5-turbo)
 * @returns {Promise<string>} - AI response text
 */
export async function chatWithAI(messages, model = 'gpt-3.5-turbo') {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 300, // Keep responses concise
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API request failed')
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.'
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}

/**
 * Get a simple AI response for a single user message
 * @param {string} userMessage - User's message
 * @param {Array} conversationHistory - Previous messages for context (optional)
 * @returns {Promise<string>} - AI response
 */
export async function getAIResponse(userMessage, conversationHistory = []) {
  const messages = [
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage
    }
  ]

  return await chatWithAI(messages)
}

/**
 * Check if OpenAI is properly configured
 * @returns {boolean}
 */
export function isOpenAIConfigured() {
  return !!(OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here')
}

export default {
  chatWithAI,
  getAIResponse,
  isOpenAIConfigured
}
