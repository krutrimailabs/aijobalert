import React from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, MapPin, Briefcase } from 'lucide-react'

interface JobCardProps {
  id: string
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  state?: string
  salaryStipend?: string
  aiSummary?: string
  applyLink?: string
  advtNo?: string
}

export const JobCard: React.FC<JobCardProps> = ({
  id,
  postName,
  recruitmentBoard,
  totalVacancies,
  lastDate,
  state,
  salaryStipend,
  aiSummary,
  advtNo,
}) => {
  const isExpiringSoon = new Date(lastDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="group relative bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-3 uppercase tracking-wide">
              {recruitmentBoard}
            </span>
            {advtNo && (
               <span className="inline-flex items-center px-3 py-1 ml-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 mb-3 tracking-wide">
                 Advt No: {advtNo}
               </span>
            )}
            <Link href={`/jobs/${id}`} className="inline-block">
               <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                 {postName}
               </h3>
            </Link>
          </div>
          <div className="text-right ml-4">
             {/* State Badge */}
             {state && (
              <div className="flex items-center justify-end text-gray-500 text-sm mb-1">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                {state}
              </div>
            )}
            <div className={`text-sm font-medium ${isExpiringSoon ? 'text-red-600' : 'text-green-600'}`}>
               <span className="flex items-center justify-end">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(lastDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
               </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-6">
          {totalVacancies && (
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
              <span>{totalVacancies} Vacancies</span>
            </div>
          )}
          {salaryStipend && (
             <div className="col-span-2 flex items-center text-gray-700 font-medium bg-gray-50 px-2 py-1 rounded-md w-fit">
                💰 {salaryStipend}
             </div>
          )}
        </div>

        {aiSummary && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 mb-6 border border-indigo-100/50">
            <div className="flex items-center mb-2">
               <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></div>
               <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">AI Summary</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
              {aiSummary}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link 
            href={`/jobs/${id}`}
            className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
          >
            Check Eligibility & Timeline
          </Link>
          
          <Link 
            href={`/jobs/${id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          >
            View More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}
