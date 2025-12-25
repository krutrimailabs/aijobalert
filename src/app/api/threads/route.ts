import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

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
    const user = await payload.auth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, relatedQuestion } = await req.json()

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

    const thread = await payload.create({
      collection: 'threads',
      data: {
        title,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: lexicalContent as any,
        relatedQuestion: relatedQuestion ? Number(relatedQuestion) : undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        author: (user as any).id,
        status: 'published', // Auto-approve by default
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    })

    return NextResponse.json(thread)
  } catch (error) {
    console.error('Error creating thread:', error)
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 })
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
