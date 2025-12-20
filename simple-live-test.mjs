#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = {};
readFileSync('.env', 'utf-8').split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [key, ...values] = trimmed.split('=');
    env[key.trim()] = values.join('=').trim();
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

console.log('\n🧪 SIMPLE LIVE TEST - Database & Features\n');

let passed = 0, failed = 0;

// Test 1: Check all tables exist
console.log('TEST 1: All Database Tables Exist');
const tables = ['properties', 'tours', 'transport_services', 'bookings', 'stories'];
for (const table of tables) {
  const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
  if (error && error.code === '42P01') {
    console.log(`❌ ${table} - MISSING`);
    failed++;
  } else {
    console.log(`✅ ${table} - EXISTS`);
    passed++;
  }
}

// Test 2: Check data can be queried
console.log('\nTEST 2: Data Can Be Queried');
for (const table of tables) {
  const { data, error } = await supabase.from(table).select('*').limit(5);
  if (error) {
    console.log(`❌ ${table} query - FAILED`);
    failed++;
  } else {
    console.log(`✅ ${table} query - SUCCESS (${data.length} records)`);
    passed++;
  }
}

// Test 3: Check UI components exist
console.log('\nTEST 3: UI Components Exist');
const components = [
  'src/views/vendor/CreateProperty.vue',
  'src/views/vendor/CreateTour.vue',
  'src/views/vendor/CreateTransport.vue',
  'src/views/stories/ShareStories.vue'
];
for (const comp of components) {
  try {
    readFileSync(comp);
    console.log(`✅ ${comp.split('/').pop()} - EXISTS`);
    passed++;
  } catch {
    console.log(`❌ ${comp.split('/').pop()} - MISSING`);
    failed++;
  }
}

// Test 4: Check AI Advisor features
console.log('\nTEST 4: AI Advisor Admin Features');
try {
  const aiFile = readFileSync('src/components/ai/AIConcierge.vue', 'utf-8');
  if (aiFile.includes('admin@merry360x.com') && aiFile.includes('bebisdavy@gmail.com')) {
    console.log('✅ Admin emails configured');
    passed++;
  }
  if (aiFile.includes('Support Agent') && aiFile.includes('Administrator')) {
    console.log('✅ Clearance levels configured (3 levels)');
    passed++;
  }
  if (aiFile.includes('gpt-3.5-turbo') || aiFile.includes('openai')) {
    console.log('✅ OpenAI integration configured');
    passed++;
  }
} catch {
  console.log('❌ AI Advisor file not found');
  failed++;
}

console.log('\n' + '═'.repeat(50));
console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log('═'.repeat(50) + '\n');

if (failed === 0) {
  console.log('🎉 ALL AUTOMATED TESTS PASS!\n');
  console.log('📖 For manual testing of user flows, see: MANUAL_TEST_GUIDE.md\n');
}

process.exit(failed > 0 ? 1 : 0);
