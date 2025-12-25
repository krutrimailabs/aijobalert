import { CollectionConfig, Access } from 'payload'

const isOwner: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user?.roles?.includes('superadmin') || user?.roles?.includes('admin')) return true
  return { user: { equals: user.id } }
}

const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const SavedJobs: CollectionConfig = {
  slug: 'saved-jobs',
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
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Personal notes about this job',
      },
    },
  ],
  admin: {
    useAsTitle: 'job',
    defaultColumns: ['user', 'job', 'createdAt'],
  },
  timestamps: true,
}
