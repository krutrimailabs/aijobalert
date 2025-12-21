import { CollectionConfig, Access } from 'payload'
import { EDUCATION_LEVELS, INDIAN_STATES } from '../../lib/constants'

const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('superadmin') || user?.roles?.includes('admin')) return true
  if (user) return { id: { equals: user?.id } }
  return false
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    create: () => true, // Anyone can sign up
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('superadmin')),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['candidate'],
      required: true,
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Candidate', value: 'candidate' },
      ],
    },
    // Add these fields to the user so they can "profile" themselves
    {
      name: 'qualification',
      type: 'select',
      hasMany: true,
      options: EDUCATION_LEVELS,
    },
    {
      name: 'domicileState',
      type: 'select',
      options: INDIAN_STATES,
    },
  ],
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
  },
  timestamps: true,
}