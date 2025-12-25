import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const threadId = searchParams.get('threadId')
  const questionId = searchParams.get('questionId')
  const statusParam = searchParams.get('status')

  if (!threadId && !questionId && !statusParam) {
    return NextResponse.json({ error: 'Missing threadId, questionId, or status' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    // Default to published unless admin requests specific status
    if (statusParam) {
      const user = await payload.auth(req)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const roles = (user as any)?.roles || []
      const isAdmin = roles.includes('admin') || roles.includes('superadmin')

      if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized to filter by status' }, { status: 403 })
      }
      where.status = { equals: statusParam }
    } else {
      where.status = { equals: 'published' }
    }

    if (threadId) where.thread = { equals: threadId }
    if (questionId) where.question = { equals: questionId }

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

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    const user = await payload.auth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roles = (user as any)?.roles || []
    const isAdmin = roles.includes('admin') || roles.includes('superadmin')

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, status } = await req.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    const comment = await payload.update({
      collection: 'comments',
      id,
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: status as any,
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentUser = (user as any).user || user

    const comment = await payload.create({
      collection: 'comments',
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: lexicalContent as any,
        thread: threadId,
        question: questionId ? Number(questionId) : undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: (currentUser as any).id,
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
