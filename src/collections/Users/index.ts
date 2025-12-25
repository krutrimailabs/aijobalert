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
    // Profile fields for job matching
    {
      name: 'educationHistory',
      type: 'array',
      label: 'Education History',
      admin: {
        description: 'Add your educational qualifications from 10th onwards',
      },
      fields: [
        {
          name: 'level',
          type: 'select',
          required: true,
          options: [
            { label: '10th (Matriculation)', value: '10th' },
            { label: '12th (Intermediate)', value: '12th' },
            { label: 'Diploma', value: 'Diploma' },
            { label: 'Graduate (Bachelor)', value: 'Graduate' },
            { label: 'Post Graduate (Master)', value: 'PostGraduate' },
            { label: 'PhD', value: 'PhD' },
          ],
        },
        {
          name: 'degree',
          type: 'text',
          label: 'Degree / Course Name',
          admin: {
            placeholder: 'e.g., B.Tech, MBBS, B.A.',
            condition: (_data, siblingData) => !['10th', '12th'].includes(siblingData?.level),
          },
        },
        {
          name: 'stream',
          type: 'text',
          label: 'Stream / Specialization',
          admin: {
            placeholder: 'e.g., Computer Science, Civil Engineering',
            condition: (_data, siblingData) => !['10th'].includes(siblingData?.level),
          },
        },
        {
          name: 'passingYear',
          type: 'number',
          min: 1950,
          max: 2030,
        },
        {
          name: 'percentage',
          type: 'number',
          min: 0,
          max: 100,
          label: 'Percentage / CGPA (converted)',
        },
      ],
    },
    // Keep deprecated field for migration
    {
      name: 'qualification',
      type: 'select',
      hasMany: true,
      options: EDUCATION_LEVELS,
      admin: {
        readOnly: true,
        description: 'DEPRECATED: Use Education History above. (Read-only)',
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
      name: 'disability',
      type: 'group',
      label: 'Disability Details (PWD)',
      fields: [
        {
          name: 'isEnabled',
          type: 'checkbox',
          label: 'Are you a Person with Disability (PWD)?',
          defaultValue: false,
        },
        {
          name: 'type',
          type: 'select',
          label: 'Type of Disability',
          options: [
            { label: 'Visual Impairment (VI)', value: 'VI' },
            { label: 'Hearing Impairment (HI)', value: 'HI' },
            { label: 'Locomotor Disability (LD)', value: 'LD' },
            { label: 'Other / Multiple', value: 'Other' },
          ],
          admin: {
            condition: (_data, siblingData) => siblingData.isEnabled,
          },
        },
        {
          name: 'percentage',
          type: 'number',
          label: 'Disability Percentage',
          admin: {
            condition: (_data, siblingData) => siblingData.isEnabled,
          },
        },
      ],
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
