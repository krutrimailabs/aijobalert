import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth(req)

    if (!user || !user.roles?.some((r: string) => ['admin', 'superadmin'].includes(r))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { title, duration, examType, hasSectionalTimer, sections } = body

    if (!title || !sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const allQuestionIds: number[] = []

    // Process each section request
    for (const section of sections) {
      const { subject, count, topic, difficulty, examTag } = section

      const where: any = {
        subject: { equals: subject },
      }

      if (difficulty && difficulty !== 'any') {
        where.difficulty = { equals: difficulty }
      }

      if (examTag && examTag !== 'any') {
        // examTags is a select hasMany (array), so we check if the value exists in the array
        // Payload 'like' or 'contains' needed for array?
        // Postgres adapter usually supports 'equals' for single value match in array field or use 'in'.
        // For a 'select hasMany', Payload stores it as an array of strings.
        // Trying standard 'equals' which often works as 'contains' in Payload logic for arrays, or use specific operator.
        // Let's use 'equals' which matches one value in the array.
        where.examTags = { equals: examTag }
      }

      // If specific topic requested, resolve it
      if (topic) {
        const topicDoc = await payload.find({
          collection: 'practice-topics',
          where: {
            or: [
              { slug: { equals: topic.toLowerCase().replace(/ /g, '-').replace(/[&+,]/g, '') } },
              { name: { like: topic } },
            ],
          },
        })
        if (topicDoc.totalDocs > 0) {
          where.topic = { in: topicDoc.docs.map((d) => d.id) }
        }
      }

      // Fetch pool of questions
      // Limit is higher to allow random sampling if we had a proper random query,
      // but Payload doesn't support 'random' sort natively in Postgres easily via this API without raw query.
      // Workaround: Fetch a larger batch (e.g. 5x required) and shuffle in memory.
      const pool = await payload.find({
        collection: 'questions',
        where,
        limit: Math.max(100, count * 5),
        sort: '-createdAt', // Get recent ones? Or maybe generic
      })

      if (pool.docs.length < count) {
        return NextResponse.json(
          {
            error: `Not enough questions for subject: ${subject}. Required: ${count}, Available: ${pool.docs.length}`,
          },
          { status: 400 },
        )
      }

      // Random Selection
      const shuffled = pool.docs.sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, count)

      selected.forEach((q: any) => allQuestionIds.push(q.id))
    }

    // Create the Mock Test
    const newTest = await payload.create({
      collection: 'mock-tests',
      data: {
        title,
        examType,
        duration: Number(duration),
        hasSectionalTimer: hasSectionalTimer || false,
        sections: sections.map((s: any, idx: number) => ({
          name: s.name || `Section ${idx + 1}`,
          subject: s.subject,
          duration: s.sectionDuration || 0,
          order: idx + 1,
        })),
        questions: allQuestionIds, // Direct array of IDs for non-polymorphic relation
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Mock Test generated successfully',
      testId: newTest.id,
      questionCount: allQuestionIds.length,
    })
  } catch (error: any) {
    console.error('Generator Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
