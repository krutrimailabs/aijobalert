import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/applications - List user's applications
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { docs: applications } = await payload.find({
      collection: 'job-applications',
      where: {
        user: {
          equals: user.user.id,
        },
      },
      depth: 2, // Fetch job details
      sort: '-applicationDate',
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/applications - Create new application
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { jobId, status = 'applied' } = body

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Check if already applied
    const existing = await payload.find({
      collection: 'job-applications',
      where: {
        user: { equals: user.user.id },
        job: { equals: jobId },
      },
    })

    if (existing.totalDocs > 0) {
      return NextResponse.json({ error: 'Already applied for this job' }, { status: 409 })
    }

    // Create application
    const newApplication = await payload.create({
      collection: 'job-applications',
      data: {
        user: user.user.id,
        job: jobId,
        status,
        applicationDate: new Date().toISOString(),
        timeline: [
          {
            status: 'applied',
            date: new Date().toISOString(),
            note: 'Application submitted successfully',
          },
        ],
      },
    })

    return NextResponse.json(newApplication, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
