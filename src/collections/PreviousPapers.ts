import type { CollectionConfig } from 'payload'

export const PreviousPapers: CollectionConfig = {
  slug: 'previous-papers',
  admin: {
    useAsTitle: 'title',
    group: 'Education',
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
      name: 'examName',
      type: 'text', // e.g., 'SSC CGL 2023 Tier-1'
      required: true,
    },
    {
      name: 'examCategory',
      type: 'select',
      options: [
        { label: 'SSC', value: 'ssc' },
        { label: 'Banking', value: 'banking' },
        { label: 'Teaching', value: 'teaching' },
        { label: 'UPSC', value: 'upsc' },
        { label: 'Defence', value: 'defence' },
        { label: 'State Exams', value: 'state' },
      ],
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      min: 2010,
      max: 2030,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}
