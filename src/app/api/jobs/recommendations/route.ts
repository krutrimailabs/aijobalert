import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

import type { User } from '@/payload-types'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = (await payload.auth({ headers: req.headers })) as { user: User | null }

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Build query based on user profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryConditions: any[] = []

    if (user.preferredStates && user.preferredStates.length > 0) {
      queryConditions.push({
        state: { in: user.preferredStates },
      })
    }

    if (user.category) {
      queryConditions.push({
        category: { contains: user.category },
      })
    }

    // Default fallback if no profile data: fetch latest jobs
    if (queryConditions.length === 0) {
      const { docs: latestJobs } = await payload.find({
        collection: 'jobs',
        sort: '-postDate',
        limit: 10,
        where: {
          lastDate: {
            greater_than: new Date().toISOString(),
          },
        },
      })
      return NextResponse.json(latestJobs)
    }

    // Fetch matching jobs
    const { docs: recommendedJobs } = await payload.find({
      collection: 'jobs',
      where: {
        and: [
          {
            lastDate: {
              greater_than: new Date().toISOString(),
            },
          },
          {
            or: queryConditions,
          },
        ],
      },
      sort: '-postDate',
      limit: 10,
    })

    return NextResponse.json(recommendedJobs)
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
