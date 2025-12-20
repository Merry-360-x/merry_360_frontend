/**
 * Test AI-Supabase Integration
 * Run this to verify the AI can fetch and use real-time data
 */

import { getMerry360XContext, formatContextForAI } from './src/services/aiContext.js'

console.log('🧪 Testing AI-Supabase Integration...\n')

async function testIntegration() {
  try {
    console.log('1️⃣ Fetching real-time data from Supabase...')
    const context = await getMerry360XContext()
    
    console.log('\n✅ Context fetched successfully!')
    console.log('\n📊 Data Retrieved:')
    console.log('─'.repeat(60))
    console.log('\n🏠 ACCOMMODATIONS:')
    console.log(context.accommodations)
    console.log('\n🎯 TOURS:')
    console.log(context.tours)
    console.log('\n🚗 TRANSPORT:')
    console.log(context.transport)
    console.log('\n─'.repeat(60))
    
    console.log('\n2️⃣ Formatting context for AI...')
    const formattedContext = formatContextForAI(context)
    
    console.log('\n✅ Context formatted!')
    console.log('\n📝 AI System Prompt Context:')
    console.log('─'.repeat(60))
    console.log(formattedContext)
    console.log('─'.repeat(60))
    
    console.log('\n✨ SUCCESS! Integration working correctly.')
    console.log('\nNext steps:')
    console.log('1. Open http://localhost:5174/')
    console.log('2. Click the AI Advisor icon')
    console.log('3. Ask: "What accommodations are available?"')
    console.log('4. AI will respond with REAL data from Supabase!')
    
  } catch (error) {
    console.error('\n❌ Error testing integration:', error)
    console.log('\nPossible issues:')
    console.log('- Supabase credentials not configured')
    console.log('- Properties table empty or doesn\'t exist')
    console.log('- Network connection issue')
  }
}

testIntegration()
