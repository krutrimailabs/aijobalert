'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Flame, Trophy, Zap } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface StreakProps {
  heatmap: Array<{ date: string; count: number }>
  streaks: {
    current: number
    longest: number
    isActive: boolean
  }
}

export function StudyStreak({ heatmap, streaks }: StreakProps) {
  // Generate dates for last 365 days (reverse order for display might be easier, but let's do grid)
  // Actually, simple grid of 52 weeks is standard.
  // For MVP, we render a grid of tiny squares for the last ~60 days or 90 days to fit mobile.

  // Let's generate last 90 days
  const daysToShow = 90
  const today = new Date()
  const dates = []

  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const activity = heatmap.find((h) => h.date === dateStr)
    dates.push({
      date: dateStr,
      count: activity ? activity.count : 0,
      hasActivity: !!activity,
    })
  }

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-slate-100'
    if (count === 1) return 'bg-green-200'
    if (count === 2) return 'bg-green-400'
    return 'bg-green-600'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Activity Streak
              {streaks.isActive && (
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
              )}
            </CardTitle>
            <CardDescription>Your consistency tracker</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Current Streak</p>
              <p className="text-2xl font-bold text-slate-800">{streaks.current} Days</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Trophy className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Longest Streak</p>
              <p className="text-2xl font-bold text-slate-800">{streaks.longest} Days</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Activity</p>
              <p className="text-2xl font-bold text-slate-800">
                {heatmap.reduce((acc, curr) => acc + curr.count, 0)} Tests
              </p>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div>
          <p className="text-xs text-slate-400 mb-2 font-medium">Last 90 Days Activity</p>
          <div className="flex flex-wrap gap-1">
            <TooltipProvider>
              {dates.map((d, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-3 h-3 rounded-sm ${getIntensityClass(d.count)} hover:ring-2 ring-offset-1 ring-slate-300 transition-all cursor-pointer`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-semibold">{new Date(d.date).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-500">{d.count} tests completed</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
            <span>Less</span>
            <div className="w-2 h-2 bg-slate-100 rounded-sm"></div>
            <div className="w-2 h-2 bg-green-200 rounded-sm"></div>
            <div className="w-2 h-2 bg-green-400 rounded-sm"></div>
            <div className="w-2 h-2 bg-green-600 rounded-sm"></div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
