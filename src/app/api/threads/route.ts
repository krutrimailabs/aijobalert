import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { Thread, User } from '@/payload-types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const statusParam = searchParams.get('status')

  try {
    const payload = await getPayload({ config: configPromise })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

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

    const threads = await payload.find({
      collection: 'threads',
      where,
      sort: '-createdAt',
      depth: 1,
    })

    return NextResponse.json(threads)
  } catch (error) {
    console.error('Error fetching threads:', error)
    return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 })
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

    const thread = await payload.update({
      collection: 'threads',
      id,
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: status as any,
      },
    })

    return NextResponse.json(thread)
  } catch (error) {
    console.error('Error updating thread:', error)
    return NextResponse.json({ error: 'Failed to update thread' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // In a real scenario, we should verify authentication here.
    // For now, assuming request is from valid context or allowing public (if designed so)
    // But Payload's 'authenticated' access control will block if no user.
    // We need to ensure the user is logged in. Since this is an API route,
    // Payload's local API might rely on the `req` having user?
    // Actually, typical implementation in Next.js app router with Payload:
    // We can rely on payload.local API bypassing access control if we set 'overrideAccess: false' and pass 'user',
    // OR we can trust the 'authenticated' access policy if we parse the user from headers/cookies.
    // For this MVP, let's try standard create.

    // Verify user is logged in
    const userResponse = await payload.auth(req)
    if (!userResponse) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (userResponse as any).user || userResponse
    const currentUser = user as User

    if (!currentUser || !currentUser.id) {
      console.error('User ID missing from auth response:', userResponse)
      return NextResponse.json({ error: 'Unauthorized: No User ID' }, { status: 401 })
    }

    const { title, content, relatedQuestion, topic } = await req.json()

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
    } as unknown as Thread['content']

    const threadData: Omit<Thread, 'id' | 'createdAt' | 'updatedAt' | 'slug'> = {
      title,
      content: lexicalContent,
      author: currentUser.id,
      status: 'published',
    }

    if (relatedQuestion) {
      threadData.relatedQuestion = Number(relatedQuestion)
    }

    if (topic) {
      threadData.topic = Number(topic)
    }

    const thread = await payload.create({
      collection: 'threads',
      data: threadData,
    })

    return NextResponse.json(thread)
  } catch (error: unknown) {
    console.error('Error creating thread (Full Details):', error)
    if (typeof error === 'object' && error !== null && 'data' in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Payload Error Data:', (error as any).data)
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'Failed to create thread', details: errorMessage },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    const user = await payload.auth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing thread ID' }, { status: 400 })
    }

    await payload.delete({
      collection: 'threads',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting thread:', error)
    return NextResponse.json({ error: 'Failed to delete thread' }, { status: 500 })
  }
}
