import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env')
    process.exit(1)
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const modelsToTry = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro',
    'gemini-1.5-pro-001',
    'gemini-1.5-pro-002',
  ]

  console.log('🔍 Testing available models...')

  for (const modelName of modelsToTry) {
    console.log(`\nTesting model: "${modelName}"...`)
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent('Ping')
      const response = await result.response
      console.log(`✅ SUCCESS with "${modelName}"! Response: ${response.text()}`)
      return // Exit on first success
    } catch (error: any) {
      let msg = error.message || String(error)
      if (msg.includes('404')) msg = '404 Not Found (Model not available)'
      if (msg.includes('429')) msg = '429 Too Many Requests (Quota Exceeded / Free Tier limitation)'
      console.log(`❌ Failed "${modelName}": ${msg}`)
    }
  }

  console.log('\n❌ All models failed. Please check your API key permissions and region.')
}

testGemini()
