import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { BookOpen, Download, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Job } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function SyllabusPage() {
  const payload = await getPayload({ config })

  const { docs: jobs } = await payload.find({
    collection: 'jobs',
    limit: 100,
    sort: '-updatedAt',
    where: {
      status: { contains: 'syllabus' },
    },
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
                Exam Syllabus & Patterns
              </h1>
              <p className="text-blue-600 font-medium">
                Prepare effectively with official guidelines
              </p>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Download detailed syllabus and exam patterns for various government exams. Know what to
            study and how the exam is structured.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {jobs.length} Syllabus Available
            </Badge>
          </div>
        </div>

        {/* Syllabus Grid - Medium Density */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job: Job) => {
              return (
                <Card
                  key={job.id}
                  className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                          {job.recruitmentBoard || 'Govt Organization'}
                        </p>
                        <CardTitle className="text-base leading-tight line-clamp-2">
                          {job.postName}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Meta Info */}
                    <div className="text-xs text-gray-500">
                      <p>Updated: {formatDate(job.updatedAt)}</p>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant="secondary"
                      className="w-full justify-center bg-blue-50 text-blue-700 border-blue-200"
                    >
                      📚 Complete Syllabus
                    </Badge>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link href={`/jobs/${String(job.id)}`} className="block">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                          <Download className="w-4 h-4" />
                          Download PDF
                        </button>
                      </Link>
                      <Link href={`/jobs/${String(job.id)}`} className="block">
                        <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No Syllabus Available</p>
                  <p className="text-gray-400 text-sm">Check back soon for new syllabus uploads</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
