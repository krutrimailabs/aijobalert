import { getPayload } from 'payload'
import config from '@/payload.config'
import { FilteredJobsClient } from '@/components/FilteredJobsClient'
import { INDIAN_STATES } from '@/lib/constants'
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

// Helper function to convert slug to state code
function slugToStateCode(slug: string): string | undefined {
  // Check if slug is already a state code (e.g., "UP", "PB", "DL")
  const directMatch = INDIAN_STATES.find((s) => s.value.toLowerCase() === slug.toLowerCase())
  if (directMatch) {
    return directMatch.value
  }

  // Convert slug like "uttar-pradesh" to "Uttar Pradesh" and find matching state
  const label = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/And/g, 'and') // Fix "Dadra And Nagar" to "Dadra and Nagar"

  const state = INDIAN_STATES.find((s) => s.label.toLowerCase() === label.toLowerCase())
  return state?.value
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const stateCode = slugToStateCode(slug)
  const state = INDIAN_STATES.find((s) => s.value === stateCode)
  const stateName = state?.label || slug

  return {
    title: `${stateName} Government Jobs ${new Date().getFullYear()} | Latest ${stateName} Sarkari Naukri`,
    description: `Browse latest government job openings in ${stateName}. Find ${stateName} state government vacancies, recruitment notifications, and apply for jobs in ${stateName}.`,
  }
}

export default async function StateJobsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Convert slug to state code
  const stateCode = slugToStateCode(slug)

  if (!stateCode) {
    // Handle invalid state slug
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">State Not Found</h1>
          <p className="text-slate-600">The requested state does not exist.</p>
        </div>
      </div>
    )
  }

  const state = INDIAN_STATES.find((s) => s.value === stateCode)
  if (!state) {
    return null
  }

  const payload = await getPayload({ config })

  // Fetch ALL jobs for this state (including expired jobs)
  // Using 'equals' since state is a single value field
  const { docs } = await payload.find({
    collection: 'jobs',
    where: {
      state: {
        equals: stateCode,
      },
    },
    limit: 200,
    sort: '-createdAt',
  })

  const jobs = docs as unknown as Job[]

  return (
    <FilteredJobsClient
      initialJobs={jobs}
      filterType="state"
      filterValue={slug}
      displayName={`Jobs in ${state.label}`}
    />
  )
}
