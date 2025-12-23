import type { GlobalConfig } from 'payload'

export const SEOSettings: GlobalConfig = {
  slug: 'seoSettings',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Default SEO',
          fields: [
            {
              name: 'defaultTitle',
              type: 'text',
              label: 'Default Page Title',
              defaultValue: 'AI Job Alert - Government Jobs Portal',
            },
            {
              name: 'defaultDescription',
              type: 'textarea',
              label: 'Default Meta Description',
              defaultValue:
                "Find latest government job notifications, admit cards, results, and answer keys. India's No. 1 AI-powered government job portal.",
            },
            {
              name: 'defaultOGImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Default OG Image',
            },
            {
              name: 'keywords',
              type: 'text',
              label: 'Default Keywords',
              admin: {
                description: 'Comma-separated keywords',
              },
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'twitterHandle',
              type: 'text',
              label: 'Twitter Handle',
              admin: {
                description: 'e.g., @aijobalert',
              },
            },
            {
              name: 'facebookAppId',
              type: 'text',
              label: 'Facebook App ID',
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'googleAnalyticsId',
              type: 'text',
              label: 'Google Analytics ID',
              admin: {
                description: 'e.g., G-XXXXXXXXXX',
              },
            },
            {
              name: 'googleSiteVerification',
              type: 'text',
              label: 'Google Site Verification Code',
            },
            {
              name: 'googleAdsenseId',
              type: 'text',
              label: 'Google AdSense Publisher ID',
            },
          ],
        },
        {
          label: 'Page Templates',
          fields: [
            {
              name: 'jobsSEO',
              type: 'group',
              label: 'Jobs Page SEO',
              fields: [
                {
                  name: 'titleTemplate',
                  type: 'text',
                  label: 'Title Template',
                  defaultValue: '{postName} | Latest Notification',
                  admin: {
                    description: 'Use {postName}, {organization}, {lastDate}',
                  },
                },
                {
                  name: 'descriptionTemplate',
                  type: 'text',
                  label: 'Description Template',
                  defaultValue:
                    'Apply for {postName} - {organization}. Total Vacancies: {vacancies}. Last Date: {lastDate}',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
