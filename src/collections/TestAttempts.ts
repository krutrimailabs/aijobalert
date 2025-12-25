import type { CollectionConfig } from 'payload'

export const TestAttempts: CollectionConfig = {
  slug: 'test-attempts',
  admin: {
    useAsTitle: 'id',
    group: 'Education Result',
    defaultColumns: ['user', 'test', 'score', 'createdAt'],
  },
  access: {
    create: ({ req: { user } }) => !!user, // Only logged in users
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users' && user.roles?.includes('admin')) return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (user?.collection === 'users' && user.roles?.includes('admin')) return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'test',
      type: 'relationship',
      relationTo: 'mock-tests',
      required: true,
      hasMany: false,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'in_progress',
    },
    {
      name: 'score',
      type: 'number',
    },
    {
      name: 'totalTimeSpent',
      type: 'number',
      label: 'Total Time Spent (seconds)',
    },
    {
      name: 'answers',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'relationship',
          relationTo: 'questions',
          required: true,
        },
        {
          name: 'userSelectedOptionId',
          type: 'text', // ID of the option block from Questions collection
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Answered', value: 'answered' },
            { label: 'Marked For Review', value: 'marked_review' },
            { label: 'Answered & Marked for Review', value: 'ans_marked_review' },
            { label: 'Skipped', value: 'skipped' },
            { label: 'Not Visited', value: 'not_visited' },
          ],
        },
        {
          name: 'timeSpent',
          type: 'number',
          label: 'Time spent on this question (seconds)',
        },
      ],
    },
  ],
}
