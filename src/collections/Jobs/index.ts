import { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'postName',
    defaultColumns: ['postName', 'recruitmentBoard', 'state', 'lastDate'],
  },
  access: {
    read: () => true, // 🌍 Public can read job alerts
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            {
              name: 'postDate',
              type: 'date',
              required: true,
              admin: { position: 'sidebar' },
            },
            { name: 'recruitmentBoard', type: 'text', required: true },
            { name: 'postName', type: 'text', required: true },
            { name: 'advtNo', type: 'text' },
            { name: 'totalVacancies', type: 'number' },
            { name: 'lastDate', type: 'date', required: true },
          ],
        },
        {
          label: 'Classification',
          fields: [
            {
              name: 'category',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Bank', value: 'bank' },
                { label: 'Teaching', value: 'teaching' },
                { label: 'Engineering', value: 'engineering' },
                { label: 'Railway', value: 'railway' },
                { label: 'Police/Defence', value: 'police' },
              ],
            },
            {
              name: 'state',
              type: 'select',
              options: [
                { label: 'Andhra Pradesh', value: 'AP' },
                { label: 'Assam', value: 'AS' },
                { label: 'Bihar', value: 'BR' },
                { label: 'Chhattisgarh', value: 'CG' },
                { label: 'Delhi', value: 'DL' },
                { label: 'Gujarat', value: 'GJ' },
                { label: 'Telangana', value: 'TS' },
                { label: 'Uttar Pradesh', value: 'UP' },
                { label: 'West Bengal', value: 'WB' },
              ],
            },
            {
              name: 'education',
              type: 'select',
              hasMany: true,
              options: [
                { label: '8TH', value: '8TH' },
                { label: '10TH', value: '10TH' },
                { label: '12TH', value: '12TH' },
                { label: 'Diploma', value: 'Diploma' },
                { label: 'ITI', value: 'ITI' },
                { label: 'Graduate', value: 'Graduate' },
                { label: 'B.Tech/B.E', value: 'B.Tech' },
                { label: 'Post Graduate', value: 'PG' },
              ],
            },
          ],
        },
        {
          label: 'AI & Content',
          fields: [
            { name: 'aiSummary', type: 'textarea' },
            { name: 'eligibilityDetails', type: 'richText' },
            { name: 'salaryStipend', type: 'text' },
            { name: 'applyLink', type: 'text' },
            {
              name: 'officialNotification',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
  ],
}