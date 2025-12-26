import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Generates a concise summary for a job posting.
 */
export async function generateJobSummary(jobText: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || ''

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Skipping AI summary generation.')
    return ''
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
  })

  const prompt = `
  Apply the Chain-of-Verification (CoVe) technique to the following task.
  
  Technique:
  1. Generate an initial answer.
  2. Generate verification questions to expose errors.
  3. Answer verification questions.
  4. Provide the final corrected answer.

  Task: Analyze this government job notification and provide a structured summary in the specific FORMAT below.

  FORMAT (Strictly follow this structure for the Final Answer):
  1. 🎯 **3-Bullet Summary**:
     - **Eligibility**: [Education & Age Limit]
     - **Deadline**: [Last Date to Apply]
     - **Fees**: [Application Fees]
  
  2. 📋 **Core Requirements**:
     - [Extract essential qualifications and conditions in simple language]
  
  3. 🚀 **Selection Process**:
     - [Exam -> Interview -> Document Verification flow]
  
  4. 💡 **Key Notes**:
     - [Any special conditions or relaxations]

  Job Notification Text:
  ${jobText.substring(0, 15000)}

  execute the following steps:
  Step 1: Provide your initial answer based on the FORMAT.
  Step 2: Generate 5 verification questions that would expose errors in your answer (e.g., "Did I miss a specific age relaxation?", "Is the deadline strictly for online submission?").
  Step 3: Answer each verification question based on the text.
  Step 4: Provide your final, corrected answer based on verification.
  
  Output Format:
  [Step 1 Output]
  ...
  [Step 2 Output]
  ...
  [Step 3 Output]
  ...
  --- FINAL ANSWER ---
  [Step 4 Output Only]
  `

  // This part was originally outside the main prompt string, but the instruction implies it should be appended.
  // I'm appending it to the prompt string as per the instruction's structure.
  const finalCheck = ` Before providing output, please check if the job notification text is valid. If not, please provide a message saying "Invalid job notification text". Question yourself whether this si true or false. If true then only proceed. If false then do not proceed.  `

  try {
    const result = await model.generateContent(prompt + finalCheck)
    return result.response.text()
  } catch (error) {
    console.error('AI Summary Error:', error)
    return ''
  }
}

/**
 * Parses raw text from a Government Job PDF and extracts structured data.
 */
export async function parseJobNotification(pdfText: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY || ''

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Skipping AI parsing.')
    return null
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  // Use a model with larger context window if possible, but flash is good for speed/cost
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    generationConfig: { responseMimeType: 'application/json' },
  })

  // Truncate if too long (Gemini 1.5 has 1M context, but safety first for older models)
  // 30,000 chars is roughly 15-20 pages of text.
  const truncatedText = pdfText.substring(0, 50000)

  const prompt = `
  You are an expert Data Extraction AI for Government Jobs (Sarkari Naukri).
  Your task is to extract specific fields from the provided Job Notification Text into a strict JSON format.

  Text to Analyze:
  """
  ${truncatedText}
  """

  OUTPUT JSON STRUCTURE:
  {
    "postName": "string (Main role name, e.g. Probationary Officer)",
    "totalVacancies": number,
    "recruitmentBoard": "string (Organization name)",
    "advtNo": "string (Advertisement Number if found, else null)",
    "lastDate": "YYYY-MM-DD (ISO Date string)",
    "applicationStartDate": "YYYY-MM-DD (ISO Date string)",
    "minAge": number,
    "maxAge": number,
    "education": [
       { "level": "10th" | "12th" | "Diploma" | "Graduate" | "PostGraduate", "degree": "string" }
    ],
    "salaryStipend": "string (e.g. Rs 56,100 - 1,77,500)",
    "confidenceScore": number (0-100, how confident are you that the extracted data is accurate based on clarity of text)
  }

  RULES:
  1. If a date is not found, return null. 
  2. Normalize dates to ISO 8601 (YYYY-MM-DD).
  3. "confidenceScore" should reflect if the OCR/Text was messy or clear.
  4. Return ONLY the JSON object. Do not include markdown code blocks.
  `

  try {
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    // Clean up potential markdown wrapping
    const jsonString = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('AI Match/Parse Error:', error)
    return { error: 'Failed to parse', details: String(error) }
  }
}

/**
 * Placeholder for eligibility checking (Future enhancement)
 */
export async function generateJobMatchScore(
  _userProfile: unknown,
  _jobRequirements: unknown,
): Promise<number> {
  // TODO: Implement logic to match user profile with job requirements
  return 85
}
