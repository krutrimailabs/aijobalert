'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

interface Job {
  id: string
  postName: string
  recruitmentBoard: string
  lastDate: string
  aiSummary?: string
  totalVacancies?: number
}

interface HeroSliderProps {
  jobs: Job[]
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ jobs }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === jobs.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [jobs.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === jobs.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? jobs.length - 1 : prev - 1))
  }

  if (!jobs || jobs.length === 0) return null

  const currentJob = jobs[currentIndex]
  const isExpiringSoon = new Date(currentJob.lastDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="relative w-full bg-slate-900 overflow-hidden text-white pt-8 pb-12 lg:pt-16 lg:pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
            
          <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-4">
             ⚡ Latest Notifications
          </h2>

          <div className="w-full max-w-4xl relative">
            {/* Slider Content */}
            <div className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-10 transition-all duration-500 min-h-[280px] flex flex-col justify-center items-center">
               
               <div className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-600/30 border border-blue-400/30 text-blue-200 text-xs font-semibold">
                  {currentJob.recruitmentBoard}
               </div>

               <Link href={`/jobs/${currentJob.id}`} className="hover:underline decoration-blue-400 underline-offset-4">
                  <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight text-white hover:text-blue-200 transition-colors">
                     {currentJob.postName}
                  </h1>
               </Link>

               <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-slate-300 mb-8">
                  {currentJob.totalVacancies && (
                     <span className="flex items-center">
                        Vacancies: <span className="text-white font-semibold ml-1">{currentJob.totalVacancies}</span>
                     </span>
                  )}
                  <span className="hidden md:inline">•</span>
                  <span className={`flex items-center ${isExpiringSoon ? 'text-red-300 font-bold' : ''}`}>
                     <Clock className="w-4 h-4 mr-1" />
                     Deadline: {new Date(currentJob.lastDate).toLocaleDateString()}
                  </span>
               </div>

               <div className="flex gap-4">
                  <Link 
                     href={`/jobs/${currentJob.id}`}
                     className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/20"
                  >
                     Check Eligibility
                  </Link>
               </div>

            </div>

            {/* Navigation Buttons */}
            <button 
               onClick={prevSlide}
               className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-white border border-white/10 backdrop-blur-sm transition-colors"
            >
               <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
               onClick={nextSlide}
               className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-white border border-white/10 backdrop-blur-sm transition-colors"
            >
               <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
               {jobs.map((_, idx) => (
                  <button
                     key={idx}
                     onClick={() => setCurrentIndex(idx)}
                     className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentIndex ? 'bg-blue-500 w-6' : 'bg-slate-600 hover:bg-slate-500'
                     }`}
                  />
               ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
