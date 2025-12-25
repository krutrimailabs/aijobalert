'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

type AnswerMap = Record<number, number> // questionIndex (0-based) -> optionIndex (0-based)

interface SubmitResult {
  success: boolean
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  skipped: number
  attemptId?: string
}

export async function submitTest(testId: string, answers: AnswerMap): Promise<SubmitResult> {
  const payload = await getPayload({ config })

  // In a real app, we would fetch the user from the session/request
  // For MVP, we'll assume a dummy user or just track anonymous attempts for now if auth isn't fully wired for this context
  // But we need 'questions' to calculate score.
  // We assume 'answers' keys are indices in the 'questions' array of the MockTest.

  try {
    const test = await payload.findByID({
      collection: 'mock-tests',
      id: testId,
      depth: 2, // Need questions populated
    })

    if (!test || !test.questions) {
      throw new Error('Test not found')
    }

    const questions = test.questions as any[] // Payload types might be complex here

    let score = 0
    let correctCount = 0
    let wrongCount = 0
    let skippedCount = 0

    questions.forEach((q, index) => {
      const userSelectedOptIndex = answers[index]

      if (userSelectedOptIndex === undefined) {
        skippedCount++
        return
      }

      // Find which option is correct
      // In our schema, we have 'isCorrect' boolean on options
      // But we need the index of that option.
      const correctOptIndex = q.options.findIndex((opt: any) => opt.isCorrect === true)

      if (userSelectedOptIndex === correctOptIndex) {
        score += q.marks || 1
        correctCount++
      } else {
        score -= q.negativeMarks || 0.25
        wrongCount++
      }
    })

    // Record Attempt (Optional for now, but good practice)
    // await payload.create({ collection: 'test-attempts', ... })

    return {
      success: true,
      score: Number(score.toFixed(2)),
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skipped: skippedCount,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      score: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      skipped: 0,
    }
  }
}
