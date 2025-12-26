import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// GET /api/analytics/dashboard
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's test attempts
    const { docs: attempts } = await payload.find({
      collection: 'test-attempts',
      where: {
        user: { equals: user.user.id },
        status: { equals: 'completed' },
      },
      depth: 1,
      limit: 100, // Analyze last 100 tests
      sort: 'createdAt', // Ensure chronological order for trends
    })

    if (attempts.length === 0) {
      return NextResponse.json({
        metrics: { avgScore: 0, testsTaken: 0, accuracy: 0, timeSpent: 0 },
        history: [],
        weakAreas: [],
      })
    }

    // Calculate Metrics
    const totalTests = attempts.length
    const totalScore = attempts.reduce((acc, curr) => acc + (curr.score || 0), 0)
    const avgScore = Math.round(totalScore / totalTests)

    // Trend History (Date vs Score)
    const history = attempts.map((a) => ({
      date: new Date(a.createdAt).toLocaleDateString(),
      score: a.score || 0,
      testName: typeof a.test === 'object' ? a.test.title : 'Unknown Test',
    }))

    // Mock Subject Data until deep aggregation is implemented
    // In real app, this would iterate attempts -> answers -> question -> subject/tag
    const subjectPerformance = [
      { subject: 'Math', score: 70 },
      { subject: 'English', score: 85 },
      { subject: 'Reasoning', score: 60 },
      { subject: 'GK', score: 45 },
    ]

    // Calculate Weak Areas (Simplified: based on low scores in specific tests for now)
    // A real implementation would aggregate metrics by 'Subject' tag on Questions
    // Since we don't have deep question analytics in this simple pass, we'll placeholder it
    // or infer from low scoring tests.

    // 5. Calculate Streaks & Heatmap
    // Sort attempts by date ascending for streak calc
    const sortedAttempts = [...attempts].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )

    // Heatmap Data (Date string -> Count)
    const activityMap = new Map<string, number>()
    sortedAttempts.forEach((a) => {
      const date = new Date(a.createdAt).toISOString().split('T')[0] // YYYY-MM-DD
      activityMap.set(date, (activityMap.get(date) || 0) + 1)
    })

    const heatmap = Array.from(activityMap.entries()).map(([date, count]) => ({ date, count }))

    // Streaks Calculation
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let lastDateStr = ''

    // Unique dates sorted
    const uniqueDates = Array.from(activityMap.keys()).sort()

    uniqueDates.forEach((dateStr) => {
      const currentDate = new Date(dateStr)

      if (!lastDateStr) {
        tempStreak = 1
      } else {
        const lastDate = new Date(lastDateStr)
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          // Consecutive day
          tempStreak++
        } else {
          // Broken streak
          longestStreak = Math.max(longestStreak, tempStreak)
          tempStreak = 1
        }
      }
      lastDateStr = dateStr
    })

    // Check if the streak is active (last date was today or yesterday)
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    longestStreak = Math.max(longestStreak, tempStreak)

    // Current streak is valid only if last activity was today or yesterday
    if (lastDateStr === today || lastDateStr === yesterday) {
      currentStreak = tempStreak
    } else {
      currentStreak = 0
    }

    // 6. Time Analysis (Mock Topper Comparison)
    // Avg time per test converted to minutes
    const userAvgTimeMins = Math.round(
      attempts.reduce((acc, curr) => acc + (curr.totalTimeSpent || 0), 0) / (totalTests || 1) / 60,
    )
    const topperAvgTimeMins = Math.max(1, Math.round(userAvgTimeMins * 0.7)) // Mock: Topper is 30% faster

    return NextResponse.json({
      metrics: {
        avgScore,
        testsTaken: totalTests,
        accuracy: 75,
        timeSpent: attempts.reduce((acc, curr) => acc + (curr.totalTimeSpent || 0), 0),
      },
      history,
      subjectPerformance,
      weakAreas: ['General Awareness', 'Reasoning'],
      heatmap,
      streaks: {
        current: currentStreak,
        longest: longestStreak,
        isActive: currentStreak > 0,
      },
      timeAnalysis: {
        userAvg: userAvgTimeMins,
        topperAvg: topperAvgTimeMins,
      },
    })
  } catch (error) {
    console.error('Error in analytics dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
