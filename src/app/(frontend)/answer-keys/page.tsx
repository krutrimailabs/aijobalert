import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { FileCheck, Calendar, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Job } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function AnswerKeysPage() {
  const payload = await getPayload({ config })

  const { docs: jobs } = await payload.find({
    collection: 'jobs',
    limit: 100,
    sort: '-updatedAt',
    where: {
      status: { contains: 'answer_key' },
    },
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-purple-800">Answer Keys</h1>
              <p className="text-purple-600 font-medium">
                Verify your answers & estimate your score
              </p>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Download official and unofficial answer keys for government exams. Cross-check your
            responses and calculate your expected marks.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {jobs.length} Answer Key{jobs.length !== 1 ? 's' : ''} Released
            </Badge>
          </div>
        </div>

        {/* Answer Keys - Compact List */}
        <div className="space-y-3">
          {jobs.length > 0 ? (
            jobs.map((job: Job) => {
              return (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Left: Icon */}
                      <div className="flex-shrink-0 hidden sm:block">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileCheck className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>

                      {/* Middle: Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-purple-600 uppercase mb-1">
                          {job.recruitmentBoard || 'Govt Organization'}
                        </p>
                        <Link href={`/jobs/${String(job.id)}`}>
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 hover:text-purple-700 transition-colors line-clamp-2">
                            {job.postName}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Released: {formatDate(job.updatedAt)}</span>
                          <Badge
                            variant="outline"
                            className="text-xs border-purple-300 text-purple-700"
                          >
                            Official
                          </Badge>
                        </div>
                      </div>

                      {/* Right: Buttons */}
                      <div className="flex gap-2 sm:flex-col sm:w-auto">
                        <Link href={`/jobs/${String(job.id)}`} className="flex-1 sm:flex-none">
                          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                            <span className="sm:hidden">Get Key</span>
                          </button>
                        </Link>
                        <Link href={`/jobs/${String(job.id)}`} className="flex-1 sm:flex-none">
                          <button className="w-full border border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                            Details
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
                <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No Answer Keys Available</p>
                <p className="text-gray-400 text-sm">Check back soon for new answer key releases</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
