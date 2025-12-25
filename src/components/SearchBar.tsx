'use client'

import { Search, Filter } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    state: '',
    education: '',
    category: '',
  })

  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set('q', searchQuery)
      if (filters.state) params.set('state', filters.state)
      if (filters.education) params.set('education', filters.education)
      if (filters.category) params.set('category', filters.category)

      router.push(`/jobs?${params.toString()}`)
    }
  }

  const popularSearches = [
    'SSC GD Constable',
    'Bank PO',
    'Railway Jobs',
    'Teaching Jobs',
    'Engineering Jobs',
    'Police Recruitment',
  ]

  return (
    <div>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search jobs by title, department, or keywords..."
            className="w-full pl-12 pr-4 py-4 rounded-lg border-none focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mt-3 px-1">
          <select
            className="flex-1 min-w-[150px] border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          >
            <option value="">All States</option>
            <option value="AP">Andhra Pradesh</option>
            <option value="TS">Telangana</option>
            <option value="MH">Maharashtra</option>
            <option value="UP">Uttar Pradesh</option>
            <option value="all_india">All India</option>
          </select>

          <select
            className="flex-1 min-w-[150px] border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.education}
            onChange={(e) => setFilters({ ...filters, education: e.target.value })}
          >
            <option value="">All Education</option>
            <option value="10th">10th Pass</option>
            <option value="12th">12th Pass</option>
            <option value="graduate">Graduate</option>
            <option value="btech">B.Tech/B.E</option>
            <option value="pg">Post Graduate</option>
          </select>

          <select
            className="flex-1 min-w-[150px] border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="banking">Banking</option>
            <option value="railway">Railway</option>
            <option value="teaching">Teaching</option>
            <option value="engineering">Engineering</option>
            <option value="police">Police/Defence</option>
          </select>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
          >
            <Filter size={16} />
            More Filters
          </button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="mt-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>🔥 Popular Searches:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search) => (
            <button
              key={search}
              onClick={() => setSearchQuery(search)}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
