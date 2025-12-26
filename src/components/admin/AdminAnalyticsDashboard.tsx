'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, FileText, Activity } from 'lucide-react'

interface AdminDashboardProps {
  counts: {
    users: number
    jobs: number
    applications: number
    tests: number
    activeLearners: number
  }
  growthHistory: Array<{ date: string; users: number; apps: number }>
  powerUsers?: Array<{ name: string; email: string; apps: number }>
  topJobs?: Array<{ title: string; board: string; id: string }>
}

export function AdminAnalyticsDashboard({
  counts,
  growthHistory,
  powerUsers,
  topJobs,
}: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{counts.users}</h3>
            <p className="text-xs text-green-600 font-medium mt-1">
              {counts.activeLearners} active recently
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Briefcase className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-500">Total Jobs</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{counts.jobs}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <FileText className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-500">Applications</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{counts.applications}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <Activity className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-500">Tests Taken</p>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{counts.tests}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Acquisition Trend (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthHistory}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Application Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Application Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="apps" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power Users */}
        <Card>
          <CardHeader>
            <CardTitle>Power Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {powerUsers?.map((user, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Applications</span>
                    <p className="text-sm font-bold text-blue-600">{user.apps}</p>
                  </div>
                </div>
              ))}
              {(!powerUsers || powerUsers.length === 0) && (
                <p className="text-slate-500 text-sm">No data</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top/Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topJobs?.map((job, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">
                      {job.title}
                    </p>
                    <p className="text-xs text-slate-500">{job.board}</p>
                  </div>
                  <div className="text-right">
                    {/* Placeholder for views if we had it */}
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
              {(!topJobs || topJobs.length === 0) && (
                <p className="text-slate-500 text-sm">No data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
