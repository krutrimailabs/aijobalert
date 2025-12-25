import type { CollectionConfig } from 'payload'

export const MockTests: CollectionConfig = {
  slug: 'mock-tests',
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
      name: 'examType',
      type: 'select',
      required: true,
      options: [
        { label: 'IBPS PO/Clerk', value: 'ibps' },
        { label: 'SSC CGL/CHSL', value: 'ssc' },
        { label: 'Railway (RRB)', value: 'rrb' },
        { label: 'UPSC', value: 'upsc' },
        { label: 'State Exams', value: 'state' },
      ],
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      label: 'Total Duration (minutes)',
    },
    {
      name: 'hasSectionalTimer',
      type: 'checkbox',
      label: 'Enable Sectional Timing (Auto-switch)',
      defaultValue: false,
    },
    {
      name: 'sections',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'duration',
          type: 'number',
          label: 'Section Duration (minutes)',
          admin: {
            description: 'Required if Sectional Timing is enabled',
          },
        },
        {
          name: 'order',
          type: 'number',
          required: true,
        },
        {
          name: 'subject',
          type: 'select',
          options: [
            { label: 'Quantitative Aptitude', value: 'quant' },
            { label: 'Reasoning Ability', value: 'reasoning' },
            { label: 'English Language', value: 'english' },
            { label: 'General Awareness', value: 'ga' },
            { label: 'Computer Knowledge', value: 'computer' },
          ],
        },
      ],
    },
    {
      name: 'questions',
      type: 'relationship',
      relationTo: 'questions',
      hasMany: true,
      admin: {
        description: 'Select questions for this test',
      },
    },
  ],
}
