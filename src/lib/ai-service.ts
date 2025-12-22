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
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-flash-latest' })

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
 * Placeholder for eligibility checking (Future enhancement)
 */
export async function generateJobMatchScore(_userProfile: unknown, _jobRequirements: unknown): Promise<number> {
  // TODO: Implement logic to match user profile with job requirements
  return 85
}
