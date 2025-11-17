// Quick test to verify Gemini API is working
// Run: node test-gemini.js

require('dotenv').config({ path: '.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in .env');
  process.exit(1);
}

console.log('🔑 API Key found (first 10 chars):', GEMINI_API_KEY.substring(0, 10) + '...');
console.log('🧪 Testing Gemini API...\n');

const testPrompt = {
  contents: [{
    role: "user",
    parts: [{ 
      text: "Return only valid JSON: {\"test\": \"success\", \"message\": \"API is working\"}" 
    }]
  }]
};

fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPrompt)
  }
)
  .then(async (res) => {
    console.log('📡 Response Status:', res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error Response:', errorText);
      process.exit(1);
    }
    
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('✅ API Response:', text);
    console.log('\n✨ Gemini API is working correctly!');
  })
  .catch((error) => {
    console.error('❌ Network Error:', error.message);
    process.exit(1);
  });
