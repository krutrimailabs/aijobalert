'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, TrendingUp, Target, Clock, Activity } from 'lucide-react'

import { StudyStreak } from './StudyStreak'

interface AnalyticsDashboardProps {
  metrics: {
    avgScore: number
    testsTaken: number
    accuracy: number
    timeSpent: number
  }
  history: Array<{ date: string; score: number; testName: string }>
  leaderboard: Array<{ rank: number; name: string; score: number }>
  subjectPerformance?: Array<{ subject: string; score: number }>
  heatmap?: Array<{ date: string; count: number }>
  streaks?: { current: number; longest: number; isActive: boolean }
  timeAnalysis?: { userAvg: number; topperAvg: number }
}

export function AnalyticsDashboard({
  metrics,
  history,
  leaderboard,
  subjectPerformance,
  heatmap,
  streaks,
  timeAnalysis,
}: AnalyticsDashboardProps) {
  // Format seconds to hours
  const hoursSpent = (metrics.timeSpent / 3600).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Target className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-500">Avg Score</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{metrics.avgScore}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Activity className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-500">Tests Taken</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{metrics.testsTaken}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-500">Accuracy</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{metrics.accuracy}%</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-500">Hours Practiced</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{hoursSpent}h</h3>
          </CardContent>
        </Card>
      </div>

      {/* Study Streak & Heatmap */}
      {heatmap && streaks && <StudyStreak heatmap={heatmap} streaks={streaks} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Time Analysis Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Time Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <p className="text-xs text-center text-slate-500 mb-4">
                Average Time per Test (Minutes)
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'You', time: timeAnalysis?.userAvg || 0, fill: '#3b82f6' },
                    { name: 'Topper', time: timeAnalysis?.topperAvg || 0, fill: '#22c55e' },
                  ]}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="time" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Subject Mastery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformance || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="subject"
                    type="category"
                    tick={{ fontSize: 12, width: 80 }}
                    width={80}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="score" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Rankers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.rank === 1
                          ? 'bg-yellow-100 text-yellow-700'
                          : user.rank === 2
                            ? 'bg-slate-200 text-slate-700'
                            : user.rank === 3
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-white border'
                      }`}
                    >
                      {user.rank}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      {/* <p className="text-xs text-slate-500">SSC CGL Mock</p> */}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-blue-600">{user.score}</span>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-center text-slate-500 text-sm">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
