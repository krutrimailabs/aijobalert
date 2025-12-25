'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Bell, ChevronDown, ChevronUp } from 'lucide-react'
import { JOB_CATEGORIES, EDUCATION_LEVELS, INDIAN_STATES } from '@/lib/constants'
import { JobCard } from '@/components/JobCard'

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

interface Props {
  initialJobs: Job[]
  filterType: 'category' | 'qualification' | 'state'
  filterValue: string
  displayName: string
}

export function FilteredJobsClient({ initialJobs, filterType, filterValue, displayName }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Collapsible sections - collapsed by default for mobile
  const [showCategories, setShowCategories] = useState(false)
  const [showQualifications, setShowQualifications] = useState(false)
  const [showStates, setShowStates] = useState(false)

  // Helper to convert state slug to code (for state filterType only)
  const getStateCodeFromSlug = useCallback(
    (slug: string) => {
      if (filterType !== 'state') return slug

      // Check if already a state code
      const directMatch = INDIAN_STATES.find((s) => s.value.toLowerCase() === slug.toLowerCase())
      if (directMatch) return directMatch.value

      // Convert kebab-case to title case and find state
      const label = slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/And/g, 'and')

      const state = INDIAN_STATES.find((s) => s.label.toLowerCase() === label.toLowerCase())
      return state?.value || slug
    },
    [filterType],
  )

  // Filter states - Initialize with the pre-selected filter (convert state slug to code)
  const baseStateCode = filterType === 'state' ? getStateCodeFromSlug(filterValue) : ''
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filterType === 'category' ? [filterValue] : [],
  )
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>(
    filterType === 'qualification' ? [filterValue] : [],
  )
  const [selectedStates, setSelectedStates] = useState<string[]>(
    filterType === 'state' ? [baseStateCode] : [],
  )
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('active')

  // Initialize additional filters from URL
  useEffect(() => {
    const cats = searchParams.get('category')?.split(',').filter(Boolean) || []
    const quals = searchParams.get('qualification')?.split(',').filter(Boolean) || []
    const states = searchParams.get('state')?.split(',').filter(Boolean) || []

    // Merge with the base filter
    if (filterType === 'category') {
      setSelectedCategories([filterValue, ...cats.filter((c) => c !== filterValue)])
    } else if (cats.length > 0) {
      setSelectedCategories(cats)
    }

    if (filterType === 'qualification') {
      setSelectedQualifications([filterValue, ...quals.filter((q) => q !== filterValue)])
    } else if (quals.length > 0) {
      setSelectedQualifications(quals)
    }

    if (filterType === 'state') {
      setSelectedStates([baseStateCode, ...states.filter((s) => s !== baseStateCode)])
    } else if (states.length > 0) {
      setSelectedStates(states)
    }
  }, [searchParams, filterType, filterValue, baseStateCode])

  // Update URL when filters change (but preserve base filter)
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()

    // Add additional filters (excluding the base filter)
    const additionalCategories = selectedCategories.filter((c) => c !== filterValue)
    const additionalQualifications = selectedQualifications.filter((q) => q !== filterValue)
    const additionalStates = selectedStates.filter((s) => s !== filterValue)

    if (additionalCategories.length && filterType !== 'category')
      params.set('category', additionalCategories.join(','))
    if (additionalQualifications.length && filterType !== 'qualification')
      params.set('qualification', additionalQualifications.join(','))
    if (additionalStates.length && filterType !== 'state')
      params.set('state', additionalStates.join(','))

    const basePath = `/jobs/${filterType}/${filterValue}`
    const queryString = params.toString()
    router.push(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false })
  }, [router, selectedCategories, selectedQualifications, selectedStates, filterType, filterValue])

  useEffect(() => {
    const timer = setTimeout(updateURL, 300)
    return () => clearTimeout(timer)
  }, [updateURL])

  const getDaysLeft = (dateStr?: string) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const isExpired = (dateStr?: string) => {
    const daysLeft = getDaysLeft(dateStr)
    return daysLeft !== null && daysLeft < 0
  }

  // Filter jobs
  const filteredJobs = initialJobs.filter((job) => {
    // Status filter
    const expired = isExpired(job.lastDate)
    if (statusFilter === 'active' && expired) return false
    if (statusFilter === 'expired' && !expired) return false

    // Additional category filters
    if (
      selectedCategories.length > 0 &&
      (!job.category || !job.category.some((cat) => selectedCategories.includes(cat)))
    )
      return false

    // Additional qualification filters
    if (
      selectedQualifications.length > 0 &&
      (!job.education || !job.education.some((edu) => selectedQualifications.includes(edu)))
    )
      return false

    // Additional state filters
    if (selectedStates.length > 0 && !selectedStates.includes(job.state || '')) return false

    return true
  })

  const clearAllFilters = () => {
    // Reset to only the base filter
    setSelectedCategories(filterType === 'category' ? [filterValue] : [])
    setSelectedQualifications(filterType === 'qualification' ? [filterValue] : [])
    setSelectedStates(filterType === 'state' ? [baseStateCode] : [])
    router.push(`/jobs/${filterType}/${filterValue}`, { scroll: false })
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
    selectedCategories.length + selectedQualifications.length + selectedStates.length - 1 // -1 for the base filter

  const filterTypeLabel =
    filterType === 'category'
      ? 'Category'
      : filterType === 'qualification'
        ? 'Qualification'
        : 'State'

  const filterTypeBadgeColor =
    filterType === 'category'
      ? 'bg-purple-50 text-purple-600'
      : filterType === 'qualification'
        ? 'bg-green-50 text-green-600'
        : 'bg-blue-50 text-blue-600'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 p-2 md:p-4">
          {/* Sidebar - Chip Based Filters */}
          <div className="lg:col-span-3 space-y-3">
            {/* Filter Header */}
            <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
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
                  Clear Additional Filters
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
                      disabled={filterType === 'category' && cat.value === filterValue}
                      className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-medium transition-all ${
                        selectedCategories.includes(cat.value)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      } ${filterType === 'category' && cat.value === filterValue ? 'opacity-100 cursor-not-allowed' : ''}`}
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
                      disabled={filterType === 'qualification' && edu.value === filterValue}
                      className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-medium transition-all ${
                        selectedQualifications.includes(edu.value)
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      } ${filterType === 'qualification' && edu.value === filterValue ? 'opacity-100 cursor-not-allowed' : ''}`}
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
                      disabled={filterType === 'state' && state.value === baseStateCode}
                      className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-medium transition-all ${
                        selectedStates.includes(state.value)
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      } ${filterType === 'state' && state.value === baseStateCode ? 'opacity-100 cursor-not-allowed' : ''}`}
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
              <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                <div>
                  <span
                    className={`text-xs font-semibold ${filterTypeBadgeColor} px-3 py-1 rounded-full uppercase tracking-wide`}
                  >
                    {filterTypeLabel}
                  </span>
                  <h1 className="text-lg md:text-xl font-bold text-slate-900 mt-2">
                    {displayName}
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
                  Clear Additional Filters ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Job Cards - ULTRA COMPACT (Same as JobsPageClient) */}
            <div className="space-y-2">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job: Job) => <JobCard key={job.id} job={job} />)
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
                      Clear Additional Filters
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
