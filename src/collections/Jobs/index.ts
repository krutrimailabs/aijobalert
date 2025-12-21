import { CollectionConfig, Access } from 'payload'
import { JOB_CATEGORIES, INDIAN_STATES, EDUCATION_LEVELS } from '../../lib/constants'
import { generateJobSummary } from '../../lib/ai-service'

const isStaff: Access = ({ req: { user } }) => 
  Boolean(user?.roles?.some((role: string) => ['admin', 'superadmin'].includes(role)))

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'postName',
    defaultColumns: ['postName', 'recruitmentBoard', 'state', 'lastDate'],
  },
  access: {
    read: () => true, // 🌍 Public read access
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' || (operation === 'update' && !data.aiSummary)) {
          // If we have eligibility details, try to generate a summary
          if (data.eligibilityDetails) {
            try {
              const content = JSON.stringify(data.eligibilityDetails)
              data.aiSummary = await generateJobSummary(content)
            } catch (err) {
              console.error('Error generating AI summary:', err)
            }
          }
        }
        return data
      },
    ],
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
            {
              name: 'status',
              type: 'select',
              defaultValue: 'open',
              options: [
                { label: 'Open', value: 'open' },
                { label: 'Admit Card Out', value: 'admit_card' },
                { label: 'Result Declared', value: 'result' },
                { label: 'Closed', value: 'closed' },
              ],
              admin: { position: 'sidebar' },
            },
          ],
        },
        {
          label: 'Classification',
          fields: [
            {
              name: 'category',
              type: 'select',
              hasMany: true,
              options: JOB_CATEGORIES,
            },
            {
              name: 'state',
              type: 'select',
              options: INDIAN_STATES,
            },
            {
              name: 'education',
              type: 'select',
              hasMany: true,
              options: EDUCATION_LEVELS,
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