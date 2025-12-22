'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Job {
  id: string
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  state?: string
  status?: string
}

interface JobTableProps {
  jobs: Job[]
}

export function JobTable({ jobs }: JobTableProps) {
  if (!jobs || jobs.length === 0) {
    return (
       <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No jobs found matching your criteria.</p>
       </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-[40%]">Post Name & Board</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Qualification</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Last Date</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-blue-600 mb-1">{job.recruitmentBoard}</span>
                    <Link href={`/jobs/${job.id}`} className="font-semibold text-gray-900 text-base hover:text-blue-700 transition-colors line-clamp-2">
                       {job.postName}
                    </Link>
                    {/* Mobile Only Meta */}
                    <div className="flex md:hidden gap-3 mt-2 text-xs text-gray-500">
                       <span>{job.totalVacancies ? `${job.totalVacancies} Posts` : ''}</span>
                       <span className="text-red-500 font-medium">Due: {new Date(job.lastDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 hidden md:table-cell align-top text-sm">
                   <div className="flex flex-wrap gap-1 mt-1">
                      {/* Assuming qualification is stored or we fallback to category/mock */}
                      <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs">
                         Not Specified
                      </span>
                   </div>
                </td>
                <td className="py-4 px-6 hidden sm:table-cell align-top">
                   <div className="mt-1 flex flex-col">
                      <span className="text-sm font-bold text-gray-800">
                         {new Date(job.lastDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {new Date(job.lastDate) < new Date(Date.now() + 5 * 86400000) && (
                         <span className="text-xs text-red-500 font-semibold animate-pulse">Closing Soon</span>
                      )}
                   </div>
                </td>
                <td className="py-4 px-6 text-right align-middle">
                   <Link 
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
                   >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                   </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
