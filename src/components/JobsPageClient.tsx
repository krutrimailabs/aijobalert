'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp, Bell } from 'lucide-react'
import { JOB_CATEGORIES, EDUCATION_LEVELS, INDIAN_STATES } from '@/lib/constants'
import { JobCard, Job } from '@/components/JobCard'

interface Props {
  initialJobs: Job[]
}

export function JobsPageClient({ initialJobs }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Collapsible sections - collapsed by default for mobile
  const [showCategories, setShowCategories] = useState(false)
  const [showQualifications, setShowQualifications] = useState(false)
  const [showStates, setShowStates] = useState(false)

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('active')

  // Initialize filters from URL
  useEffect(() => {
    const cats = searchParams.get('category')?.split(',').filter(Boolean) || []
    const quals = searchParams.get('qualification')?.split(',').filter(Boolean) || []
    const states = searchParams.get('state')?.split(',').filter(Boolean) || []
    const query = searchParams.get('q') || ''

    setSelectedCategories(cats)
    setSelectedQualifications(quals)
    setSelectedStates(states)
    setSearchQuery(query)
  }, [searchParams])

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()

    if (selectedCategories.length) params.set('category', selectedCategories.join(','))
    if (selectedQualifications.length) params.set('qualification', selectedQualifications.join(','))
    if (selectedStates.length) params.set('state', selectedStates.join(','))
    if (searchQuery) params.set('q', searchQuery)

    router.push(`/jobs?${params.toString()}`, { scroll: false })
  }, [router, selectedCategories, selectedQualifications, selectedStates, searchQuery])

  useEffect(() => {
    const timer = setTimeout(updateURL, 300)
    return () => clearTimeout(timer)
  }, [updateURL])

  // Helpers moved to JobCard

  // Filter jobs
  const filteredJobs = initialJobs.filter((job) => {
    // Status filter - logic duplicated from JobCard helpers effectively,
    // but better to import helper if we want strict consistency.
    // For now we can keep minimal logic or import helpers.
    // Let's import helpers if we can?
    // Actually JobCard doesn't export helpers.
    // Let's copy basic date logic here locally to keep filtering working without exporting everything.

    const getDaysLeft = (dateStr?: string) => {
      if (!dateStr) return null
      const date = new Date(dateStr)
      const today = new Date()
      const diffTime = date.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
    const isExpired = (dateStr?: string) => {
      const daysLeft = getDaysLeft(dateStr)
      return daysLeft !== null && daysLeft < 0
    }

    const expired = isExpired(job.lastDate)
    if (statusFilter === 'active' && expired) return false
    if (statusFilter === 'expired' && !expired) return false

    if (
      selectedCategories.length > 0 &&
      (!job.category || !job.category.some((cat) => selectedCategories.includes(cat)))
    )
      return false
    if (
      selectedQualifications.length > 0 &&
      (!job.education || !job.education.some((edu) => selectedQualifications.includes(edu)))
    )
      return false
    if (selectedStates.length > 0 && !selectedStates.includes(job.state || '')) return false

    // Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const title = job.postName?.toLowerCase() || ''
      const board = job.recruitmentBoard?.toLowerCase() || ''
      if (!title.includes(query) && !board.includes(query)) return false
    }

    return true
  })

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedQualifications([])
    setSelectedStates([])
    setSearchQuery('')
    router.push('/jobs', { scroll: false })
  }

  const toggleFilter = (type: string, value: string) => {
    switch (type) {
      case 'category':
        setSelectedCategories((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
        )
        break
      case 'qualification':
        setSelectedQualifications((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
        )
        break
      case 'state':
        setSelectedStates((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
        )
        break
    }
  }

  const activeFilterCount =
    selectedCategories.length +
    selectedQualifications.length +
    selectedStates.length +
    (searchQuery ? 1 : 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 p-2 md:p-4">
          {/* Sidebar - Chip Based Filters */}
          <div className="lg:col-span-3 space-y-3">
            {/* Filter Header with Search Input */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by keyword..."
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full mt-2 py-1.5 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors text-xs"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="w-full flex items-center justify-between mb-2"
              >
                <h3 className="text-xs md:text-sm font-bold text-slate-900">
                  Category
                  {selectedCategories.length > 0 && (
                    <span className="ml-1.5 text-blue-600 text-xs">
                      ({selectedCategories.length})
                    </span>
                  )}
                </h3>
                {showCategories ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showCategories && (
                <div className="flex flex-wrap gap-1.5">
                  {JOB_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => toggleFilter('category', cat.value)}
                      className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-medium transition-all ${
                        selectedCategories.includes(cat.value)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Qualification Chips */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
              <button
                onClick={() => setShowQualifications(!showQualifications)}
                className="w-full flex items-center justify-between mb-2"
              >
                <h3 className="text-xs md:text-sm font-bold text-slate-900">
                  Qualification
                  {selectedQualifications.length > 0 && (
                    <span className="ml-1.5 text-green-600 text-xs">
                      ({selectedQualifications.length})
                    </span>
                  )}
                </h3>
                {showQualifications ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showQualifications && (
                <div className="flex flex-wrap gap-1.5">
                  {EDUCATION_LEVELS.map((edu) => (
                    <button
                      key={edu.value}
                      onClick={() => toggleFilter('qualification', edu.value)}
                      className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-medium transition-all ${
                        selectedQualifications.includes(edu.value)
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {edu.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* State Chips */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
              <button
                onClick={() => setShowStates(!showStates)}
                className="w-full flex items-center justify-between mb-2"
              >
                <h3 className="text-xs md:text-sm font-bold text-slate-900">
                  State / UT
                  {selectedStates.length > 0 && (
                    <span className="ml-1.5 text-purple-600 text-xs">
                      ({selectedStates.length})
                    </span>
                  )}
                </h3>
                {showStates ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showStates && (
                <div className="flex flex-wrap gap-1.5 max-h-80 overflow-y-auto">
                  {INDIAN_STATES.map((state) => (
                    <button
                      key={state.value}
                      onClick={() => toggleFilter('state', state.value)}
                      className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-medium transition-all ${
                        selectedStates.includes(state.value)
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {state.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Results Header - Compact */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200 mb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-base md:text-lg font-bold text-slate-900">
                    Government Jobs {new Date().getFullYear()}
                    {searchQuery && (
                      <span className="text-slate-500 text-sm ml-2">
                        - results for &quot;{searchQuery}&quot;
                      </span>
                    )}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-600 mt-0.5">
                    <strong className="text-slate-900">{filteredJobs.length}</strong> of{' '}
                    <strong>{initialJobs.length}</strong> jobs
                  </p>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                      statusFilter === 'active'
                        ? 'bg-green-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ✓ Active
                  </button>
                  <button
                    onClick={() => setStatusFilter('expired')}
                    className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                      statusFilter === 'expired'
                        ? 'bg-slate-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ⊗ Expired
                  </button>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                      statusFilter === 'all'
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors text-xs"
                >
                  Clear Filters ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Job Cards - ULTRA COMPACT */}
            <div className="space-y-2">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job: Job) => (
                  <JobCard key={job.id} job={job} searchQuery={searchQuery} />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-300">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-base font-bold text-slate-900 mb-1">No jobs found</p>
                  <p className="text-xs text-slate-500 mb-4">Adjust your filters</p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
