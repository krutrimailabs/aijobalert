import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Force dynamic rendering
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-700 mb-2">📥 Latest Admit Cards</h1>
          <p className="text-gray-600">
            Download admit cards for upcoming government exams. Check your exam date, venue, and
            important instructions.
          </p>
          <p className="text-sm text-gray-500 mt-2">Showing {jobs.length} admit card(s)</p>
        </div>

        {/* Admit Cards Table */}
        <Card className="border-t-4 border-t-orange-600 shadow-lg">
          <CardHeader className="py-3 bg-gradient-to-r from-orange-50 to-transparent">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2 text-orange-700">
                <Download className="w-5 h-5" />
                Admit Cards Available
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-100 text-[10px] uppercase text-slate-600 font-bold border-b">
                    <th className="px-3 py-2 whitespace-nowrap">Date</th>
                    <th className="px-3 py-2">Organization & Exam</th>
                    <th className="px-3 py-2 text-center hidden md:table-cell">Exam Date</th>
                    <th className="px-3 py-2 text-center hidden md:table-cell">Days Left</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {jobs.length > 0 ? (
                    jobs.map((job) => {
                      const daysLeft = getDaysLeft(job.lastDate)
                      const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft > 0
                      return (
                        <tr key={job.id} className="hover:bg-orange-50/50 transition-colors group">
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-500 align-top">
                            {formatDate(job.updatedAt)}
                          </td>
                          <td className="px-3 py-2 align-top">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-orange-600 uppercase leading-none">
                                {job.recruitmentBoard || 'Govt Organization'}
                              </span>
                              <Link
                                href={`/jobs/${job.id}`}
                                className="text-sm font-semibold text-slate-900 group-hover:text-orange-700 leading-tight line-clamp-2"
                              >
                                {job.postName}
                              </Link>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-center text-xs whitespace-nowrap hidden md:table-cell align-top">
                            {job.lastDate ? (
                              <span className="text-slate-600">{formatDate(job.lastDate)}</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center text-xs whitespace-nowrap hidden md:table-cell align-top">
                            {daysLeft !== null && daysLeft > 0 ? (
                              <Badge
                                variant={isUrgent ? 'destructive' : 'secondary'}
                                className="text-[8px] px-1 py-0"
                              >
                                {daysLeft}d left
                              </Badge>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right align-top">
                            <Link href={`/jobs/${job.id}`}>
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-orange-600 text-white border-orange-600 hover:bg-orange-700 cursor-pointer px-2 py-1"
                              >
                                Download
                              </Badge>
                            </Link>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No admit cards available at the moment.
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
