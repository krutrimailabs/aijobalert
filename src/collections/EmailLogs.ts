import { CollectionConfig } from 'payload'

export const EmailLogs: CollectionConfig = {
  slug: 'email-logs',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'email', 'createdAt'],
    group: 'Analytics',
  },
  access: {
    read: ({ req: { user } }) =>
      Boolean(user?.roles?.includes('admin') || user?.roles?.includes('superadmin')),
    create: () => true, // Allow webhook to create
    update: () => false, // Logs should be immutable
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('superadmin')),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Sent', value: 'sent' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Opened', value: 'open' },
        { label: 'Clicked', value: 'click' },
        { label: 'Bounced', value: 'bounce' },
        { label: 'Complained', value: 'complaint' },
      ],
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'resendId',
      type: 'text',
      label: 'Resend Message ID',
      index: true,
    },
    {
      name: 'campaign', // e.g., 'daily-digest', 'welcome', 'job-alert'
      type: 'text',
      index: true,
    },
    {
      name: 'linkClicked', // For click events
      type: 'text',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      index: true,
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
