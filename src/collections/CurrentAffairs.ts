import type { CollectionConfig } from 'payload'

export const CurrentAffairs: CollectionConfig = {
  slug: 'current-affairs',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'date', 'category'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'National', value: 'national' },
        { label: 'International', value: 'international' },
        { label: 'Sports', value: 'sports' },
        { label: 'Economy', value: 'economy' },
        { label: 'Science & Tech', value: 'science-tech' },
        { label: 'Appointments', value: 'appointments' },
        { label: 'Awards', value: 'awards' },
      ],
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      label: 'Short Summary',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Full Article',
    },
    {
      name: 'source',
      type: 'text',
      label: 'Source URL (optional)',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Keywords/Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
  ],
}
