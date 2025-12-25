'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { JobCard, Job } from '@/components/JobCard'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function SavedJobsList() {
  const { user } = useAuthStore()
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) return
      try {
        const res = await fetch('/api/saved-jobs')
        if (res.ok) {
          const data = await res.json()
          // API returns { docs: [ { id, job: { ...jobData } } ] }
          // We need to map it to Job[] format expected by JobCard
          // But wait, the API returns SavedJob objects which contain 'job' relationship.
          // The 'job' field is populated.
          // Let's assume the API returns what we need.
          // Based on usage in JobCard logic, we just passed job.

          type SavedJobResponse = {
            id: string
            job: Job
            notes?: string
          }

          const jobs = data.docs.map((doc: SavedJobResponse) => doc.job)
          setSavedJobs(jobs)
        }
      } catch (error) {
        console.error('Failed to fetch saved jobs', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedJobs()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (savedJobs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>You haven&apos;t saved any jobs yet.</p>
        <p className="text-sm mt-2">Browse jobs and click the bookmark icon to save them.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 mt-4">
      {savedJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
