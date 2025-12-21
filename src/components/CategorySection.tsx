'use client'

import { ArrowRight } from 'lucide-react'

interface CategorySectionProps {
  category: {
    name: string
    count: number
    icon: string
    slug: string
  }
  jobs: Array<{
    id: string
    postName: string
    recruitmentBoard: string
    lastDate: string
    applyLink: string
  }>
}

export function CategorySection({ category, jobs }: CategorySectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{category.icon}</span>
          <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
        </div>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {category.count}+ jobs
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <a
              key={job.id}
              href={job.applyLink}
              target="_blank"
              className="block p-3 rounded-lg hover:bg-blue-50 group transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 group-hover:text-blue-600">
                    {job.postName}
                  </h4>
                  <p className="text-sm text-gray-500">{job.recruitmentBoard}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-red-500 font-medium">
                    {new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="text-xs text-gray-400">Apply Now →</div>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No active jobs in this category
          </div>
        )}
      </div>

      <a
        href={`/jobs?category=${category.slug}`}
        className="flex items-center justify-center w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-blue-600 hover:text-blue-600 font-medium transition-colors"
      >
        View All {category.name}
        <ArrowRight size={16} className="ml-2" />
      </a>
    </div>
  )
}