import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const Threads: CollectionConfig = {
  slug: 'threads',
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Community',
    defaultColumns: ['title', 'author', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedQuestion',
      type: 'relationship',
      relationTo: 'questions',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'topic',
      type: 'relationship',
      relationTo: 'forum-topics',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'upvotes',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'downvotes',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'General', value: 'general' },
        { label: 'Exam Strategy', value: 'strategy' },
        { label: 'Doubt', value: 'doubt' },
        { label: 'News', value: 'news' },
        { label: 'Success Story', value: 'success-story' },
      ],
      admin: {
        position: 'sidebar',
      },
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
      name: 'slug',
      type: 'text',
      index: true,
      label: 'Slug',
    },
  ],
}
