import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { Download, Calendar, Clock, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Job } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function AdmitCardsPage() {
  const payload = await getPayload({ config })

  const { docs: jobs } = await payload.find({
    collection: 'jobs',
    limit: 100,
    sort: '-updatedAt',
    where: {
      status: { equals: 'admit_card' },
    },
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const getDaysLeft = (dateStr?: string) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                Admit Card Availability
              </h1>
              <p className="text-slate-600 font-medium">Download hall tickets for upcoming exams</p>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Check when admit cards are released and download them before your exam date. Stay
            updated with the latest hall ticket availability.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {jobs.length} Admit Card{jobs.length !== 1 ? 's' : ''} Available
            </Badge>
          </div>
        </div>

        {/* Desktop Table View */}
        <Card className="hidden md:block border-t-4 border-t-orange-500 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-100 border-b-2 border-orange-200">
                    <th className="text-left px-4 py-3 text-sm font-bold text-orange-800 uppercase">
                      Organization & Exam
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-bold text-orange-800 uppercase whitespace-nowrap">
                      Admit Card Released
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-bold text-orange-800 uppercase whitespace-nowrap">
                      Exam Date
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-bold text-orange-800 uppercase whitespace-nowrap">
                      Days Until Exam
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-bold text-orange-800 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.length > 0 ? (
                    jobs.map((job: Job) => {
                      const daysLeft = getDaysLeft(job.lastDate)
                      const isUrgent = daysLeft !== null && daysLeft <= 5 && daysLeft > 0

                      return (
                        <tr key={job.id} className="hover:bg-orange-50 transition-colors">
                          {/* Exam Name */}
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-xs font-bold text-orange-600 uppercase mb-1">
                                {job.recruitmentBoard || 'Govt Organization'}
                              </p>
                              <Link href={`/jobs/${String(job.id)}`}>
                                <p className="text-sm font-semibold text-gray-900 hover:text-orange-700 line-clamp-2">
                                  {job.postName}
                                </p>
                              </Link>
                            </div>
                          </td>

                          {/* Release Date */}
                          <td className="px-4 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Clock className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {formatDate(job.updatedAt)}
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 text-xs"
                              >
                                Available Now
                              </Badge>
                            </div>
                          </td>

                          {/* Exam Date */}
                          <td className="px-4 py-4 text-center">
                            {job.lastDate ? (
                              <div className="flex flex-col items-center gap-1">
                                <Calendar className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-semibold text-gray-900">
                                  {formatDate(job.lastDate)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">TBA</span>
                            )}
                          </td>

                          {/* Days Left */}
                          <td className="px-4 py-4 text-center">
                            {daysLeft !== null && daysLeft > 0 ? (
                              <Badge
                                variant={isUrgent ? 'destructive' : 'secondary'}
                                className="text-sm px-3 py-1"
                              >
                                {isUrgent && '🔥 '}
                                {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
                              </Badge>
                            ) : daysLeft !== null && daysLeft <= 0 ? (
                              <Badge
                                variant="outline"
                                className="text-sm px-3 py-1 border-gray-400"
                              >
                                Completed
                              </Badge>
                            ) : (
                              <span className="text-gray-400 text-sm">—</span>
                            )}
                          </td>

                          {/* Download Button */}
                          <td className="px-4 py-4 text-center">
                            <Link href={`/jobs/${String(job.id)}`}>
                              <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm inline-flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                View More
                              </button>
                            </Link>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-2">No Admit Cards Available</p>
                        <p className="text-gray-400 text-sm">Check back soon for new releases</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job: Job) => {
              const daysLeft = getDaysLeft(job.lastDate)
              const isUrgent = daysLeft !== null && daysLeft <= 5 && daysLeft > 0

              return (
                <Card key={job.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    {/* Organization */}
                    <p className="text-xs font-bold text-orange-600 uppercase mb-2">
                      {job.recruitmentBoard || 'Govt Organization'}
                    </p>

                    {/* Exam Name */}
                    <Link href={`/jobs/${String(job.id)}`}>
                      <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2">
                        {job.postName}
                      </h3>
                    </Link>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      {/* Released */}
                      <div className="bg-green-50 p-2 rounded">
                        <div className="flex items-center gap-1 text-green-700 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-semibold">Released</span>
                        </div>
                        <p className="text-xs font-medium text-gray-900">
                          {formatDate(job.updatedAt)}
                        </p>
                      </div>

                      {/* Exam Date */}
                      <div className="bg-orange-50 p-2 rounded">
                        <div className="flex items-center gap-1 text-orange-700 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-semibold">Exam Date</span>
                        </div>
                        <p className="text-xs font-medium text-gray-900">
                          {job.lastDate ? formatDate(job.lastDate) : 'TBA'}
                        </p>
                      </div>
                    </div>

                    {/* Days Left Badge */}
                    {daysLeft !== null && daysLeft > 0 && (
                      <Badge
                        variant={isUrgent ? 'destructive' : 'secondary'}
                        className="w-full justify-center mb-3 py-1"
                      >
                        {isUrgent && '🔥 '}
                        {daysLeft} {daysLeft === 1 ? 'day' : 'days'} until exam
                      </Badge>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/jobs/${String(job.id)}`} className="flex-1">
                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </Link>
                      <Link href={`/jobs/${String(job.id)}`}>
                        <button className="border border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No Admit Cards Available</p>
                <p className="text-gray-400 text-sm">Check back soon for new releases</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
