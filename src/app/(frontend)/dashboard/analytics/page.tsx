'use client'

import { useEffect, useState } from 'react'
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard'
import { Loader2 } from 'lucide-react'

interface AnalyticsPageState {
  metrics: {
    avgScore: number
    testsTaken: number
    accuracy: number
    timeSpent: number
  }
  history: Array<{ date: string; score: number; testName: string }>
  leaderboard: Array<{ rank: number; name: string; score: number }>
  subjectPerformance: Array<{ subject: string; score: number }>
  heatmap?: Array<{ date: string; count: number }>
  streaks?: { current: number; longest: number; isActive: boolean }
  timeAnalysis?: { userAvg: number; topperAvg: number }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsPageState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, leaderboardRes] = await Promise.all([
          fetch('/api/analytics/dashboard'),
          fetch('/api/analytics/leaderboard'),
        ])

        const dashboardData = await dashboardRes.json()
        const leaderboardData = await leaderboardRes.json()

        setData({
          ...dashboardData,
          leaderboard: Array.isArray(leaderboardData) ? leaderboardData : [],
        })
      } catch (error) {
        console.error('Failed to load analytics', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Performance Analytics</h1>
        <p className="text-slate-500 mt-1">Track your progress and compare with top performers.</p>
      </div>

      {data && (
        <AnalyticsDashboard
          metrics={data.metrics}
          history={data.history}
          leaderboard={data.leaderboard}
          subjectPerformance={data.subjectPerformance}
          heatmap={data.heatmap}
          streaks={data.streaks}
          timeAnalysis={data.timeAnalysis}
        />
      )}
    </div>
  )
}
