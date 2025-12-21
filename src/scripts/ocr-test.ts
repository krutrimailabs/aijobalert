
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

async function extractTextFromImage() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('No API KEY')
    return
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  // Use a model that supports vision
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

  const imagePath = '/Users/apple/.gemini/antigravity/brain/5ff6cafd-1ca9-406d-b518-2c3ec676ddd6/uploaded_image_1766353721657.jpg'

  try {
    const imageBuffer = fs.readFileSync(imagePath)
    const imageBase64 = imageBuffer.toString('base64')

    const prompt = 'Extract all the text from this image exactly as it appears.'

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg',
        },
      },
    ])

    console.log('--- Extracted Text ---')
    console.log(result.response.text())
    console.log('----------------------')
  } catch (err) {
    console.error('Error processing image:', err)
  }
}

extractTextFromImage()
