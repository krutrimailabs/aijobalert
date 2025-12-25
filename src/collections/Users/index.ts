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
    // Profile fields for job matching
    {
      name: 'qualification',
      type: 'select',
      hasMany: true,
      options: EDUCATION_LEVELS,
      admin: {
        description: 'Your educational qualifications',
      },
    },
    {
      name: 'domicileState',
      type: 'select',
      options: INDIAN_STATES,
      admin: {
        description: 'Your home state (for domicile-based jobs)',
      },
    },
    {
      name: 'preferredStates',
      type: 'select',
      hasMany: true,
      options: INDIAN_STATES,
      admin: {
        description: 'States where you want to find jobs',
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        description: 'Used to calculate age eligibility',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General', value: 'General' },
        { label: 'OBC', value: 'OBC' },
        { label: 'SC', value: 'SC' },
        { label: 'ST', value: 'ST' },
        { label: 'EWS', value: 'EWS' },
      ],
      admin: {
        description: 'Reservation category (for age relaxation)',
      },
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      name: 'physicallyDisabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'PWD category (for age relaxation and reserved posts)',
      },
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        {
          name: 'lastLoginAt',
          type: 'date',
          admin: {
            description: 'Last time the user logged in',
          },
        },
        {
          name: 'loginCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total number of logins',
          },
        },
        {
          name: 'applicationCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total applications submitted (auto-calculated)',
          },
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notificationPreferences',
      type: 'group',
      fields: [
        {
          name: 'emailAlerts',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Email Alerts',
        },
        {
          name: 'dailyDigest',
          type: 'checkbox',
          defaultValue: true,
          label: 'Receive Daily Digest',
          admin: {
            description: 'Summary of new jobs every morning',
          },
        },
        {
          name: 'instantJobAlerts',
          type: 'checkbox',
          defaultValue: false,
          label: 'Instant New Job Alerts',
          admin: {
            description: 'Immediate email when a high-match job is posted',
          },
        },
        {
          name: 'applicationUpdates',
          type: 'checkbox',
          defaultValue: true,
          label: 'Application Status Updates',
          admin: {
            description: 'Alerts for Admit Card/Result of applied jobs',
          },
        },
      ],
    },
  ],
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
  },
  timestamps: true,
}
