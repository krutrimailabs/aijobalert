
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('No API KEY')
    return
  }
  
  // Create a custom fetch or usage if listing is not directly supported by the helper, 
  // but the SDK likely supports it via the manager.
  // Actually the SDK documentation says we might not have a direct listModels on the client instance easily 
  // without using the GoogleGenerativeAI.getGenerativeModel... wait.
  
  // Let's try to infer from a simple working model if possible, usually 'gemini-pro' works.
  // But since it failed, I suspect the base URL or version might be an issue.
  
  // I will try to use the raw API using fetch to list models.
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    console.log('Available Models:', JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Error listing models:', err)
  }
}

listModels()
