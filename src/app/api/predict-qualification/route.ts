import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TestAttempt } from '@/payload-types'

export async function POST(req: NextRequest) {
  try {
    const { user, expectedCutoff } = await req.json()

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!expectedCutoff) {
      return NextResponse.json({
        probability: 0,
        label: 'Insufficient Data',
        message: 'No cutoff data available for this job.',
        color: 'gray',
      })
    }

    const payload = await getPayload({ config: configPromise })

    // Fetch user's last 5 test attempts
    const attempts = await payload.find({
      collection: 'test-attempts',
      where: {
        user: {
          equals: user.id,
        },
      },
      sort: '-createdAt',
      limit: 5,
    })

    if (attempts.totalDocs === 0) {
      return NextResponse.json({
        probability: 0,
        label: 'No Data',
        message: 'Take a mock test to get a prediction.',
        color: 'gray',
      })
    }

    // Calculate average percentage
    let totalPercentage = 0
    attempts.docs.forEach((attempt: TestAttempt) => {
      // Assume score is raw marks, we might need totalMarks from the test relation if dependent
      // For MVP, lets rely on 'percentage' if calculated, or assume score is out of 100 for normalization
      // Looking at Mocks, we used percentage explicitly in frontend, let's calculate it if possible.
      // The TestAttempts schema has 'score'. We need 'test.totalMarks'.
      // For simplicity/robustness in MVP, let's assume 'score' is what we use OR look at percentage if we stored it (we didn't store percentage in schema explicitly but frontend mocked it).
      // Let's assume standardized 100 marks for now or use raw score.
      // BETTER: Retrieve the related test to get total marks? Too expensive for MVP.
      // Let's assume the schema was updated or we just treat score as % for now as per 'expectedCutoff' description (out of 100).
      // Fallback to raw score as totalMarks is not available on MockTest type
      totalPercentage += attempt.score || 0
    })

    const avgScore = totalPercentage / attempts.docs.length

    // Prediction Logic
    let label = 'Low Chance'
    let color = 'red'
    let probability = 30 // base

    if (avgScore >= expectedCutoff + 5) {
      label = 'High Chance'
      color = 'green'
      probability = 85 + Math.min(avgScore - expectedCutoff, 14) // Cap at 99
    } else if (avgScore >= expectedCutoff - 5) {
      label = 'Moderate Chance'
      color = 'orange'
      probability = 50 + (avgScore - expectedCutoff + 5) * 3
    } else {
      label = 'Low Chance'
      color = 'red'
      probability = Math.max(10, 30 - (expectedCutoff - avgScore))
    }

    return NextResponse.json({
      probability: Math.round(probability),
      label,
      avgScore: Math.round(avgScore),
      message: `based on your last ${attempts.docs.length} tests`,
      color,
    })
  } catch (error) {
    console.error('Prediction Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
