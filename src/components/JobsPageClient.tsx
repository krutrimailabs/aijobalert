'use client'

import React, { useState } from 'react'
import { JobsSidebar } from '@/components/JobsSidebar'
import { JobTable } from '@/components/JobTable'

interface Job {
  id: string
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  state?: string
  status?: string
}

export function JobsPageClient({ initialJobs }: { initialJobs: Job[] }) {
  const [filteredJobs, setFilteredJobs] = useState(initialJobs)
  // Explicitly type filters to avoid 'never[]' inference
  const [_, setFilters] = useState<{ state: string[], category: string[], qualification: string[] }>({ 
    state: [], 
    category: [], 
    qualification: [] 
  })

  const handleFilterChange = (newFilters: { state: string[], category: string[], qualification: string[] }) => {
    setFilters(newFilters)
    
    // Apply filters locally for "fast" feel
    // In a real large-scale app, this would trigger a server action or URL update
    const filtered = initialJobs.filter((job) => {
      // Logic for filtering
      // Since mocked state/category/qual might not match exactly, we do basic matching
      // If no filters selected, match all
      const matchState = newFilters.state.length === 0 || (job.state && newFilters.state.some((s: string) => job.state?.includes(s)))
      const matchCat = newFilters.category.length === 0 // || job.category...
      const matchQual = newFilters.qualification.length === 0 // || job.qual...

      return matchState && matchCat && matchQual
    })
    
    setFilteredJobs(filtered)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="hidden lg:block lg:col-span-1">
        <JobsSidebar onFilterChange={handleFilterChange} />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <JobTable jobs={filteredJobs} />
      </div>
    </div>
  )
}
