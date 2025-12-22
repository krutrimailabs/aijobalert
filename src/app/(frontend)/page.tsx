import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Bell, Search, FileText, Download, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { INDIAN_STATES, EDUCATION_LEVELS, JOB_CATEGORIES } from '@/lib/constants'

export const dynamic = 'force-dynamic'

interface Job {
  id: string
  postName: string
  recruitmentBoard?: string
  totalVacancies?: number
  lastDate?: string
  status?: string
  updatedAt: string
  createdAt: string
  slug?: string
}

const GovernmentJobsPortal = async () => {
  // Fetch real data from Supabase via Payload CMS
  let latestJobs: Job[] = []
  let admitCards: Job[] = []
  let results: Job[] = []
  let answerKeys: Job[] = []
  let syllabus: Job[] = []

  try {
    const payload = await getPayload({ config })

    const fetchJobs = async (status: string | null, limit = 10) => {
      try {
        const where = status ? { status: { equals: status } } : undefined
        const { docs } = await payload.find({
          collection: 'jobs',
          limit,
          sort: '-updatedAt',
          where,
        })
        return docs as unknown as Job[]
      } catch (e) {
        console.error('fetchJobs error', e)
        return []
      }
    }

    ;[latestJobs, admitCards, results, answerKeys, syllabus] = await Promise.all([
      fetchJobs('open', 20),
      fetchJobs('admit_card', 15),
      fetchJobs('result', 15),
      fetchJobs('answer_key', 12),
      fetchJobs('syllabus', 8),
    ])

    // Fallback: Populate other sections with latest jobs if they are empty
    if (admitCards.length === 0) admitCards = latestJobs.slice(0, 12)
    if (results.length === 0) results = latestJobs.slice(0, 12)
    if (answerKeys.length === 0) answerKeys = latestJobs.slice(0, 10)
    if (syllabus.length === 0) syllabus = latestJobs.slice(0, 8)
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }

  const getDaysLeft = (dateStr?: string) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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

  const isNew = (job: Job) => {
    const updated = new Date(job.updatedAt)
    const now = new Date()
    const diffDays = Math.ceil((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Alert Banner */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="font-medium">{latestJobs.length} new jobs posted today</span>
          </div>
          <span className="text-xs">
            Last updated: {currentDate}, {currentTime}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="order-2 lg:order-1 lg:col-span-3 space-y-4">
            {/* Search Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <form action="/jobs" method="get" className="space-y-3">
                  <Input name="q" placeholder="Search by job title..." />
                  <Button type="submit" className="w-full">
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">By Category</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {JOB_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.value}
                      href={`/jobs/category/${cat.value}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                    >
                      <span>{cat.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* States */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">By State</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {INDIAN_STATES.slice(0, 12).map((state) => (
                    <Link
                      key={state.value}
                      href={`/jobs/state/${state.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                    >
                      <span>{state.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">By Qualification</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {EDUCATION_LEVELS.slice(0, 10).map((qual) => (
                    <Link
                      key={qual.value}
                      href={`/jobs/qualification/${qual.label.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                    >
                      <span>{qual.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content - High-Density News Feed */}
          <main className="order-1 lg:order-2 lg:col-span-9 space-y-4">
            {/* 1. Fast Action Grid - Quick Access Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: 'Latest Jobs',
                  icon: Bell,
                  color: 'bg-blue-600',
                  href: '/jobs',
                  count: latestJobs.length,
                },
                {
                  label: 'Admit Card',
                  icon: Download,
                  color: 'bg-orange-600',
                  href: '/admit-cards',
                  count: admitCards.length,
                },
                {
                  label: 'Results',
                  icon: FileText,
                  color: 'bg-green-600',
                  href: '/results',
                  count: results.length,
                },
                {
                  label: 'Answer Keys',
                  icon: FileText,
                  color: 'bg-purple-600',
                  href: '/answer-keys',
                  count: answerKeys.length,
                },
              ].map((item) => (
                <Link key={item.label} href={item.href}>
                  <div
                    className={`${item.color} text-white p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md cursor-pointer group`}
                  >
                    <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm tracking-wide uppercase">{item.label}</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-none">
                      {item.count}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>

            {/* 2. Latest Notifications Table - High Information Density */}
            <Card className="border-t-4 border-t-blue-600 shadow-lg">
              <CardHeader className="py-3 bg-gradient-to-r from-blue-50 to-transparent">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2 text-blue-700">
                    <Bell className="w-5 h-5 animate-pulse" /> Latest Notifications & Updates
                  </span>
                  <Link
                    href="/jobs"
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    View All →
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[10px] uppercase text-slate-600 font-bold border-b">
                        <th className="px-3 py-2 whitespace-nowrap">Date</th>
                        <th className="px-3 py-2">Organization & Position</th>
                        <th className="px-3 py-2 text-center hidden md:table-cell">Vacancies</th>
                        <th className="px-3 py-2 text-center hidden md:table-cell">Last Date</th>
                        <th className="px-3 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {latestJobs.slice(0, 15).map((job) => {
                        const daysLeft = getDaysLeft(job.lastDate)
                        return (
                          <tr key={job.id} className="hover:bg-blue-50/50 transition-colors group">
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-500 align-top">
                              <div className="flex flex-col">
                                <span>{formatDate(job.updatedAt)}</span>
                                {isNew(job) && (
                                  <Badge
                                    variant="destructive"
                                    className="text-[8px] px-1 py-0 mt-1"
                                  >
                                    NEW
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 align-top">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-blue-600 uppercase leading-none">
                                  {job.recruitmentBoard || 'Govt Organization'}
                                </span>
                                <Link
                                  href={`/jobs/${job.id}`}
                                  className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 leading-tight line-clamp-2"
                                >
                                  {job.postName}
                                </Link>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center text-xs whitespace-nowrap hidden md:table-cell align-top">
                              {job.totalVacancies ? (
                                <span className="font-semibold text-slate-700">
                                  {job.totalVacancies.toLocaleString('en-IN')}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-center text-xs whitespace-nowrap hidden md:table-cell align-top">
                              {job.lastDate ? (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-slate-600">{formatDate(job.lastDate)}</span>
                                  {daysLeft !== null && daysLeft > 0 && (
                                    <Badge
                                      variant={daysLeft <= 5 ? 'destructive' : 'secondary'}
                                      className="text-[8px] px-1 py-0"
                                    >
                                      {daysLeft}d left
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right align-top">
                              <div className="flex justify-end gap-1">
                                <Link href={`/jobs/${job.id}`}>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] bg-blue-600 text-white border-blue-600 hover:bg-blue-700 cursor-pointer px-2 py-1"
                                  >
                                    Apply
                                  </Badge>
                                </Link>
                                <Link href={`/jobs/${job.id}`}>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] bg-white hover:bg-slate-50 cursor-pointer px-2 py-1"
                                  >
                                    Details
                                  </Badge>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 3. Triple Threat Columns - Admit Cards | Results | Answer Keys */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* ADMIT CARDS COLUMN */}
              <div className="space-y-3">
                <div className="bg-orange-600 text-white px-3 py-2 rounded-lg flex justify-between items-center shadow-md">
                  <h3 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Admit Cards
                  </h3>
                  <Link href="/jobs?status=admit_card">
                    <ChevronRight className="w-4 h-4 hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg divide-y shadow-sm max-h-[500px] overflow-y-auto">
                  {admitCards.length > 0 ? (
                    admitCards.slice(0, 12).map((item) => {
                      const daysLeft = getDaysLeft(item.lastDate)
                      const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft > 0
                      return (
                        <Link
                          key={item.id}
                          href={`/jobs/${item.id}`}
                          className="block p-3 hover:bg-orange-50 transition-colors group"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-orange-600 text-xs mt-0.5">•</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 group-hover:text-orange-700 line-clamp-2 leading-tight">
                                {item.postName}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {item.lastDate && (
                                  <span className="text-[10px] text-slate-500">
                                    📅 {formatDate(item.lastDate)}
                                  </span>
                                )}
                                {isUrgent && (
                                  <Badge
                                    variant="destructive"
                                    className="text-[8px] px-1 py-0 bg-red-600"
                                  >
                                    URGENT
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No admit cards available
                    </div>
                  )}
                </div>
              </div>

              {/* RESULTS COLUMN */}
              <div className="space-y-3">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg flex justify-between items-center shadow-md">
                  <h3 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Results
                  </h3>
                  <Link href="/jobs?status=result">
                    <ChevronRight className="w-4 h-4 hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="bg-white border border-green-200 rounded-lg divide-y shadow-sm max-h-[500px] overflow-y-auto">
                  {results.length > 0 ? (
                    results.slice(0, 12).map((item) => (
                      <Link
                        key={item.id}
                        href={`/jobs/${item.id}`}
                        className="block p-3 hover:bg-green-50 transition-colors group"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-green-600 text-xs mt-0.5">•</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-green-700 line-clamp-2 leading-tight">
                              {item.postName}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {isNew(item) && (
                                <Badge
                                  variant="secondary"
                                  className="text-[8px] px-1 py-0 bg-green-100 text-green-700"
                                >
                                  NEW
                                </Badge>
                              )}
                              <span className="text-[10px] text-slate-500">
                                📅 {formatDate(item.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No results available
                    </div>
                  )}
                </div>
              </div>

              {/* ANSWER KEYS COLUMN */}
              <div className="space-y-3">
                <div className="bg-purple-600 text-white px-3 py-2 rounded-lg flex justify-between items-center shadow-md">
                  <h3 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Answer Keys
                  </h3>
                  <Link href="/jobs?status=answer_key">
                    <ChevronRight className="w-4 h-4 hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg divide-y shadow-sm max-h-[500px] overflow-y-auto">
                  {answerKeys.length > 0 ? (
                    answerKeys.slice(0, 12).map((item) => (
                      <Link
                        key={item.id}
                        href={`/jobs/${item.id}`}
                        className="block p-3 hover:bg-purple-50 transition-colors group"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-purple-600 text-xs mt-0.5">•</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-purple-700 line-clamp-2 leading-tight">
                              {item.postName}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-[10px] text-slate-500">
                                📅 {formatDate(item.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No answer keys available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Syllabus Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Exam Syllabus & Pattern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-3">
                  {syllabus.length > 0 ? (
                    syllabus.slice(0, 6).map((item) => (
                      <Link
                        key={item.id}
                        href={`/jobs/${item.id}`}
                        className="p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <p className="text-sm font-medium text-slate-900 mb-1 line-clamp-1">
                          {item.postName}
                        </p>
                        <p className="text-xs text-slate-500">{item.recruitmentBoard || '—'}</p>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-3 text-center text-slate-500 p-4">
                      No syllabus updates
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}

export default GovernmentJobsPortal
