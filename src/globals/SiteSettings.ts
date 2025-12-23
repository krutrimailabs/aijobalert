import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'AI JOB ALERT',
              label: 'Site Name',
            },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: "INDIA'S NO. 1 GOVERNMENT JOB PORTAL Powered by AI",
              label: 'Site Tagline',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Site Logo',
            },
          ],
        },
        {
          label: 'Social Links',
          fields: [
            {
              name: 'telegramLink',
              type: 'text',
              label: 'Telegram Channel URL',
              defaultValue: 'https://t.me/aijobalert',
            },
            {
              name: 'whatsappLink',
              type: 'text',
              label: 'WhatsApp URL',
            },
            {
              name: 'twitterLink',
              type: 'text',
              label: 'Twitter/X URL',
            },
            {
              name: 'facebookLink',
              type: 'text',
              label: 'Facebook URL',
            },
            {
              name: 'instagramLink',
              type: 'text',
              label: 'Instagram URL',
            },
            {
              name: 'youtubeLink',
              type: 'text',
              label: 'YouTube URL',
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              label: 'Contact Email',
            },
            {
              name: 'contactPhone',
              type: 'text',
              label: 'Contact Phone',
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Office Address',
            },
          ],
        },
      ],
    },
  ],
}
