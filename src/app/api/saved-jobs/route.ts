import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/saved-jobs - Get user's saved jobs
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const savedJobs = await payload.find({
      collection: 'saved-jobs',
      where: {
        user: {
          equals: user.user.id,
        },
      },
      depth: 2, // Populate job details
      limit: 100,
    })

    return NextResponse.json(savedJobs)
  } catch (error) {
    console.error('Error fetching saved jobs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/saved-jobs - Save a job
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { jobId, notes } = body

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Check if already saved
    const existing = await payload.find({
      collection: 'saved-jobs',
      where: {
        and: [{ user: { equals: user.user.id } }, { job: { equals: jobId } }],
      },
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'Job already saved', savedJob: existing.docs[0] },
        { status: 400 },
      )
    }

    const savedJob = await payload.create({
      collection: 'saved-jobs',
      data: {
        user: user.user.id,
        job: jobId,
        notes: notes || '',
      },
    })

    return NextResponse.json(savedJob, { status: 201 })
  } catch (error) {
    console.error('Error saving job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
// DELETE /api/saved-jobs - Unsave a job
export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Find the saved job entry first
    const existing = await payload.find({
      collection: 'saved-jobs',
      where: {
        and: [{ user: { equals: user.user.id } }, { job: { equals: jobId } }],
      },
    })

    if (existing.docs.length === 0) {
      return NextResponse.json({ error: 'Job not found in saved list' }, { status: 404 })
    }

    // Delete it
    await payload.delete({
      collection: 'saved-jobs',
      id: existing.docs[0].id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing saved job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
