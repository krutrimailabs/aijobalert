import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'id', // Just use ID for now
    group: 'Community',
  },
  access: {
    read: () => true, // Publicly readable
    create: ({ req: { user } }) => !!user, // Logged in users can comment
    update: ({ req: { user } }) => {
      if (user?.collection === 'users' && user.roles?.includes('admin')) return true
      return { user: { equals: user?.id } }
    },
    delete: ({ req: { user } }) => {
      if (user?.collection === 'users' && user.roles?.includes('admin')) return true
      return { user: { equals: user?.id } }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'question',
      type: 'relationship',
      relationTo: 'questions',
      required: false,
    },
    {
      name: 'thread',
      type: 'relationship',
      relationTo: 'threads',
      required: false,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'published', // Auto-approve for now
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'upvotes',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'downvotes',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
