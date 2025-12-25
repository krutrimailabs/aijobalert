import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { calculateMatchScore } from '@/utilities/matchEngine'
import { Job, User } from '@/payload-types'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const user = await payload.auth(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse filters from request if any (e.g. limit, page, category)
    // For now, fetch latest open jobs
    const body = await req.json().catch(() => ({}))
    const limit = body.limit || 20

    const { docs: jobs } = await payload.find({
      collection: 'jobs',
      where: {
        status: {
          not_equals: 'closed', // Only open jobs? or all?
          // equals: 'open'
        },
      },
      limit: 100, // Fetch more to match-sort
      sort: '-createdAt',
      depth: 1,
    })

    const scoredJobs = jobs.map((job) => {
      const matchResult = calculateMatchScore(user as unknown as User, job as Job)
      return {
        ...job,
        matchScore: matchResult.score,
        matchReasons: matchResult.reasons,
        isEligible: matchResult.isEligible,
      }
    })

    // Sort by Score Descending
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore)

    // Apply pagination after scoring (expensive but necessary for "best match")
    const paginatedJobs = scoredJobs.slice(0, limit)

    return NextResponse.json({
      docs: paginatedJobs,
      totalDocs: jobs.length,
      matchedCount: scoredJobs.filter((j) => j.matchScore > 0).length,
    })
  } catch (error) {
    console.error('Error in job matching:', error)
    return NextResponse.json({ error: 'Failed to calculate matches' }, { status: 500 })
  }
}
