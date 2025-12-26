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
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
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

export interface JobParsedData {
  _verification_logic?: {
    identified_dates: string[]
    vacancy_check: string
    ambiguity_resolution: string
  }
  postName?: string
  totalVacancies?: number
  recruitmentBoard?: string
  advtNo?: string | null
  lastDate?: string | null
  applicationStartDate?: string | null
  minAge?: number
  maxAge?: number
  education?: Array<{ level: string; degree: string }>
  salaryStipend?: string
  confidenceScore?: number
  error?: string
  details?: string
}

/**
 * Parses raw text from a Government Job PDF and extracts structured data.
 */
export async function parseJobNotification(pdfText: string): Promise<JobParsedData | null> {
  const apiKey = process.env.GEMINI_API_KEY || ''
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash' // Fallback handled by env var usually

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Skipping AI parsing.')
    return null
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  // Use a model with larger context window if possible, but flash is good for speed/cost
  // 'gemini-3-pro-preview' is recommended for this reasoning task.
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: 'application/json' },
  })

  // Truncate if too long (Gemini 1.5 has 1M context, but safety first for older models)
  // 30,000 chars is roughly 15-20 pages of text.
  const truncatedText = pdfText.substring(0, 50000)

  const prompt = `
  You are an expert Government Job Notification Auditor. 
  Your goal is to extract structured data from the provided text with 100% accuracy.

  ### CRITICAL INSTRUCTION: CHAIN OF VERIFICATION
  Government notifications are often messy. Before extracting the final values, you must perform a verification step inside the "_verification_logic" field.
  
  Follow this strict reasoning process:
  1. **Date Verification:** Scan for all dates. Distinguish between "Notification Date", "Application Start Date", and "Last Date". If a year is missing, infer it from the context of other dates.
  2. **Vacancy Summation:** If vacancies are listed by category (SC/ST/OBC/UR), sum them up to verify the "Total Vacancies" count matches the document.
  3. **Ambiguity Check:** If there are multiple posts, identify which one is the "primary" post or if this is a general recruitment drive.

  ### REQUIRED JSON STRUCTURE
  You must return the result in this exact JSON format. The "_verification_logic" field must be filled FIRST.

  {
    "_verification_logic": {
      "identified_dates": ["List all dates found in text with their context"],
      "vacancy_check": "Calculated sum of category vacancies vs stated total",
      "ambiguity_resolution": "Notes on how you decided on the specific post name or dates"
    },
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

  ### DOCUMENT TEXT:
  """
  ${truncatedText}
  """

  RULES:
  1. **Dates**: Normalize to ISO 8601 (YYYY-MM-DD). If a year is missing, infer the current year of the notification context (usually 2024-2025).
  2. **Education**: Map confusing degrees to the closest standard level (e.g., "B.E./B.Tech" -> "Graduate").
  3. **Confidence**: Lower the score if dates are ambiguous or text is unreadable.
  4. **Output**: Return ONLY the JSON object. Do not include markdown code blocks.
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
