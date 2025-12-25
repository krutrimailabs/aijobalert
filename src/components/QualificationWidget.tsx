'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, Lock } from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'

interface QualificationWidgetProps {
  jobId: string | number
  expectedCutoff?: number | null
}

interface Prediction {
  probability: number
  label: string
  color: string
  message: string
}

export function QualificationWidget({ jobId, expectedCutoff }: QualificationWidgetProps) {
  const { user } = useAuthStore()
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!user || !expectedCutoff) return
      setLoading(true)
      try {
        const res = await fetch('/api/predict-qualification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, jobId, expectedCutoff }),
        })
        if (res.ok) {
          const data = await res.json()
          setPrediction(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [user, jobId, expectedCutoff])

  if (!expectedCutoff) return null

  // State 1: User not logged in
  if (!user) {
    return (
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
        <Sparkles className="w-24 h-24 text-white/10 absolute -top-4 -right-4" />
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> Will You Qualify?
        </h3>
        <p className="text-white/80 text-sm mb-4">
          Login to predict your chances of clearing this exam based on your mock test performance.
        </p>
        <Link href="/login">
          <Button variant="secondary" className="w-full font-semibold text-indigo-700">
            Login to Check <Lock className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )
  }

  // State 2: Prediction Loading or Unavailable
  if (loading) {
    return (
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-10 bg-slate-200 rounded w-full"></div>
      </div>
    )
  }

  // State 3: User logged in but no data (handled by API returning label 'No Data')
  if (prediction?.label === 'No Data') {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" /> AI Prediction
        </h3>
        <p className="text-slate-500 text-sm mb-4">
          We need more data! Take at least one mock test to unlock your prediction.
        </p>
        <Link href="/practice">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Take a Mock Test <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )
  }

  // State 4: Prediction Result
  if (prediction) {
    const colorMap: Record<string, string> = {
      green: 'text-green-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      gray: 'text-slate-500',
    }
    const progressColor =
      prediction.color === 'green'
        ? 'bg-green-600'
        : prediction.color === 'orange'
          ? 'bg-orange-500'
          : 'bg-red-500'

    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg ring-1 ring-slate-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" /> Qualification Chance
            </h3>
            <p className="text-xs text-slate-500 mt-1">Based on recent performance</p>
          </div>
          <div className={`text-xl font-black ${colorMap[prediction.color]}`}>
            {prediction.probability}%
          </div>
        </div>

        <Progress
          value={prediction.probability}
          className="h-2 mb-4"
          indicatorClassName={progressColor}
        />

        <div className="flex items-center justify-between text-sm">
          <span className={`font-bold ${colorMap[prediction.color]}`}>{prediction.label}</span>
          <span className="text-slate-400 text-xs">Target: {expectedCutoff}%</span>
        </div>

        <p className="text-slate-500 text-xs mt-4 border-t pt-3">
          {prediction.message}.{' '}
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            View Progress
          </Link>
        </p>
      </div>
    )
  }

  return null
}
