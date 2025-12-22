'use client'

import { TrendingUp, Users, Clock, Award } from 'lucide-react'
import { useEffect, useState } from 'react'

export function QuickStats() {
  const [stats, setStats] = useState({
    todayJobs: 0,
    totalJobs: 0,
    activeUsers: 0,
    successRate: 0
  })

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats({
        todayJobs: 24,
        totalJobs: 512,
        activeUsers: 1542,
        successRate: 85
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-2">
          <TrendingUp className="text-blue-300" size={24} />
        </div>
        <div className="text-2xl font-bold text-white">{stats.todayJobs}</div>
        <div className="text-blue-200 text-sm">Today&apos;s Jobs</div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-2">
          <Clock className="text-green-300" size={24} />
        </div>
        <div className="text-2xl font-bold text-white">{stats.totalJobs}</div>
        <div className="text-blue-200 text-sm">Active Jobs</div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-2">
          <Users className="text-purple-300" size={24} />
        </div>
        <div className="text-2xl font-bold text-white">
          {(stats.activeUsers / 1000).toFixed(1)}k
        </div>
        <div className="text-blue-200 text-sm">Active Users</div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-full mb-2">
          <Award className="text-orange-300" size={24} />
        </div>
        <div className="text-2xl font-bold text-white">{stats.successRate}%</div>
        <div className="text-blue-200 text-sm">Match Accuracy</div>
      </div>
    </div>
  )
}