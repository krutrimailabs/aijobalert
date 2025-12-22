'use client'

import React, { useState } from 'react'
import { Filter, Check } from 'lucide-react'

// Mock data to be replaced with real props or API fetch
const STATES = ['Andhra Pradesh', 'Telangana', 'Maharashtra', 'Delhi', 'Uttar Pradesh', 'Tamil Nadu', 'All India']
const CATEGORIES = ['Bank', 'SSC', 'Railway', 'Teaching', 'Engineering', 'Police', 'Defence']
const QUALIFICATIONS = ['10th Pass', '12th Pass', 'Graduate', 'B.Tech/B.E', 'Post Graduate', 'Diploma']

export function JobsSidebar({ 
  onFilterChange 
}: { 
  onFilterChange: (filters: { state: string[], category: string[], qualification: string[] }) => void 
}) {
  const [filters, setFilters] = useState({
    state: [] as string[],
    category: [] as string[],
    qualification: [] as string[]
  })

  // Toggle helper
  const toggleFilter = (type: keyof typeof filters, value: string) => {
    const newValues = filters[type].includes(value)
      ? filters[type].filter(item => item !== value)
      : [...filters[type], value]
    
    const newFilters = { ...filters, [type]: newValues }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 flex items-center">
          <Filter size={18} className="mr-2 text-blue-600" />
          Filters
        </h3>
        <button 
           onClick={() => {
              const reset = { state: [], category: [], qualification: [] }
              setFilters(reset)
              onFilterChange(reset)
           }}
           className="text-xs text-blue-600 font-semibold hover:underline"
        >
          Reset
        </button>
      </div>

      {/* States Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">State</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
          {STATES.map(state => (
            <label key={state} className="flex items-center cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${filters.state.includes(state) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                {filters.state.includes(state) && <Check size={10} className="text-white" />}
              </div>
              <span className={`text-sm ${filters.state.includes(state) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{state}</span>
              <input type="checkbox" className="hidden" checked={filters.state.includes(state)} onChange={() => toggleFilter('state', state)} />
            </label>
          ))}
        </div>
      </div>

      {/* Qualification Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Qualification</h4>
        <div className="space-y-2">
          {QUALIFICATIONS.map(qual => (
            <label key={qual} className="flex items-center cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${filters.qualification.includes(qual) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                 {filters.qualification.includes(qual) && <Check size={10} className="text-white" />}
              </div>
              <span className={`text-sm ${filters.qualification.includes(qual) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{qual}</span>
              <input type="checkbox" className="hidden" checked={filters.qualification.includes(qual)} onChange={() => toggleFilter('qualification', qual)} />
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${filters.category.includes(cat) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                 {filters.category.includes(cat) && <Check size={10} className="text-white" />}
              </div>
              <span className={`text-sm ${filters.category.includes(cat) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat}</span>
              <input type="checkbox" className="hidden" checked={filters.category.includes(cat)} onChange={() => toggleFilter('category', cat)} />
            </label>
          ))}
        </div>
      </div>

    </div>
  )
}
