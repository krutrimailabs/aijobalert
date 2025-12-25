import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

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
          type: 'paragraph',
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

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth(req) // Verify auth using Payload

    if (!user || !user.roles?.some((r: string) => ['admin', 'superadmin'].includes(r))) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { data } = body // Expecting { data: [...] }

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected array of items.' },
        { status: 400 },
      )
    }

    const results = {
      createdTopics: 0,
      createdQuestions: 0,
      errors: [] as string[],
    }

    for (const item of data) {
      try {
        const { category, topic, questions } = item

        if (!topic || !questions || !Array.isArray(questions)) {
          // Skip invalid items
          continue
        }

        // 1. Create/Find Topic
        const slug = topic.toLowerCase().replace(/ /g, '-').replace(/[&+,]/g, '')
        const existingTopics = await payload.find({
          collection: 'practice-topics',
          where: {
            slug: { equals: slug },
          },
        })

        let topicId
        if (existingTopics.totalDocs > 0) {
          topicId = existingTopics.docs[0].id
        } else {
          const newTopic = await payload.create({
            collection: 'practice-topics',
            data: {
              name: topic,
              slug: slug,
              category: category || 'General Aptitude', // Default fallback
            },
          })
          topicId = newTopic.id
          results.createdTopics++
        }

        // 2. Create Questions
        for (const q of questions) {
          await payload.create({
            collection: 'questions',
            data: {
              subject: 'quant', // Default for now, maybe add to input JSON
              topic: [topicId],
              text: createRichText(q.text),
              options: q.options.map((opt: { text: string; isCorrect: boolean }) => ({
                text: createRichText(opt.text),
                isCorrect: opt.isCorrect,
              })),
              explanation: createRichText(q.explanation || ''),
              marks: q.marks || 1,
              negativeMarks: q.negativeMarks || 0.25,
            },
            draft: false,
          })
          results.createdQuestions++
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error('Import Item Error:', err)
        results.errors.push(`Error processing topic ${item.topic}: ${errorMessage}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${results.createdQuestions} questions across ${results.createdTopics} new topics.`,
      details: results,
    })
  } catch (error) {
    console.error('Bulk Import Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
