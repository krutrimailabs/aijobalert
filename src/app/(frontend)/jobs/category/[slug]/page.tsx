import { getPayload } from 'payload'
import config from '@/payload.config'
import { FilteredJobsClient } from '@/components/FilteredJobsClient'
import { JOB_CATEGORIES } from '@/lib/constants'
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
  const category = JOB_CATEGORIES.find((cat) => cat.value === slug)
  const title = category?.label || slug.toUpperCase()

  return {
    title: `${title} Jobs ${new Date().getFullYear()} | Latest ${title} Recruitment`,
    description: `Browse latest ${title} government job openings. Find ${title} vacancies, recruitment notifications, and apply for ${title} positions across India.`,
  }
}

export default async function CategoryJobsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Find the category from constants
  const category = JOB_CATEGORIES.find((cat) => cat.value === slug)

  if (!category) {
    // Handle invalid category slug
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Category Not Found</h1>
          <p className="text-slate-600">The requested job category does not exist.</p>
        </div>
      </div>
    )
  }

  const payload = await getPayload({ config })

  // Fetch jobs that contain this category (using 'contains' since category is an array)
  const { docs } = await payload.find({
    collection: 'jobs',
    where: {
      category: {
        contains: category.value,
      },
    },
    limit: 200,
    sort: '-createdAt',
  })

  const jobs = docs as unknown as Job[]

  return (
    <FilteredJobsClient
      initialJobs={jobs}
      filterType="category"
      filterValue={category.value}
      displayName={`${category.label} Jobs`}
    />
  )
}
