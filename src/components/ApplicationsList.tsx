'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Job } from '@/components/JobCard'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { Calendar, CheckCircle2, Clock, FileText, ChevronRight } from 'lucide-react'

type Application = {
  id: string
  job: Job
  status:
    | 'applied'
    | 'admit-card-downloaded'
    | 'exam-given'
    | 'result-awaited'
    | 'selected'
    | 'rejected'
  applicationDate: string
  notes?: string
}

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700', icon: FileText },
  'admit-card-downloaded': {
    label: 'Admit Card',
    color: 'bg-indigo-100 text-indigo-700',
    icon: CheckCircle2,
  },
  'exam-given': { label: 'Exam Given', color: 'bg-purple-100 text-purple-700', icon: CheckCircle2 },
  'result-awaited': { label: 'Result Awaited', color: 'bg-amber-100 text-amber-700', icon: Clock },
  selected: { label: 'Selected', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  rejected: { label: 'Not Selected', color: 'bg-red-100 text-red-700', icon: CheckCircle2 },
}

export function ApplicationsList() {
  const { user } = useAuthStore()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return
      try {
        const res = await fetch('/api/applications')
        if (res.ok) {
          const data = await res.json()
          setApplications(data.docs)
        }
      } catch (error) {
        console.error('Failed to fetch applications', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-900">No applications yet</h3>
        <p className="text-slate-500 mb-4">
          Mark jobs as &quot;Applied&quot; to track your progress here.
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Browse Jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const StatusIcon = STATUS_CONFIG[app.status]?.icon || FileText
        // Handle case where job relation might be null (deleted job)
        if (!app.job) return null

        return (
          <div
            key={app.id}
            className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5',
                      STATUS_CONFIG[app.status]?.color,
                    )}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {STATUS_CONFIG[app.status]?.label}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Applied on {new Date(app.applicationDate).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{app.job.postName}</h3>
                <p className="text-sm text-slate-600 mb-3">{app.job.recruitmentBoard}</p>

                {/* Timeline / Next Steps Placeholder */}
                <div className="flex items-center gap-2 mt-2">
                  {/* TODO: Add status update dropdown here */}
                </div>
              </div>

              <Link
                href={`/jobs/${app.job.id}`}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
