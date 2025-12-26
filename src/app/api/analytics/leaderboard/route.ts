import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/analytics/leaderboard
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Fetch top scoring attempts globally
    // Note: Payload doesn't support complex aggregation easily via API, so we fetch top N and filter unique users in code
    // Or we rely on 'sort: -score'
    const { docs: topAttempts } = await payload.find({
      collection: 'test-attempts',
      where: {
        status: { equals: 'completed' },
      },
      sort: '-score',
      limit: 50,
      depth: 1,
    })

    // Filter unique users (take their best score)
    const uniqueLeaders = new Map()

    topAttempts.forEach((attempt: any) => {
      const userId = typeof attempt.user === 'object' ? attempt.user.id : attempt.user
      const userName = typeof attempt.user === 'object' ? attempt.user.name : 'Unknown User'

      if (!uniqueLeaders.has(userId)) {
        uniqueLeaders.set(userId, {
          rank: 0, // Assigned later
          name: userName,
          score: attempt.score,
          testName: typeof attempt.test === 'object' ? attempt.test.title : 'Mock Test',
        })
      }
    })

    const leaderboard = Array.from(uniqueLeaders.values())
      .slice(0, 10)
      .map((l, i) => ({ ...l, rank: i + 1 }))

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
