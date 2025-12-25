/**
 * Bulk Import Script for Questions
 *
 * Usage:
 * 1. Create a data.json file with an array of questions.
 * 2. Run: npx tsx src/scripts/seed-questions.ts
 */

import { getPayload } from 'payload'
import config from '@/payload.config'

const seedQuestions = async () => {
  const payload = await getPayload({ config })

  // Example data structure
  const data = [
    {
      text: 'What is the capital of India?',
      options: [
        { text: 'Mumbai', isCorrect: false },
        { text: 'Delhi', isCorrect: true },
        { text: 'Kolkata', isCorrect: false },
        { text: 'Chennai', isCorrect: false },
      ],
      subject: 'ga',
      marks: 1,
      negativeMarks: 0.25,
    },
    // Add more...
  ]

  console.log(`Starting import of ${data.length} questions...`)

  for (const q of data) {
    try {
      await payload.create({
        collection: 'questions',
        data: {
          text: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  version: 1,
                  children: [{ type: 'text', version: 1, text: q.text }],
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          options: q.options.map((opt) => ({
            text: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: opt.text }],
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            isCorrect: opt.isCorrect,
          })),
          subject: q.subject as 'ga' | 'quant' | 'reasoning' | 'english' | 'computer',
          marks: q.marks,
          negativeMarks: q.negativeMarks,
          difficulty: 'medium',
        },
      })
      console.log(`Created: "${q.text.substring(0, 30)}..."`)
    } catch (e) {
      console.error(`Failed to create question: ${q.text}`, e)
    }
  }

  console.log('Import complete!')
  process.exit(0)
}

seedQuestions()
