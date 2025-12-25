import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Jobs } from './collections/Jobs'
import { SavedJobs } from './collections/SavedJobs'
import { Broadcasts } from './collections/Broadcasts'
import { JobApplications } from './collections/JobApplications'
import { EmailLogs } from './collections/EmailLogs'
import { MockTests } from './collections/MockTests'
import { Questions } from './collections/Questions'
import { TestAttempts } from './collections/TestAttempts'
import { PreviousPapers } from './collections/PreviousPapers'
import { Comments } from './collections/Comments'
import { PracticeTopics } from './collections/PracticeTopics'
import { CurrentAffairs } from './collections/CurrentAffairs'
import { Syllabus } from './collections/Syllabus'

import { Threads } from './collections/Threads'
import { ForumTopics } from './collections/ForumTopics'
import { Votes } from './collections/Votes'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './globals/SiteSettings'
import { Footer as FooterGlobal } from './globals/Footer'
import { SEOSettings } from './globals/SEOSettings'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: ' desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [
    Users,
    Media,
    Jobs,
    SavedJobs,
    JobApplications,
    Broadcasts,
    Posts,
    Categories,
    EmailLogs,
    MockTests,
    Questions,
    TestAttempts,
    PreviousPapers,
    Comments,
    PracticeTopics,
    CurrentAffairs,
    Syllabus,
    Threads,
    ForumTopics,
    Votes,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings, FooterGlobal, SEOSettings],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})

import { Config } from './payload-types'

declare module 'payload' {
  export interface GeneratedTypes extends Config {
    _?: never
  }
}
