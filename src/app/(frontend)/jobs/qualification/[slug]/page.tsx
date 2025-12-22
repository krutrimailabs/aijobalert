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

export default async function QualificationJobsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const payload = await getPayload({ config })

  // Map slug to Education Level
  let educationQuery = ''
  if (slug === '10th') educationQuery = '10th Pass'
  else if (slug === '12th') educationQuery = '12th Pass'
  else if (slug === 'graduate') educationQuery = 'Graduate'
  else if (slug === 'btech') educationQuery = 'B.E/B.Tech'
  else if (slug === 'diploma') educationQuery = 'Diploma'
  else educationQuery = slug

  const { docs } = await payload.find({
    collection: 'jobs',
    where: {
        education: {
            equals: educationQuery
        }
    },
    limit: 50,
    sort: '-createdAt',
  })

  const jobs = docs as unknown as Job[]

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wide">
            Qualification
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mt-3">
             Jobs for {educationQuery}
          </h1>
          <p className="text-slate-500 mt-2">
            Opportunities matching your qualification level.
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
              <p className="text-lg text-slate-500">No active jobs found for {educationQuery}.</p>
           </div>
        )}
      </div>
    </div>
  )
}
