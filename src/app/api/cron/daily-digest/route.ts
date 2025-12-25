import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendEmail } from '@/lib/email'

export const maxDuration = 60 // 1 minute max duration for Hobby plan, adjust for Pro

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const payload = await getPayload({ config })

    // 1. Find jobs posted in the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const newJobs = await payload.find({
      collection: 'jobs',
      where: {
        createdAt: {
          greater_than: yesterday,
        },
      },
      limit: 10, // Limit digest to top 10 new jobs
      sort: '-createdAt',
    })

    if (newJobs.docs.length === 0) {
      return NextResponse.json({ message: 'No new jobs found' })
    }

    // 2. Find subscribers who want daily digest
    const users = await payload.find({
      collection: 'users',
      where: {
        'notificationPreferences.dailyDigest': {
          equals: true,
        },
      },
      limit: 1000,
    })

    if (users.docs.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' })
    }

    // 3. Generate Email Content
    const jobListHtml = newJobs.docs
      .map(
        (job) => `
        <div style="margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 12px;">
          <h3 style="margin: 0;"><a href="${process.env.NEXT_PUBLIC_SERVER_URL}/jobs/${job.id}">${job.postName}</a></h3>
          <p style="margin: 4px 0; color: #666;">${job.recruitmentBoard}</p>
          <p style="margin: 0; font-size: 12px;">Last Date: ${new Date(job.lastDate).toLocaleDateString()}</p>
        </div>
      `,
      )
      .join('')

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Daily Job Digest</h1>
        <p>Here are the latest government jobs posted in the last 24 hours:</p>
        <hr />
        ${jobListHtml}
        <hr />
        <p><small>You are receiving this because you subscribed to daily digests. update preferences in your dashboard.</small></p>
      </div>
    `

    // 4. Send Emails (Batch/Loop)
    let emailCount = 0
    for (const user of users.docs) {
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: `Daily Job Digest - ${newJobs.docs.length} New Jobs`,
          html: emailHtml,
        })
        emailCount++
      }
    }

    return NextResponse.json({
      message: 'Daily digest sent',
      jobsFound: newJobs.docs.length,
      emailsSent: emailCount,
    })
  } catch (error) {
    console.error('Daily digest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
