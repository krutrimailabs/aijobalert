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

export default async function CategoryJobs({ params }: { params: { slug: string } }) {
  const { slug } = await params
  
  // Mapping simplistic slugs to possible Category values in DB
  // e.g. 'railway' -> 'Railway', 'bank' -> 'Bank'
  // Using 'contains' or 'like' might be safer if multiple categories exist
  
  const payload = await getPayload({ config })

  // Construct query based on slug
  let whereQuery: any = {}
  
  if (slug === 'railway') whereQuery = { category: { equals: 'Railway' } }
  else if (slug === 'bank') whereQuery = { category: { equals: 'Bank' } }
  else if (slug === 'defense' || slug === 'police') whereQuery = { category: { equals: 'Defence/Police' } }
  else if (slug === 'ssc') whereQuery = { category: { equals: 'SSC' } }
  else if (slug === 'upsc') whereQuery = { category: { equals: 'UPSC' } }
  else whereQuery = { category: { equals: slug } } // Fallback

  const { docs } = await payload.find({
    collection: 'jobs',
    where: whereQuery,
    limit: 50,
    sort: '-createdAt',
  })

  const jobs = docs as unknown as Job[]
  const title = slug.toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
            <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wide">
            Job Category
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mt-3">
             {title} Jobs
          </h1>
          <p className="text-slate-500 mt-2">
            Latest notifications for {title} recruitment.
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
           </div>
        )}
      </div>
    </div>
  )
}
