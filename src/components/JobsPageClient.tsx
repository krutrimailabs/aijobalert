'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Users,
  Calendar,
  Bell,
  ChevronRight,
  MapPin,
  GraduationCap,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { JOB_CATEGORIES, EDUCATION_LEVELS, INDIAN_STATES } from '@/lib/constants'

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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('active')

  // Initialize filters from URL
  useEffect(() => {
    const cats = searchParams.get('category')?.split(',').filter(Boolean) || []
    const quals = searchParams.get('qualification')?.split(',').filter(Boolean) || []
    const states = searchParams.get('state')?.split(',').filter(Boolean) || []

    setSelectedCategories(cats)
    setSelectedQualifications(quals)
    setSelectedStates(states)
  }, [searchParams])

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()

    if (selectedCategories.length) params.set('category', selectedCategories.join(','))
    if (selectedQualifications.length) params.set('qualification', selectedQualifications.join(','))
    if (selectedStates.length) params.set('state', selectedStates.join(','))

    router.push(`/jobs?${params.toString()}`, { scroll: false })
  }, [router, selectedCategories, selectedQualifications, selectedStates])

  useEffect(() => {
    const timer = setTimeout(updateURL, 300)
    return () => clearTimeout(timer)
  }, [updateURL])

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

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

  const isNew = (job: Job) => {
    if (!job.postDate && !job.updatedAt) return false
    const dateStr = job.postDate || job.updatedAt
    if (!dateStr) return false
    const posted = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.ceil((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  // Filter jobs
  const filteredJobs = initialJobs.filter((job) => {
    // Status filter
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

    return true
  })

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedQualifications([])
    setSelectedStates([])
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
    selectedCategories.length + selectedQualifications.length + selectedStates.length

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
                filteredJobs.map((job: Job) => {
                  const daysLeft = getDaysLeft(job.lastDate)
                  const urgent = daysLeft !== null && daysLeft > 0 && daysLeft <= 5
                  const expired = isExpired(job.lastDate)

                  return (
                    <Link
                      key={job.id}
                      href={`/jobs/${String(job.id)}`}
                      className="block bg-white rounded-lg p-2.5 md:p-3 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          {/* Org + Badges */}
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <span className="text-[9px] md:text-[10px] font-bold text-blue-700 uppercase">
                              {job.recruitmentBoard || 'Govt'}
                            </span>
                            {!expired && isNew(job) && (
                              <span className="px-1.5 py-0.5 bg-green-600 text-white text-[8px] md:text-[9px] font-bold rounded">
                                NEW
                              </span>
                            )}
                            {!expired && urgent && (
                              <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] md:text-[9px] font-bold rounded">
                                URGENT
                              </span>
                            )}
                            {expired && (
                              <span className="px-1.5 py-0.5 bg-slate-500 text-white text-[8px] md:text-[9px] font-bold rounded">
                                EXPIRED
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-xs md:text-sm font-bold text-slate-900 leading-tight mb-1.5 line-clamp-2">
                            {job.postName}
                          </h3>
                        </div>

                        {/* Days Left or Expired */}
                        {expired ? (
                          <div className="flex-shrink-0 px-2 py-1 rounded bg-slate-100 text-center">
                            <div className="text-xs md:text-sm font-bold text-slate-500 leading-none">
                              ✕
                            </div>
                            <div className="text-[8px] md:text-[9px] font-medium text-slate-500">
                              Expired
                            </div>
                          </div>
                        ) : daysLeft !== null && daysLeft > 0 ? (
                          <div
                            className={`flex-shrink-0 px-2 py-1 rounded text-center ${
                              urgent ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                            }`}
                          >
                            <div className="text-sm md:text-base font-black leading-none">
                              {daysLeft}
                            </div>
                            <div className="text-[8px] md:text-[9px] font-medium">days</div>
                          </div>
                        ) : null}
                      </div>

                      {/* Info Grid - Compact */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-1.5">
                        {job.totalVacancies && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-[8px] md:text-[9px] text-slate-500">Posts</div>
                              <div className="text-xs md:text-sm font-bold text-slate-900 truncate">
                                {job.totalVacancies.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Calendar
                            className={`w-3 h-3 flex-shrink-0 ${
                              urgent ? 'text-red-600' : 'text-orange-600'
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="text-[8px] md:text-[9px] text-slate-500">Deadline</div>
                            <div
                              className={`text-xs md:text-sm font-bold truncate ${
                                urgent ? 'text-red-600' : 'text-slate-900'
                              }`}
                            >
                              {formatDate(job.lastDate)}
                            </div>
                          </div>
                        </div>

                        {job.state && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-purple-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-[8px] md:text-[9px] text-slate-500">
                                Location
                              </div>
                              <div className="text-xs md:text-sm font-bold text-slate-900 truncate">
                                {INDIAN_STATES.find((s) => s.value === job.state)?.label ||
                                  job.state}
                              </div>
                            </div>
                          </div>
                        )}

                        {job.education && job.education.length > 0 && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-green-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-[8px] md:text-[9px] text-slate-500">
                                Education
                              </div>
                              <div className="text-xs md:text-sm font-bold text-slate-900 truncate">
                                {EDUCATION_LEVELS.find((e) => e.value === job.education?.[0])
                                  ?.label || job.education[0]}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Eligibility & Details Row - Compact */}
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {/* Age Limit */}
                        {(job.minimumAge || job.maximumAge) && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] md:text-[10px] font-semibold rounded border border-amber-200">
                            Age: {job.minimumAge || '—'}-{job.maximumAge || '—'} yrs
                          </span>
                        )}

                        {/* Salary */}
                        {job.salaryStipend && (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] md:text-[10px] font-semibold rounded border border-green-200">
                            💰 {job.salaryStipend}
                          </span>
                        )}

                        {/* Application Fee */}
                        {job.feeGeneral && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] md:text-[10px] font-semibold rounded border border-blue-200">
                            Fee: ₹{job.feeGeneral}
                          </span>
                        )}

                        {/* Application Start Date */}
                        {job.applicationStartDate && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[9px] md:text-[10px] font-semibold rounded border border-purple-200">
                            Apply from: {formatDate(job.applicationStartDate)}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(job.postDate || job.updatedAt)}
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 font-semibold text-[10px] md:text-xs">
                          Details
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  )
                })
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
