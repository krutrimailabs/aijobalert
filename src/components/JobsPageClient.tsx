'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Calendar, Bell, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface Job {
  id: string | number
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  state?: string
  status?: string
  updatedAt?: string
}

interface Props {
  initialJobs: Job[]
}

export function JobsPageClient({ initialJobs }: Props) {
  const [searchQuery, setSearchQuery] = useState('')

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

  const isNew = (job: Job) => {
    if (!job.updatedAt) return false
    const updated = new Date(job.updatedAt)
    const now = new Date()
    const diffDays = Math.ceil((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  // Filter jobs based on search
  const filteredJobs = initialJobs.filter(
    (job) =>
      job.postName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.recruitmentBoard &&
        job.recruitmentBoard.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by job title or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Showing {filteredJobs.length} of {initialJobs.length} jobs
          </p>
        </CardContent>
      </Card>

      {/* Jobs List - Responsive Design */}
      <Card className="border-t-4 border-t-blue-600 shadow-lg">
        <CardHeader className="py-4 bg-gradient-to-r from-blue-50 to-transparent">
          <CardTitle className="text-lg md:text-xl flex items-center gap-2 text-blue-700">
            <Bell className="w-5 h-5" />
            Job Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredJobs.length > 0 ? (
            <div className="divide-y">
              {filteredJobs.map((job: Job) => {
                const daysLeft = getDaysLeft(job.lastDate)
                return (
                  <div key={job.id} className="p-4 md:p-5 hover:bg-blue-50/50 transition-colors">
                    <div className="flex flex-col gap-3">
                      {/* Mobile & Desktop Optimized Layout */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Organization + Badges */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xs font-bold text-blue-600 uppercase">
                              {job.recruitmentBoard || 'Govt Organization'}
                            </span>
                            {isNew(job) && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                NEW
                              </Badge>
                            )}
                          </div>

                          {/* Job Title - Clickable */}
                          <Link href={`/jobs/${String(job.id)}`} className="block mb-3 group">
                            <h3 className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                              {job.postName}
                            </h3>
                          </Link>

                          {/* Meta Info with Icons */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                            {job.totalVacancies && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">
                                  {job.totalVacancies.toLocaleString('en-IN')} Posts
                                </span>
                              </div>
                            )}
                            {job.lastDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span>Due: {formatDate(job.lastDate)}</span>
                              </div>
                            )}
                            {job.updatedAt && (
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <span>Updated: {formatDate(job.updatedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Desktop Deadline Badge */}
                        {daysLeft !== null && daysLeft > 0 && (
                          <div className="hidden md:block shrink-0">
                            <Badge
                              variant={daysLeft <= 5 ? 'destructive' : 'secondary'}
                              className="whitespace-nowrap text-xs px-3 py-1.5"
                            >
                              {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Bottom Row - Mobile Deadline + Action Buttons */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        {/* Mobile Deadline Badge */}
                        <div className="flex items-center">
                          {daysLeft !== null && daysLeft > 0 && (
                            <Badge
                              variant={daysLeft <= 5 ? 'destructive' : 'secondary'}
                              className="md:hidden text-[10px] px-2 py-0.5"
                            >
                              {daysLeft}d left
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link href={`/jobs/${String(job.id)}`}>
                            <Badge
                              variant="outline"
                              className="text-xs bg-white hover:bg-slate-50 cursor-pointer px-3 py-1.5 border-slate-300"
                            >
                              Details
                            </Badge>
                          </Link>
                          <Link href={`/jobs/${String(job.id)}`}>
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-600 text-white border-blue-600 hover:bg-blue-700 cursor-pointer px-3 py-1.5"
                            >
                              Apply Now
                            </Badge>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-slate-500 text-lg mb-2">
                {searchQuery ? 'No jobs found matching your search' : 'No jobs available'}
              </p>
              <p className="text-slate-400 text-sm">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Check back later for new opportunities'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
