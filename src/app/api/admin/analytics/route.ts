import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { User } from '@/payload-types'
import config from '@payload-config'

// GET /api/admin/analytics
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    // Security Check: Only Admins
    if (!user?.user || !user.user.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Fetch Counts (Optimized using local API 'count' if available, otherwise find with limit 0)
    // Payload 3.0 supports count in response
    const [usersRes, jobsRes, appsRes, testsRes] = await Promise.all([
      payload.find({ collection: 'users', limit: 0 }),
      payload.find({ collection: 'jobs', limit: 0 }),
      payload.find({ collection: 'job-applications', limit: 0 }),
      payload.find({ collection: 'test-attempts', limit: 0 }),
    ])

    const totalUsers = usersRes.totalDocs
    const totalJobs = jobsRes.totalDocs
    const totalApplications = appsRes.totalDocs
    const totalTestsTaken = testsRes.totalDocs

    // 3. Active Users (Real Data from Schema)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { totalDocs: activeUserCount } = await payload.find({
      collection: 'users',
      where: { 'stats.lastLoginAt': { greater_than_equal: thirtyDaysAgo.toISOString() } },
      limit: 0,
    })

    // 4. Power Users (Top Applicants)
    const { docs: powerUsers } = await payload.find({
      collection: 'users',
      sort: '-stats.applicationCount',
      limit: 5,
      depth: 0,
    })

    // 5. User Growth & App Volume (Trend)
    // Fetching last 500 users/apps to create a trend line (MVP optimization)
    const { docs: recentUsers } = await payload.find({
      collection: 'users',
      where: { createdAt: { greater_than: thirtyDaysAgo.toISOString() } },
      limit: 500,
      sort: 'createdAt',
    })

    const { docs: recentApps } = await payload.find({
      collection: 'job-applications',
      where: { createdAt: { greater_than: thirtyDaysAgo.toISOString() } },
      limit: 500,
      sort: 'createdAt',
    })

    // Aggregating by Date
    const growthMap = new Map<string, { users: number; apps: number }>()

    const processDate = (dateStr: string, type: 'users' | 'apps') => {
      const date = new Date(dateStr).toLocaleDateString()
      if (!growthMap.has(date)) growthMap.set(date, { users: 0, apps: 0 })
      const entry = growthMap.get(date)!
      entry[type]++
    }

    recentUsers.forEach((u) => processDate(u.createdAt, 'users'))
    recentApps.forEach((a) => processDate(a.createdAt, 'apps'))

    // Fill missing dates? For now, we just sort the map entries
    const growthHistory = Array.from(growthMap.entries())
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // 6. Popular Content (Top 5 Jobs by Application count)
    // Note: Payload API doesn't do "group by" cleanly.
    // We will use a separate optimized query or just list recent active jobs for now.
    // Ideally we'd have a 'stats.applicationCount' on Jobs too.
    const { docs: topJobs } = await payload.find({
      collection: 'jobs',
      limit: 5,
      sort: '-updatedAt', // Placeholder until field exists
    })

    return NextResponse.json({
      counts: {
        users: totalUsers,
        jobs: totalJobs,
        applications: totalApplications,
        tests: totalTestsTaken,
        activeLearners: activeUserCount,
      },
      growthHistory,
      powerUsers: powerUsers.map((u) => {
        const user = u as unknown as User
        return {
          name: user.name,
          email: user.email,
          apps: user.stats?.applicationCount || 0,
        }
      }),
      topJobs: topJobs.map((j) => ({
        title: j.postName,
        board: j.recruitmentBoard,
        id: j.id,
      })),
    })
  } catch (error) {
    console.error('Error in admin analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
