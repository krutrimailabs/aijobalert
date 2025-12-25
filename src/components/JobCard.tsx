'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Calendar, MapPin, GraduationCap, Clock, ChevronRight, Bookmark } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/utilities/ui'
import { EDUCATION_LEVELS, INDIAN_STATES } from '@/lib/constants'

export interface Job {
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
  matchScore?: number
  isEligible?: boolean
}

const HighlightText = ({ text, highlight }: { text: string; highlight?: string }) => {
  if (!highlight || !text) return <>{text}</>

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 text-slate-900 rounded-[2px] px-0.5">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

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

export function JobCard({ job, searchQuery }: { job: Job; searchQuery?: string }) {
  const { user } = useAuthStore()
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  // TODO: Check if job is saved/applied on mount (fetch from API or pass as prop)

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to job details
    e.stopPropagation()

    if (!user) {
      window.location.href = '/login'
      return
    }

    setIsSaving(true)
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved-jobs?jobId=${job.id}`, {
          method: 'DELETE',
        })
        if (res.ok) setIsSaved(false)
      } else {
        const res = await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: job.id }),
        })
        if (res.ok) setIsSaved(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      window.location.href = '/login'
      return
    }

    setIsApplying(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, status: 'applied' }),
      })
      if (res.ok) setIsApplied(true)
    } catch (e) {
      console.error(e)
    } finally {
      setIsApplying(false)
    }
  }

  const daysLeft = getDaysLeft(job.lastDate)
  const urgent = daysLeft !== null && daysLeft > 0 && daysLeft <= 5
  const expired = isExpired(job.lastDate)
  const isNewJob = isNew(job)

  return (
    <div className="relative group">
      <Link
        href={`/jobs/${String(job.id)}`}
        className={cn(
          'block bg-white rounded-lg p-2.5 md:p-3 border transition-all relative overflow-hidden',
          isApplied
            ? 'border-green-200 bg-green-50/30'
            : 'border-slate-200 hover:border-blue-400 hover:shadow-md',
        )}
      >
        {isApplied && <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />}

        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0 pr-16">
            {' '}
            {/* Increased padding for buttons */}
            {/* Org + Badges */}
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className="text-[9px] md:text-[10px] font-bold text-blue-700 uppercase">
                <HighlightText text={job.recruitmentBoard || 'Govt'} highlight={searchQuery} />
              </span>

              {/* MATCH SCORE BADGE */}
              {job.matchScore !== undefined && job.matchScore > 0 && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-white text-[8px] md:text-[9px] font-bold rounded flex items-center gap-0.5',
                    job.matchScore >= 80
                      ? 'bg-green-600'
                      : job.matchScore >= 50
                        ? 'bg-blue-600'
                        : 'bg-amber-500',
                  )}
                >
                  {job.matchScore}% Match
                </span>
              )}

              {isApplied && (
                <span className="px-1.5 py-0.5 bg-green-600 text-white text-[8px] md:text-[9px] font-bold rounded flex items-center gap-0.5">
                  ✓ APPLIED
                </span>
              )}
              {!isApplied && !expired && isNewJob && (
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
              <HighlightText text={job.postName} highlight={searchQuery} />
            </h3>
          </div>

          {/* Days Left or Expired */}
          {expired ? (
            <div className="flex-shrink-0 px-2 py-1 rounded bg-slate-100 text-center">
              <div className="text-xs md:text-sm font-bold text-slate-500 leading-none">✕</div>
              <div className="text-[8px] md:text-[9px] font-medium text-slate-500">Expired</div>
            </div>
          ) : daysLeft !== null && daysLeft > 0 ? (
            <div
              className={`flex-shrink-0 px-2 py-1 rounded text-center ${
                urgent ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
              }`}
            >
              <div className="text-sm md:text-base font-black leading-none">{daysLeft}</div>
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
              className={`w-3 h-3 flex-shrink-0 ${urgent ? 'text-red-600' : 'text-orange-600'}`}
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
                <div className="text-[8px] md:text-[9px] text-slate-500">Location</div>
                <div className="text-xs md:text-sm font-bold text-slate-900 truncate">
                  {INDIAN_STATES.find((s) => s.value === job.state)?.label || job.state}
                </div>
              </div>
            </div>
          )}

          {job.education && job.education.length > 0 && (
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[8px] md:text-[9px] text-slate-500">Education</div>
                <div className="text-xs md:text-sm font-bold text-slate-900 truncate">
                  {EDUCATION_LEVELS.find((e) => e.value === job.education?.[0])?.label ||
                    job.education[0]}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Eligibility & Details Row - Compact */}
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {(job.minimumAge || job.maximumAge) && (
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] md:text-[10px] font-semibold rounded border border-amber-200">
              Age: {job.minimumAge || '—'}-{job.maximumAge || '—'} yrs
            </span>
          )}

          {job.salaryStipend && (
            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] md:text-[10px] font-semibold rounded border border-green-200">
              💰 {job.salaryStipend}
            </span>
          )}

          {job.feeGeneral && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] md:text-[10px] font-semibold rounded border border-blue-200">
              Fee: ₹{job.feeGeneral}
            </span>
          )}

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

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
        {!isApplied && !expired && (
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="hidden group-hover:block px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded shadow hover:bg-blue-700 transition"
          >
            {isApplying ? '...' : 'APPLY'}
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'p-1.5 rounded-full transition-colors',
            isSaved
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600',
          )}
        >
          <Bookmark className={cn('w-4 h-4', isSaved && 'fill-current')} />
        </button>
      </div>
    </div>
  )
}
