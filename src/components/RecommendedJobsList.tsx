'use client'

import React, { useEffect, useState } from 'react'
import { JobCard } from './JobCard'
import { LoadingSpinner } from './ui/loading-spinner'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Job {
  id: string | number
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  state?: string
  status?: string
  category?: string[]
  education?: string[]
  updatedAt?: string
  postDate?: string
  salaryStipend?: string
  minimumAge?: number
  maximumAge?: number
  feeGeneral?: string
  applicationStartDate?: string
}

export function RecommendedJobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/jobs/recommendations')
        if (res.ok) {
          const data = await res.json()
          setJobs(data)
        }
      } catch (error) {
        console.error('Failed to fetch recommendations', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">No specific recommendations yet</h3>
        <p className="text-slate-500 mt-2">
          Complete your profile with preferred states and categories to get personalized job
          suggestions.
        </p>
        <Link
          href="/dashboard?tab=profile"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Update Profile →
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
