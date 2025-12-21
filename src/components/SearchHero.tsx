'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, GraduationCap, ChevronRight } from 'lucide-react'

// Constants for dropdowns (usually imported, but keeping self-contained for speed)
const STATES = [
  'Andhra Pradesh', 'Maharashtra', 'Delhi', 'Uttar Pradesh', 'Karnataka', 
  'Tamil Nadu', 'Telangana', 'Bihar', 'Rajasthan', 'Gujarat'
]
const QUALIFICATIONS = [
  '10th Pass', '12th Pass', 'Graduate', 'B.Tech/B.E', 'Diploma', 'Post Graduate'
]

export const SearchHero: React.FC = () => {
  const router = useRouter()
  const [selectedState, setSelectedState] = useState('')
  const [selectedQual, setSelectedQual] = useState('')

  const handleSearch = () => {
    // Priority to State, then Qualification
    if (selectedState) {
       // Convert Title Case to slug-ish (simple lowercase for now as handled in page)
       const slug = selectedState.toLowerCase().replace(/\s+/g, '-')
       router.push(`/jobs/state/${slug}`)
    } else if (selectedQual) {
       const slug = selectedQual.toLowerCase().replace(/\./g, '').replace(/\//g, '').replace(/\s+/g, '-') // rough slugify
       // simpler map for known ones
       let qSlug = selectedQual
       if(selectedQual === '10th Pass') qSlug = '10th'
       else if(selectedQual === '12th Pass') qSlug = '12th'
       else if(selectedQual === 'Graduate') qSlug = 'graduate'
       else if(selectedQual === 'B.Tech/B.E') qSlug = 'btech'
       else if(selectedQual === 'Diploma') qSlug = 'diploma'
       
       router.push(`/jobs/qualification/${qSlug.toLowerCase()}`)
    }
  }

  return (
    <div className="relative bg-white pt-10 pb-16 border-b border-slate-100">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
            
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
             Find <span className="text-blue-600">Sarkari Jobs</span> That Match You.
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
             Stop scrolling through endless lists. Select your profile to get instant, accurate eligibility matches.
          </p>

          <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row gap-3">
             
             {/* State Select */}
             <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                   <MapPin className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <select 
                   className="block w-full h-14 pl-10 pr-4 rounded-xl bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-100 focus:bg-white border-0 transition-all appearance-none cursor-pointer hover:bg-slate-100"
                   value={selectedState}
                   onChange={(e) => { setSelectedState(e.target.value); setSelectedQual('') }}
                >
                   <option value="" disabled>Select State</option>
                   {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                   <ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                </div>
             </div>

             {/* Divider Text (Mobile only) */}
             <div className="md:hidden text-center text-xs font-bold text-slate-300 uppercase py-1">OR</div>

             {/* Qualification Select */}
             <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                   <GraduationCap className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <select 
                   className="block w-full h-14 pl-10 pr-4 rounded-xl bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-100 focus:bg-white border-0 transition-all appearance-none cursor-pointer hover:bg-slate-100"
                   value={selectedQual}
                   onChange={(e) => { setSelectedQual(e.target.value); setSelectedState('') }}
                >
                   <option value="" disabled>Select Qualification</option>
                   {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                   <ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                </div>
             </div>

             {/* Search Button */}
             <button 
                onClick={handleSearch}
                disabled={!selectedState && !selectedQual}
                className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
             >
                <Search className="w-5 h-5" />
                Search Jobs
             </button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
             <span className="text-sm font-semibold text-slate-400 mr-2">Quick Access:</span>
             <button onClick={() => router.push('/jobs/category/bank')} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">Bank</button>
             <button onClick={() => router.push('/jobs/category/railway')} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">Railway</button>
             <button onClick={() => router.push('/jobs/qualification/10th')} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">10th Pass</button>
             <button onClick={() => router.push('/jobs/state/delhi')} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors">Delhi</button>
          </div>

        </div>
      </div>
      
      {/* Abstract bg decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
         <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-50 rounded-full blur-3xl opacity-60"></div>
      </div>
    </div>
  )
}
