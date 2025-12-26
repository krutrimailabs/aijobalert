'use client'

import { useEffect, useState } from 'react'
import { AdminAnalyticsDashboard } from '@/components/admin/AdminAnalyticsDashboard'
import { Loader2 } from 'lucide-react'

// Simple type for the component state
type AnalyticsData = {
  counts: {
    users: number
    jobs: number
    applications: number
    tests: number
    activeLearners: number
  }
  growthHistory: Array<{ date: string; users: number; apps: number }>
  powerUsers: Array<{ name: string; email: string; apps: number }>
  topJobs: Array<{ title: string; board: string; id: string }>
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/analytics')
        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized')
          throw new Error('Failed to fetch data')
        }
        const jsonData = await res.json()
        setData(jsonData)
      } catch (err: unknown) {
        console.error('Admin analytics load error', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
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

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
        <h3 className="font-bold">Access Denied or Error</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Health Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform-wide metrics and growth trends.</p>
      </div>

      {data && (
        <AdminAnalyticsDashboard
          counts={data.counts}
          growthHistory={data.growthHistory}
          powerUsers={data.powerUsers}
          topJobs={data.topJobs}
        />
      )}
    </div>
  )
}
