import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// DELETE /api/saved-jobs/[id] - Delete a saved job
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
    const savedJob = await payload.findByID({
      collection: 'saved-jobs',
      id,
    })

    if (typeof savedJob.user === 'object' && savedJob.user.id !== user.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await payload.delete({
      collection: 'saved-jobs',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting saved job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
