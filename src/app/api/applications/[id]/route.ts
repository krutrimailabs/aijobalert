import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// PATCH /api/applications/[id] - Update application status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Verify ownership
    const application = await payload.findByID({
      collection: 'job-applications',
      id,
    })

    if (typeof application.user === 'object' && application.user.id !== user.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await payload.update({
      collection: 'job-applications',
      id,
      data: body,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/applications/[id] - Delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const application = await payload.findByID({
      collection: 'job-applications',
      id,
    })

    if (typeof application.user === 'object' && application.user.id !== user.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await payload.delete({
      collection: 'job-applications',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
