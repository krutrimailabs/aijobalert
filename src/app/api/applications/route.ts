import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/applications - Get user's applications
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applications = await payload.find({
      collection: 'job-applications',
      where: {
        user: {
          equals: user.user.id,
        },
      },
      depth: 2,
      limit: 100,
      sort: '-applicationDate',
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/applications - Create application
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { jobId, status, notes } = body

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Check if already applied
    const existing = await payload.find({
      collection: 'job-applications',
      where: {
        and: [{ user: { equals: user.user.id } }, { job: { equals: jobId } }],
      },
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'Already applied to this job', application: existing.docs[0] },
        { status: 400 },
      )
    }

    const application = await payload.create({
      collection: 'job-applications',
      data: {
        user: user.user.id,
        job: jobId,
        status: status || 'applied',
        applicationDate: new Date().toISOString(),
        notes: notes || '',
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
