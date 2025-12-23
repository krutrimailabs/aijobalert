import { getPayload } from 'payload'
import config from '@/payload.config'
import { FilteredJobsClient } from '@/components/FilteredJobsClient'
import { EDUCATION_LEVELS } from '@/lib/constants'
import { Metadata } from 'next'

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const qualification = EDUCATION_LEVELS.find((edu) => edu.value === slug)
  const title = qualification?.label || slug

  return {
    title: `${title} Jobs ${new Date().getFullYear()} | Government Jobs for ${title}`,
    description: `Browse latest government job openings for ${title} qualified candidates. Find ${title} vacancies, recruitment notifications across India.`,
  }
}

export default async function QualificationJobsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Find the qualification from constants
  const qualification = EDUCATION_LEVELS.find((edu) => edu.value === slug)

  if (!qualification) {
    // Handle invalid qualification slug
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Qualification Not Found</h1>
          <p className="text-slate-600">The requested qualification level does not exist.</p>
        </div>
      </div>
    )
  }

  const payload = await getPayload({ config })

  // Fetch jobs that contain this qualification (using 'contains' since education is an array)
  const { docs } = await payload.find({
    collection: 'jobs',
    where: {
      education: {
        contains: qualification.value,
      },
    },
    limit: 200,
    sort: '-createdAt',
  })

  const jobs = docs as unknown as Job[]

  return (
    <FilteredJobsClient
      initialJobs={jobs}
      filterType="qualification"
      filterValue={qualification.value}
      displayName={`Jobs for ${qualification.label}`}
    />
  )
}
