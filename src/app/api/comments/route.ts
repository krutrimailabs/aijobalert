import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const threadId = searchParams.get('threadId')
  const questionId = searchParams.get('questionId')

  if (!threadId && !questionId) {
    return NextResponse.json({ error: 'Missing threadId or questionId' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: { equals: 'published' },
    }
    if (threadId) where.thread = { equals: threadId }
    if (questionId) where.question = { equals: questionId } // If we support comments directly on questions w/o thread

    const comments = await payload.find({
      collection: 'comments',
      where,
      sort: '-createdAt',
      depth: 1,
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Verify user is logged in
    const user = await payload.auth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, threadId, questionId } = await req.json()

    // Simple Lexical structure generator
    const lexicalContent = {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'text',
                text: content,
                format: 0,
                detail: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
          },
        ],
      },
    }

    const comment = await payload.create({
      collection: 'comments',
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: lexicalContent as any,
        thread: threadId,
        question: questionId ? Number(questionId) : undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: (user as any).id,
        upvotes: 0,
        status: 'published', // Auto-approve
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Verify user is logged in
    const user = await payload.auth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing comment ID' }, { status: 400 })
    }

    // MVP: Allow deletion, Payload access control handles permission if configured,
    // or we assume backend trust for now. Ideally check ownership.
    await payload.delete({
      collection: 'comments',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
