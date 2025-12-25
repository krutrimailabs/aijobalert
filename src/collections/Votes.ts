import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Votes: CollectionConfig = {
  slug: 'votes',
  admin: {
    useAsTitle: 'id',
    group: 'Community',
    hidden: true, // Hide from admin sidebar mostly, or keep for debugging
  },
  access: {
    read: authenticated, // Users can read votes (usually restricted to their own or aggregated)
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Up', value: 'up' },
        { label: 'Down', value: 'down' },
      ],
      required: true,
    },
    {
      name: 'thread',
      type: 'relationship',
      relationTo: 'threads',
      index: true,
    },
    {
      name: 'comment',
      type: 'relationship',
      relationTo: 'comments',
      index: true,
    },
    // We ideally want a composite unique index on [user, thread] and [user, comment]
    // Payload doesn't support composite unique indexes directly in the config easily yet without custom DB adapters or hooks checking.
    // We will handle uniqueness in the API logic.
  ],
}
