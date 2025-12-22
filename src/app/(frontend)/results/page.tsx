import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { Trophy, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Job } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function ResultsPage() {
  const payload = await getPayload({ config })

  const { docs: jobs } = await payload.find({
    collection: 'jobs',
    limit: 100,
    sort: '-updatedAt',
    where: {
      status: { contains: 'result' },
    },
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const isNew = (job: Job) => {
    const updated = new Date(job.updatedAt)
    const now = new Date()
    const diffDays = Math.ceil((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-green-800">Exam Results</h1>
              <p className="text-green-600 font-medium">
                Check your selection status & merit lists
              </p>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Check results for various government recruitment exams. View merit lists, cut-off marks,
            and your selection status.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {jobs.length} Result{jobs.length !== 1 ? 's' : ''} Published
            </Badge>
          </div>
        </div>

        {/* Results List - Vertical Timeline Style */}
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job: Job, index: number) => {
              return (
                <Card
                  key={job.id}
                  className="border-l-4 border-l-green-500 hover:shadow-lg transition-all hover:scale-[1.01]"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Left: Number Circle */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-green-700">#{index + 1}</span>
                        </div>
                      </div>

                      {/* Middle: Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="flex-1">
                            <p className="text-xs font-bold text-green-600 uppercase mb-1">
                              {job.recruitmentBoard || 'Govt Organization'}
                            </p>
                            <Link href={`/jobs/${String(job.id)}`}>
                              <h3 className="text-lg md:text-xl font-semibold text-gray-900 hover:text-green-700 transition-colors">
                                {job.postName}
                              </h3>
                            </Link>
                          </div>
                          {isNew(job) && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700 flex-shrink-0"
                            >
                              ✨ NEW
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Published: {formatDate(job.updatedAt)}</span>
                          </div>
                          {job.totalVacancies && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{job.totalVacancies.toLocaleString('en-IN')} Vacancies</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Action Buttons */}
                      <div className="flex md:flex-col gap-2">
                        <Link href={`/jobs/${String(job.id)}`} className="flex-1 md:flex-none">
                          <button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors whitespace-nowrap">
                            Check Result
                          </button>
                        </Link>
                        <Link href={`/jobs/${String(job.id)}`} className="flex-1 md:flex-none">
                          <button className="w-full md:w-auto border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-6 rounded-lg transition-colors whitespace-nowrap">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No Results Available</p>
                <p className="text-gray-400 text-sm">
                  Check back soon for new result announcements
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-green-600 hover:text-green-700 font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
