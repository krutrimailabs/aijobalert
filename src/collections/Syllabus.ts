import type { CollectionConfig } from 'payload'

export const Syllabus: CollectionConfig = {
  slug: 'syllabus',
  admin: {
    useAsTitle: 'title',
    group: 'Education',
    defaultColumns: ['title', 'category', 'subject'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Syllabus Title (e.g., SSC CGL Tier-1 Quant)',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'SSC', value: 'ssc' },
        { label: 'Banking', value: 'banking' },
        { label: 'UPSC', value: 'upsc' },
        { label: 'Railways', value: 'railways' },
        { label: 'Teaching', value: 'teaching' },
        { label: 'State Exams', value: 'state-exams' },
        { label: 'Defence', value: 'defence' },
      ],
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Subject (e.g., Mathematics, General Awareness)',
    },
    {
      name: 'topics',
      type: 'array',
      label: 'Detailed Topics',
      fields: [
        {
          name: 'topicName',
          type: 'text',
          required: true,
        },
        {
          name: 'subTopics',
          type: 'textarea',
          label: 'Sub-topics (comma separated)',
        },
        {
          name: 'weightage',
          type: 'text',
          label: 'Expected Marks/Weightage',
        },
      ],
    },
    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'media',
      label: 'Official Syllabus PDF (Optional)',
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
