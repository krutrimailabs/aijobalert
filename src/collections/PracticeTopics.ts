import type { CollectionConfig } from 'payload'

export const PracticeTopics: CollectionConfig = {
  slug: 'practice-topics',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      admin: {
        description: 'URL-friendly name (e.g., problems-on-trains)',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'practice-topics',
      filterOptions: ({ id }) => {
        return { id: { not_equals: id } } // Prevent self-parenting loop
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        'General Aptitude',
        'Verbal and Reasoning',
        'Current Affairs & GK',
        'Engineering',
        'Programming',
        'Technical MCQs',
        'Medical Science',
        'Puzzles',
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
