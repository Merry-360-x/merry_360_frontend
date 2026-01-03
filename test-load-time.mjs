/**
 * Performance testing script
 * Tests actual page load times including API calls
 */

const testUrls = [
  'https://merry-360-frontend-3wa1g3zy9-das-48ca2629.vercel.app/',
  'https://merry-360-frontend-3wa1g3zy9-das-48ca2629.vercel.app/accommodations'
];

async function measurePageLoad(url) {
  console.log(`\n📊 Testing: ${url}`);
  
  const start = performance.now();
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const end = performance.now();
    
    const loadTime = (end - start).toFixed(2);
    console.log(`✅ Initial load: ${loadTime}ms`);
    
    // Test subsequent load (cached)
    const cacheStart = performance.now();
    const cached = await fetch(url);
    await cached.text();
    const cacheEnd = performance.now();
    
    const cacheTime = (cacheEnd - cacheStart).toFixed(2);
    console.log(`⚡ Cached load: ${cacheTime}ms`);
    
    return { url, loadTime: parseFloat(loadTime), cacheTime: parseFloat(cacheTime) };
  } catch (error) {
    console.error(`❌ Error testing ${url}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting performance tests...\n');
  
  const results = [];
  for (const url of testUrls) {
    const result = await measurePageLoad(url);
    if (result) results.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait between tests
  }
  
  console.log('\n📈 Performance Summary:');
  results.forEach(r => {
    console.log(`\n${r.url}`);
    console.log(`  Initial: ${r.loadTime}ms`);
    console.log(`  Cached: ${r.cacheTime}ms`);
    console.log(`  Status: ${r.loadTime < 500 ? '✅ FAST' : r.loadTime < 2000 ? '⚠️ OK' : '❌ SLOW'}`);
  });
}

// Run if not in browser
if (typeof window === 'undefined') {
  runTests();
}

export { measurePageLoad, runTests };
