import { CollectionConfig } from 'payload'
import { sendEmail } from '../../lib/email'

export const Broadcasts: CollectionConfig = {
  slug: 'broadcasts',
  admin: {
    useAsTitle: 'subject',
    group: 'Communication',
    description: 'Send bulk emails to users',
  },
  access: {
    read: ({ req: { user } }) =>
      Boolean(user?.roles?.includes('admin') || user?.roles?.includes('superadmin')),
    create: ({ req: { user } }) =>
      Boolean(user?.roles?.includes('admin') || user?.roles?.includes('superadmin')),
    update: ({ req: { user } }) =>
      Boolean(user?.roles?.includes('admin') || user?.roles?.includes('superadmin')),
    delete: ({ req: { user } }) =>
      Boolean(user?.roles?.includes('admin') || user?.roles?.includes('superadmin')),
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'targetAudience',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All Users', value: 'all' },
        { label: 'Newsletter Subscribers', value: 'subscribers' },
      ],
      required: true,
      admin: {
        description: 'Who should receive this email?',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
      ],
      required: true,
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'recipientCount',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Number of users emailed',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'update' && doc.status === 'sent' && !doc.sentAt) {
          // This ensures we only send once

          try {
            const payload = req.payload

            // 1. Fetch Users based on audience
            const whereQuery: any = {}
            if (doc.targetAudience === 'subscribers') {
              // Only users who opted into email alerts
              whereQuery['notificationPreferences.emailAlerts'] = { equals: true }
            }

            // Batch fetching to handle large scale (simple loop for MVP)
            const users = await payload.find({
              collection: 'users',
              where: whereQuery,
              limit: 1000, // Limit for MVP, ideally use pagination loop
            })

            if (users.docs.length === 0) return

            const recipients = users.docs.map((u) => u.email).filter(Boolean) as string[]

            console.log(`Sending broadcast "${doc.subject}" to ${recipients.length} users...`)

            // 2. Send Emails (Batching by 50 for Resend)
            // Note: For large scale, use a queue like Redis/BullMQ. efficient for MVP.
            // Using BCC to send bulk or iterating. Resend suggests iterating or batching.
            // We will iterate for personalized "Unsubscribe" in future, but for now BCC batch or loop.

            // Simple loop for reliability in MVP context
            for (const email of recipients) {
              // Convert RichText to HTML (simplified helper needed or assumed plain text transport for now)
              // Integrating a basic HTML wrapper
              await sendEmail({
                to: email,
                subject: doc.subject,
                html: `<div style="font-family: sans-serif;">
                           <h1>${doc.subject}</h1>
                           <p>Hello,</p>
                           <p>Please check the app for the full content.</p>
                           <hr />
                           <p><small>AI Job Alert Team</small></p>
                           </div>`,
                // TODO: Actual RichText to HTML conversion
              })
            }

            // 3. Update doc to mark as sent
            await payload.update({
              collection: 'broadcasts',
              id: doc.id,
              data: {
                sentAt: new Date().toISOString(),
                recipientCount: recipients.length,
              },
            })
          } catch (error) {
            console.error('Broadcast failed', error)
          }
        }
      },
    ],
  },
}
