import { getPayload } from 'payload'
import config from '@/payload.config'
import { JobsPageClient } from '@/components/JobsPageClient'

export const dynamic = 'force-dynamic'

interface Job {
  id: string
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  state?: string
  status?: string
  category?: string[]
  education?: string[]
  postDate?: string
  updatedAt?: string
  salaryStipend?: string
  minimumAge?: number
  maximumAge?: number
  feeGeneral?: string
  applicationStartDate?: string
}

export default async function JobsPage() {
  const payload = await getPayload({ config })

  // Fetch all jobs for client-side filtering
  const { docs: jobs } = await payload.find({
    collection: 'jobs',
    limit: 200,
    sort: '-createdAt',
  })

  // JobsPageClient handles its own layout, sidebar, and responsive design
  return <JobsPageClient initialJobs={jobs as unknown as Job[]} />
}
