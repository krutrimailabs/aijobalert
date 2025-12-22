import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AnswerKeysPage() {
  const payload = await getPayload({ config })

  const { docs: jobs } = await payload.find({
    collection: 'jobs',
    limit: 100,
    sort: '-updatedAt',
    where: {
      status: { equals: 'answer_key' },
    },
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">📝 Latest Answer Keys</h1>
          <p className="text-gray-600">
            Download official and unofficial answer keys for government exams. Verify your answers
            and estimate your score.
          </p>
          <p className="text-sm text-gray-500 mt-2">Showing {jobs.length} answer key(s)</p>
        </div>

        {/* Answer Keys Table */}
        <Card className="border-t-4 border-t-purple-600 shadow-lg">
          <CardHeader className="py-3 bg-gradient-to-r from-purple-50 to-transparent">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2 text-purple-700">
                <FileText className="w-5 h-5" />
                Answer Keys Released
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-purple-100 text-[10px] uppercase text-slate-600 font-bold border-b">
                    <th className="px-3 py-2 whitespace-nowrap">Released</th>
                    <th className="px-3 py-2">Organization & Exam</th>
                    <th className="px-3 py-2 text-center hidden md:table-cell">Type</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {jobs.length > 0 ? (
                    jobs.map((job) => {
                      return (
                        <tr key={job.id} className="hover:bg-purple-50/50 transition-colors group">
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-500 align-top">
                            {formatDate(job.updatedAt)}
                          </td>
                          <td className="px-3 py-2 align-top">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-purple-600 uppercase leading-none">
                                {job.recruitmentBoard || 'Govt Organization'}
                              </span>
                              <Link
                                href={`/jobs/${job.id}`}
                                className="text-sm font-semibold text-slate-900 group-hover:text-purple-700 leading-tight line-clamp-2"
                              >
                                {job.postName}
                              </Link>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-center text-xs hidden md:table-cell align-top">
                            <Badge
                              variant="outline"
                              className="text-[8px] px-2 py-0 border-purple-500 text-purple-700"
                            >
                              Official
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-right align-top">
                            <Link href={`/jobs/${job.id}`}>
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-purple-600 text-white border-purple-600 hover:bg-purple-700 cursor-pointer px-2 py-1"
                              >
                                View Key
                              </Badge>
                            </Link>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        No answer keys available at the moment.
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
