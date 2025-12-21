
import { generateJobSummary } from '../lib/ai-service'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

async function testAIIntegration() {
  console.log('🧪 Testing AI Service Integration...')
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is missing in .env')
    process.exit(1)
  }

  const mockJobText = JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              text: 'Candidates must have a Bachelor\'s Degree in Computer Science. Age limit is 21-30 years. 5 years relaxation for SC/ST.',
              type: 'text'
            }
          ],
          type: 'paragraph'
        }
      ],
      type: 'root',
      format: '',
      indent: 0,
      version: 1
    }
  })

  console.log('📝 Sending mock job data to Gemini...')
  const startTime = Date.now()
  
  try {
    const summary = await generateJobSummary(mockJobText)
    const duration = Date.now() - startTime
    
    if (summary) {
      console.log('✅ AI Summary Generated Successfully!')
      console.log(`⏱️ Duration: ${duration}ms`)
      console.log('\n--- Generated Summary ---')
      console.log(summary)
      console.log('-------------------------\n')
    } else {
      console.error('❌ Generated summary is empty.')
    }
  } catch (error) {
    console.error('❌ Error during AI generation:', error)
  }
}

testAIIntegration()
