import { getPayload } from 'payload'
import config from '@/payload.config'
import { JobsPageClient } from '@/components/JobsPageClient'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Job {
  id: string
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  state?: string
  status?: string
}

export default async function JobsPage() {
  const payload = await getPayload({ config })
  
  // Initial fetch of 'open' jobs
  const { docs: jobs } = await payload.find({
    collection: 'jobs',
    limit: 50, // High limit for table view
    sort: '-createdAt',
    where: {
       status: { equals: 'open' }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        
        {/* Page Header */}
        <div className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900 mb-2">Identify Your Next Opportunity</h1>
           <p className="text-gray-600">Browse through all active government job notifications. Filter by state or qualification to find your perfect match.</p>
        </div>

        <JobsPageClient initialJobs={jobs as unknown as Job[]} />
      </div>
    </div>
  )
}
