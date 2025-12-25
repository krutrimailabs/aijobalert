import { getPayload } from 'payload'
import config from '@/payload.config'
import fs from 'fs'

// Example JSON format for bulk import
// [
//   {
//     "category": "General Aptitude",
//     "topic": "Problems on Trains",
//     "questions": [
//       {
//         "text": "...",
//         "options": [{ "text": "...", "isCorrect": true }, ...],
//         "explanation": "..."
//       }
//     ]
//   }
// ]

const LOG_FILE = 'bulk-import.log'

async function log(message: string) {
  const timestamp = new Date().toISOString()
  const logMsg = `[${timestamp}] ${message}`
  console.log(logMsg)
  fs.appendFileSync(LOG_FILE, logMsg + '\n')
}

// Helper to create valid Lexical RichText structure
function createRichText(content: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph', // Required by Lexical
          format: '' as const,
          indent: 0,
          version: 1,
          children: [
            {
              mode: 'normal' as const,
              text: content,
              type: 'text',
              style: '',
              detail: 0,
              format: 0,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

export async function bulkImportPractice(filePath: string) {
  try {
    log(`Starting bulk import from ${filePath}`)
    const payload = await getPayload({ config })
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)

    for (const item of data) {
      const { category, topic, questions } = item

      log(`Processing Topic: ${topic} (${category})`)

      // 1. Create/Find Topic
      const existingTopics = await payload.find({
        collection: 'practice-topics',
        where: {
          slug: { equals: topic.toLowerCase().replace(/ /g, '-').replace(/[&+,]/g, '') },
        },
      })

      let topicId
      if (existingTopics.totalDocs > 0) {
        topicId = existingTopics.docs[0].id
        log(`  Found existing topic: ${topicId}`)
      } else {
        const newTopic = await payload.create({
          collection: 'practice-topics',
          data: {
            name: topic,
            slug: topic.toLowerCase().replace(/ /g, '-').replace(/[&+,]/g, ''),
            category: category,
          },
        })
        topicId = newTopic.id
        log(`  Created new topic: ${topicId}`)
      }

      // 2. Create Questions
      for (const q of questions) {
        // Check if question exists (simple duplicate check by text snippet)
        // Note: RichText querying is complex, skipping strict duplicate check for this bulk seed snippet to avoid TS complexity.
        // In production, we'd hash the content string.

        await payload.create({
          collection: 'questions',
          data: {
            subject: 'quant', // Use valid lowercase enum
            topic: [topicId],
            text: createRichText(q.text),
            options: q.options.map((opt: { text: string; isCorrect: boolean }) => ({
              text: createRichText(opt.text),
              isCorrect: opt.isCorrect,
            })),
            explanation: createRichText(q.explanation || ''),
            marks: 1,
            negativeMarks: 0.25,
          },
          draft: false, // Explicitly publish
        })
        log(`    Imported question: ${q.text.substring(0, 30)}...`)
      }
    }

    log('Bulk import completed successfully.')
  } catch (error) {
    log(`ERROR: ${error}`)
  }
}
