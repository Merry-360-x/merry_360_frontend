/**
 * OpenAI Service
 * Handles AI chat interactions using OpenAI GPT API with real-time Supabase data
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * Base system prompt for the AI travel advisor
 */
const BASE_SYSTEM_PROMPT = `You are Amani, a friendly and knowledgeable AI travel advisor for Merry360X, a Rwanda travel platform.

Your role:
- Help travelers plan trips to Rwanda
- Provide accurate information based on CURRENT OFFERINGS data provided below
- Keep responses brief (2-4 sentences or short bullet points)
- Reference actual property/tour names from the data when possible
- Always encourage users to browse the website sections for booking
- If you don't know something specific, suggest they contact support via "Talk to Support"

Rwanda highlights:
- Very safe, English-speaking, clean country
- Year-round spring weather (15-27°C)
- E-visa available online ($50 for 30 days)
- Best for gorilla trekking, safaris, cultural experiences

Keep responses helpful but brief. Use the real-time data below to give accurate answers.`

/**
 * Chat with OpenAI GPT
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} systemPrompt - Full system prompt including real-time data
 * @param {string} model - GPT model to use (default: gpt-3.5-turbo)
 * @returns {Promise<string>} - AI response text
 */
export async function chatWithAI(messages, systemPrompt = BASE_SYSTEM_PROMPT, model = 'gpt-3.5-turbo') {
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
            content: systemPrompt
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
 * @param {string} dynamicContext - Real-time data context to include (optional)
 * @returns {Promise<string>} - AI response
 */
export async function getAIResponse(userMessage, conversationHistory = [], dynamicContext = '') {
  const messages = [
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage
    }
  ]

  // Build system prompt with dynamic context if provided
  const systemPrompt = dynamicContext 
    ? `${BASE_SYSTEM_PROMPT}\n\n${dynamicContext}`
    : BASE_SYSTEM_PROMPT

  return await chatWithAI(messages, systemPrompt)
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
  isOpenAIConfigured,
  BASE_SYSTEM_PROMPT
}
