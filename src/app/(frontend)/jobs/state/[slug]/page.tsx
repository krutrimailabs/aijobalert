import { getPayload } from 'payload'
import config from '@/payload.config'
import { JobCard } from '@/components/JobCard'

export const dynamic = 'force-dynamic'

interface Job {
  id: string
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  aiSummary?: string
  applyLink: string
  state?: string
  salaryStipend?: string
}

export default async function StateJobsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Format slug to readable name if needed, or query directly if values match
  // Assuming slugs like 'andhra-pradesh' match 'Andhra Pradesh' in DB via 'like' or map
  // For simplicity, let's use a loose match or exact if we store slugs.
  // Ideally, 'state' field in DB should be consistent.
  
  // Quick optimization: Convert slug to Title Case for display
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  const payload = await getPayload({ config })

  // Find jobs where 'state' equals the title
  // Note: This relies on exact string matching. "Andhra Pradesh" vs "andhra-pradesh"
  // A robust system would use a lookup or case-insensitive search.
  const { docs } = await payload.find({
    collection: 'jobs',
    where: {
      state: {
        equals: title, 
      },
    },
    limit: 50,
    sort: '-createdAt',
  })

  const jobs = docs as unknown as Job[]

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
            State Government Jobs
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mt-3">
             Jobs in {title}
          </h1>
            <p className="text-gray-600">Browse the latest government job notifications for {title}. We&apos;ve curated the best opportunities for you.</p>
          <p className="text-slate-500 mt-2">
            Viewing {jobs.length} active notifications for {title}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard 
               key={job.id}
               id={job.id}
               postName={job.postName}
               recruitmentBoard={job.recruitmentBoard}
               totalVacancies={job.totalVacancies}
               lastDate={job.lastDate}
               state={job.state}
               salaryStipend={job.salaryStipend}
               aiSummary={job.aiSummary}
               applyLink={job.applyLink}
            />
          ))}
        </div>

        {jobs.length === 0 && (
           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-lg text-slate-500">No active jobs found for {title}.</p>
              <p className="text-sm text-slate-400 mt-2">Try checking &quot;All States&quot; or browse latest jobs.</p>
           </div>
        )}
      </div>
    </div>
  )
}
