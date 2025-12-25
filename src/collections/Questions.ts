import type { CollectionConfig } from 'payload'

export const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'text', // In a real app we might want a truncated version or a code
    group: 'Education',
    defaultColumns: ['subject', 'marks', 'id'],
  },
  fields: [
    {
      name: 'text',
      type: 'richText',
      required: true,
      label: 'Question Text',
    },
    {
      name: 'options',
      type: 'array',
      minRows: 2,
      maxRows: 5,
      required: true,
      fields: [
        {
          name: 'text',
          type: 'richText', // Options can have images/formulas
          required: true,
        },
        {
          name: 'isCorrect',
          type: 'checkbox',
          label: 'Is this the correct answer?',
          required: true,
          // Validation to ensure only one correct option per question would be good,
          // but complex in basic config. Relying on admin entry.
        },
      ],
    },
    {
      // Storing correct option index might be simpler for frontend,
      // but 'isCorrect' on option is more data-resilient if options are reordered.
      // We'll stick to 'isCorrect' flag in options for robustness.
      name: 'explanation',
      type: 'richText',
      label: 'Solution / Explanation',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'marks',
          type: 'number',
          defaultValue: 1,
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'negativeMarks',
          type: 'number',
          defaultValue: 0.25,
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'topic',
      type: 'relationship',
      relationTo: 'practice-topics',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subject',
      type: 'select',
      required: true,
      options: [
        { label: 'Quantitative Aptitude', value: 'quant' },
        { label: 'Reasoning Ability', value: 'reasoning' },
        { label: 'English Language', value: 'english' },
        { label: 'General Awareness', value: 'ga' },
        { label: 'Computer Knowledge', value: 'computer' },
      ],
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
      ],
      defaultValue: 'medium',
    },
    {
      name: 'examTags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Bank (IBPS/SBI)', value: 'bank' },
        { label: 'SSC (CGL/CHSL)', value: 'ssc' },
        { label: 'Railway', value: 'railway' },
        { label: 'UPSC/State PSC', value: 'upsc' },
        { label: 'Defense', value: 'defense' },
        { label: 'Engineering/Technical', value: 'engineering' },
      ],
      admin: {
        description: 'Tag this question for specific exam types (optional)',
        position: 'sidebar',
      },
    },
  ],
}
