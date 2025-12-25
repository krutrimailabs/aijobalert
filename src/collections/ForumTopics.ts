import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const ForumTopics: CollectionConfig = {
  slug: 'forum-topics',
  admin: {
    useAsTitle: 'title',
    group: 'Community',
    defaultColumns: ['title', 'threadCount'],
  },
  access: {
    read: anyone,
    create: authenticated, // Consider admin only for topics? For now authenticated.
    update: authenticated, // Admin only in real app usually
    delete: authenticated, // Admin only
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'relationship',
      relationTo: 'media',
    },
    slugField(),
    {
      name: 'threadCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}
