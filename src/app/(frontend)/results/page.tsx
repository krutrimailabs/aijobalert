import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Job } from '@/payload-types'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ResultsPage() {
  const payload = await getPayload({ config })

  const { docs: jobs } = await payload.find({
    collection: 'jobs',
    limit: 100,
    sort: '-updatedAt',
    where: {
      status: { equals: 'result' },
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2">🎯 Latest Results</h1>
          <p className="text-gray-600">
            Check your exam results for various government recruitment exams. View merit lists,
            cut-off marks, and selection status.
          </p>
          <p className="text-sm text-gray-500 mt-2">Showing {jobs.length} result(s)</p>
        </div>

        {/* Results Table */}
        <Card className="border-t-4 border-t-green-600 shadow-lg">
          <CardHeader className="py-3 bg-gradient-to-r from-green-50 to-transparent">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2 text-green-700">
                <FileText className="w-5 h-5" />
                Results Published
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-green-100 text-[10px] uppercase text-slate-600 font-bold border-b">
                    <th className="px-3 py-2 whitespace-nowrap">Published</th>
                    <th className="px-3 py-2">Organization & Exam</th>
                    <th className="px-3 py-2 text-center hidden md:table-cell">Status</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {jobs.length > 0 ? (
                    jobs.map((job: Job) => {
                      return (
                        <tr key={job.id} className="hover:bg-green-50/50 transition-colors group">
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-500 align-top">
                            <div className="flex flex-col">
                              <span>{formatDate(job.updatedAt)}</span>
                              {isNew(job) && (
                                <Badge
                                  variant="secondary"
                                  className="text-[8px] px-1 py-0 mt-1 bg-green-100 text-green-700"
                                >
                                  NEW
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 align-top">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-green-600 uppercase leading-none">
                                {job.recruitmentBoard || 'Govt Organization'}
                              </span>
                              <Link
                                href={`/jobs/${String(job.id)}`}
                                className="text-sm font-semibold text-slate-900 group-hover:text-green-700 leading-tight line-clamp-2"
                              >
                                {job.postName}
                              </Link>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-center text-xs hidden md:table-cell align-top">
                            <Badge
                              variant="outline"
                              className="text-[8px] px-2 py-0 border-green-500 text-green-700"
                            >
                              Published
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-right align-top">
                            <Link href={`/jobs/${String(job.id)}`}>
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-green-600 text-white border-green-600 hover:bg-green-700 cursor-pointer px-2 py-1"
                              >
                                Check Result
                              </Badge>
                            </Link>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        No results available at the moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
