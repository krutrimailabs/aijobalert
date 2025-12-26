import { CollectionConfig, Access } from 'payload'
import { JOB_CATEGORIES, INDIAN_STATES, EDUCATION_LEVELS } from '../../lib/constants'
// We need to import 'fs' and 'path' to read the uploaded file, but Payload hooks run in Node context so it's fine.
// import fs from 'fs'
// import path from 'path'
import { generateJobSummary } from '../../lib/ai-service'
// import { parseJobNotification } from '../../lib/ai-service'
// import { AIParsingButton } from './ui/AIParsingButton' // Reverting to string path

const isStaff: Access = ({ req: { user } }) =>
  Boolean(user?.roles?.some((role: string) => ['admin', 'superadmin'].includes(role)))

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'postName',
    defaultColumns: ['postName', 'recruitmentBoard', 'state', 'lastDate'],
  },
  access: {
    read: ({ req: _req }) => true, // 🌍 Public read access
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // AI Summary Generation (Existing)
        if (operation === 'create' || (operation === 'update' && !data.aiSummary)) {
          if (data.eligibilityDetails) {
            try {
              const content = JSON.stringify(data.eligibilityDetails)
              data.aiSummary = await generateJobSummary(content)
            } catch (err) {
              console.error('Error generating AI summary:', err)
            }
          }
        }

        // AI PDF Parsing - DISABLED
        // if (data.sourcePDF && data.parsingStatus === 'pending') { ... }
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
            // {
            //   name: 'aiParsingUI',
            //   type: 'ui',
            //   admin: {
            //     position: 'sidebar',
            //     components: {
            //       Field: '/collections/Jobs/ui/AIParsingButton',
            //     },
            //   },
            // },
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
                { label: 'Answer Key', value: 'answer_key' },
                { label: 'Syllabus', value: 'syllabus' },
                { label: 'Education Notification', value: 'edu_notification' },
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
          label: 'Important Dates',
          fields: [
            {
              name: 'applicationStartDate',
              type: 'date',
              admin: {
                description: 'When applications open (if different from post date)',
              },
            },
            {
              name: 'examDate',
              type: 'date',
              admin: {
                description: 'Scheduled exam/test date',
              },
            },
            {
              name: 'admitCardDate',
              type: 'date',
              admin: {
                description: 'When admit cards will be released',
              },
            },
            {
              name: 'resultDate',
              type: 'date',
              admin: {
                description: 'Expected result declaration date',
              },
            },
            {
              name: 'ageCalculationDate',
              type: 'date',
              admin: {
                description: 'Reference date for age calculation (e.g., "as on 01-08-2025")',
              },
            },
          ],
        },
        {
          label: 'Eligibility & Requirements',
          fields: [
            {
              name: 'structuredRequirements',
              type: 'group',
              label: 'Structured Eligibility (AI Matching)',
              fields: [
                {
                  name: 'education',
                  type: 'array',
                  fields: [
                    {
                      name: 'levels',
                      type: 'select',
                      hasMany: true,
                      options: [
                        { label: '10th', value: '10th' },
                        { label: '12th', value: '12th' },
                        { label: 'Diploma', value: 'Diploma' },
                        { label: 'Graduate', value: 'Graduate' },
                        { label: 'Post Graduate', value: 'PostGraduate' },
                      ],
                      label: 'Required Levels (Any of)',
                    },
                    {
                      name: 'degrees',
                      type: 'text',
                      hasMany: true,
                      label: 'Specific Degrees (e.g., B.Tech, MBBS)',
                    },
                    {
                      name: 'streams',
                      type: 'text',
                      hasMany: true,
                      label: 'Streams (e.g., CS, Mechanical)',
                    },
                  ],
                },
                {
                  name: 'experience',
                  type: 'group',
                  fields: [
                    { name: 'minYears', type: 'number', defaultValue: 0 },
                    { name: 'maxYears', type: 'number' },
                    { name: 'mandatorySkills', type: 'text', hasMany: true },
                  ],
                },
                {
                  name: 'gender',
                  type: 'select',
                  options: ['Male', 'Female', 'Any'],
                  defaultValue: 'Any',
                },
              ],
            },
            {
              name: 'minimumAge',
              type: 'number',
              admin: {
                description: 'Minimum age requirement in years',
              },
            },
            {
              name: 'maximumAge',
              type: 'number',
              admin: {
                description: 'Maximum age requirement in years',
              },
            },
            {
              name: 'ageRelaxationRules',
              type: 'array',
              label: 'Age Relaxation',
              fields: [
                {
                  name: 'category',
                  type: 'select',
                  options: ['SC', 'ST', 'OBC', 'PWD', 'EWS', 'Ex-Serviceman'],
                  required: true,
                },
                {
                  name: 'years',
                  type: 'number',
                  required: true,
                },
              ],
            },
            {
              name: 'ageRelaxation',
              type: 'richText',
              admin: {
                description: 'Age relaxation explanation details',
              },
            },
            {
              name: 'physicalStandards',
              type: 'richText',
              admin: {
                description: 'Height, weight, chest, and other physical requirements',
              },
            },
          ],
        },
        {
          label: 'Fee & Payment',
          fields: [
            {
              name: 'feeGeneral',
              type: 'text',
              admin: {
                description: 'Application fee for General/UR category (e.g., "Rs. 159/-")',
              },
            },
            {
              name: 'feeOBC',
              type: 'text',
              admin: {
                description: 'Application fee for OBC category',
              },
            },
            {
              name: 'feeSC',
              type: 'text',
              admin: {
                description: 'Application fee for SC category',
              },
            },
            {
              name: 'feeST',
              type: 'text',
              admin: {
                description: 'Application fee for ST category',
              },
            },
            {
              name: 'feeExemptions',
              type: 'textarea',
              admin: {
                description: 'List exemptions (e.g., "Female, PWD, Ex-servicemen")',
              },
            },
            {
              name: 'paymentModes',
              type: 'textarea',
              admin: {
                description:
                  'Accepted payment methods (e.g., "Online via Credit Card, Debit Card, Net Banking")',
              },
            },
          ],
        },
        {
          label: 'Vacancy Details',
          fields: [
            {
              name: 'vacancyBreakdown',
              type: 'richText',
              admin: {
                description: 'Detailed category/post/gender-wise vacancy breakdown table',
              },
            },
            {
              name: 'reservationDetails',
              type: 'richText',
              admin: {
                description: 'SC/ST/OBC/EWS reservation information',
              },
            },
          ],
        },
        {
          label: 'How to Apply',
          fields: [
            {
              name: 'applicationProcess',
              type: 'richText',
              admin: {
                description: 'Step-by-step application instructions',
              },
            },
            {
              name: 'requiredDocuments',
              type: 'array',
              admin: {
                description: 'List of documents required for application',
              },
              fields: [
                {
                  name: 'documentName',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Name of the document (e.g., "10th Marksheet")',
                  },
                },
                {
                  name: 'description',
                  type: 'text',
                  admin: {
                    description: 'Additional details about the document',
                  },
                },
                {
                  name: 'mandatory',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Is this document mandatory?',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Value Add',
          fields: [
            { name: 'applicationFee', type: 'richText' },
            { name: 'selectionProcess', type: 'richText' },
            {
              name: 'importantLinks',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            {
              name: 'shortNotification',
              type: 'upload',
              relationTo: 'media',
              label: 'Short Notice (Fast Read)',
            },
            {
              name: 'previousPapers',
              type: 'relationship',
              relationTo: 'previous-papers',
              hasMany: true,
              label: 'Related Previous Year Papers',
            },
          ],
        },
        {
          label: 'AI & Content',
          fields: [
            {
              name: 'sourcePDF',
              type: 'upload',
              relationTo: 'media',
              label: 'Original Notification (PDF)',
              admin: {
                description: 'Upload the official PDF here to trigger AI parsing.',
              },
            },
            {
              name: 'parsingStatus',
              type: 'select',
              options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Completed', value: 'completed' },
                { label: 'Failed', value: 'failed' },
              ],
              defaultValue: 'pending',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'confidenceScore',
              type: 'number',
              min: 0,
              max: 100,
              admin: {
                position: 'sidebar',
                description: 'AI Confidence Score (0-100)',
              },
            },
            {
              name: 'isVerified',
              type: 'checkbox',
              label: 'Verified via AI/Manual Check',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'expectedCutoff',
              type: 'number',
              admin: {
                description:
                  'Expected cutoff marks (out of 100) for qualification prediction engine',
              },
            },
            { name: 'aiSummary', type: 'textarea' },
            {
              name: 'aiParsingMetadata',
              type: 'json',
              admin: {
                description: 'Raw metadata extracted by AI for debugging',
                readOnly: true,
              },
            },
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
