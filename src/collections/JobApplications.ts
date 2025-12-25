import { CollectionConfig, Access } from 'payload'

const isOwner: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user?.roles?.includes('superadmin') || user?.roles?.includes('admin')) return true
  return { user: { equals: user.id } }
}

const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  access: {
    read: isOwner,
    create: isAuthenticated,
    update: isOwner,
    delete: isOwner,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'applied',
      options: [
        { label: 'Applied', value: 'applied' },
        { label: 'Admit Card Downloaded', value: 'admit-card-downloaded' },
        { label: 'Exam Given', value: 'exam-given' },
        { label: 'Result Awaited', value: 'result-awaited' },
        { label: 'Selected', value: 'selected' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'applicationDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'Date when you applied',
      },
    },
    {
      name: 'admitCardDate',
      type: 'date',
      admin: {
        description: 'Date when admit card was downloaded',
        condition: (data) =>
          [
            'admit-card-downloaded',
            'exam-given',
            'result-awaited',
            'selected',
            'rejected',
          ].includes(data.status),
      },
    },
    {
      name: 'examDate',
      type: 'date',
      admin: {
        description: 'Exam date',
        condition: (data) =>
          ['exam-given', 'result-awaited', 'selected', 'rejected'].includes(data.status),
      },
    },
    {
      name: 'resultDate',
      type: 'date',
      admin: {
        description: 'Result declaration date',
        condition: (data) => ['selected', 'rejected'].includes(data.status),
      },
    },
    {
      name: 'notes',
      type: 'richText',
      admin: {
        description: 'Application notes, preparation status, etc.',
      },
    },
  ],
  admin: {
    useAsTitle: 'job',
    defaultColumns: ['user', 'job', 'status', 'applicationDate'],
  },
  timestamps: true,
}
