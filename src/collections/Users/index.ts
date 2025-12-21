import type { CollectionConfig } from 'payload'
// We will use these access functions to handle our 3 goals
import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // 🔐 Enables login/password
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
  },
  access: {
    // We will refine these once we've tested the fields!
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
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
    // 👤 Candidate Profiling Fields (For personalized job alerts)
    {
      name: 'statePreference',
      type: 'select',
      options: ['AP', 'AS', 'BR', 'CG', 'DL', 'GJ', 'TS', 'UP', 'WB'], 
    },
    {
      name: 'educationLevel',
      type: 'select',
      options: ['10TH', '12TH', 'Diploma', 'Graduate', 'B.Tech', 'PG'],
    },
  ],
  timestamps: true,
}