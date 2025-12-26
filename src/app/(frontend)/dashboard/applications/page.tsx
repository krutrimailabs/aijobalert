'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, MapPin, Calendar } from 'lucide-react'
import { ApplicationPipeline, ApplicationStatus } from '@/components/dashboard/ApplicationPipeline'
import { Button } from '@/components/ui/button'

interface Application {
  id: string
  job: {
    id: string
    postName: string
    recruitmentBoard: string
    state?: string
    lastDate?: string
    status?: string // Job status
  }
  status: ApplicationStatus
  applicationDate: string
  timeline?: { status: string; date: string; note?: string }[]
  admitCardDate?: string
  resultDate?: string
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/applications')
        if (res.ok) {
          const data = await res.json()
          setApplications(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <Button asChild variant="outline">
          <Link href="/jobs">Find More Jobs</Link>
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-slate-300">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No applications yet</h3>
          <p className="text-slate-500 mb-4">Start applying to jobs to track them here.</p>
          <Button asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 md:p-6 border-b border-slate-50">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                        {app.job.recruitmentBoard}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                        ID: {app.id.slice(0, 8)}...
                      </span>
                    </div>
                    <Link
                      href={`/jobs/${app.job.id}`}
                      className="text-lg md:text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors block mb-2"
                    >
                      {app.job.postName}
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {app.job.state && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {app.job.state}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Applied: {new Date(app.applicationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {app.status === 'admit-card-downloaded' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Download Admit Card
                      </Button>
                    )}
                    {app.status === 'selected' && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        View Result
                      </Button>
                    )}
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/jobs/${app.job.id}`}>View Job</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Pipeline */}
              <div className="p-4 md:p-6 bg-slate-50/50">
                <ApplicationPipeline currentStatus={app.status} timeline={app.timeline} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
