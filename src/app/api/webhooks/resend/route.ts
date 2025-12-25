import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()

    // Resend sends an array of events or a single event object
    // Normalized to array for consistent processing
    const events = Array.isArray(body) ? body : [body]

    for (const event of events) {
      if (!event.type || !event.data) continue

      const { type, data } = event

      // Map Resend event types to our schema options
      // Resend types: 'email.sent', 'email.delivered', 'email.opened', 'email.clicked', 'email.bounced', 'email.complained'
      let logType: 'sent' | 'delivered' | 'open' | 'click' | 'bounce' | 'complaint' | null = null

      switch (type) {
        case 'email.sent':
          logType = 'sent'
          break
        case 'email.delivered':
          logType = 'delivered'
          break
        case 'email.opened':
          logType = 'open'
          break
        case 'email.clicked':
          logType = 'click'
          break
        case 'email.bounced':
          logType = 'bounce'
          break
        case 'email.complained':
          logType = 'complaint'
          break
      }

      if (logType) {
        // Attempt to find user by email to link the relationship
        // This is a "best effort" link since not all emails might be to registered users
        let userId = null
        try {
          const { docs: users } = await payload.find({
            collection: 'users',
            where: {
              email: {
                equals: data.to[0], // Assuming single recipient for now
              },
            },
            limit: 1,
          })
          if (users.length > 0) {
            userId = users[0].id
          }
        } catch (e) {
          console.error('Error finding user for webhook:', e)
        }

        await payload.create({
          collection: 'email-logs',
          data: {
            type: logType,
            email: data.to[0],
            resendId: data.email_id,
            // Extract campaign/subject if available in tags or metadata
            // Resend puts custom tags in 'tags' array
            campaign:
              data.tags?.find((t: { name: string; value: string }) => t.name === 'campaign')
                ?.value || 'transactional',
            linkClicked: data.link_url || undefined,
            user: userId,
            metadata: data,
          },
        })
      }
    }

    return NextResponse.json({ message: 'Events processed' }, { status: 200 })
  } catch (error) {
    console.error('Error processing Resend webhook:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
