import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, Mail, TrendingUp, UserCheck } from 'lucide-react'
import { StatsChart } from './stats-chart'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const payload = await getPayload({ config })

  // 1. Fetch User Stats
  const { totalDocs: totalUsers } = await payload.find({
    collection: 'users',
    limit: 0,
  })

  // 2. Fetch Active Users (Logged in within last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { totalDocs: activeUsers } = await payload.find({
    collection: 'users',
    where: {
      'stats.lastLoginAt': {
        greater_than_equal: thirtyDaysAgo.toISOString(),
      },
    },
    limit: 0,
  })

  // 3. Fetch Email Stats
  const { totalDocs: emailOpens } = await payload.find({
    collection: 'email-logs',
    where: { type: { equals: 'open' } },
    limit: 0,
  })

  const { totalDocs: emailClicks } = await payload.find({
    collection: 'email-logs',
    where: { type: { equals: 'click' } },
    limit: 0,
  })

  // 4. Fetch Power Users (Most Applications)
  const { docs: powerUsers } = await payload.find({
    collection: 'users',
    sort: '-stats.applicationCount',
    limit: 5,
  })

  // 5. Fetch Recent Email Activity
  const { docs: recentActivity } = await payload.find({
    collection: 'email-logs',
    sort: '-createdAt',
    limit: 5,
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time overview of user growth and engagement</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm">
          Live Data
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-slate-400 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Monthly Active Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-slate-400 mt-1">
              {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% Engagement Rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Email Opens</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailOpens}</div>
            <p className="text-xs text-slate-400 mt-1">Global Open Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Link Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailClicks}</div>
            <p className="text-xs text-slate-400 mt-1">High Intent Actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <StatsChart type="growth" />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Email Engagement</CardTitle>
            <CardDescription>Daily opens vs clicks</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <StatsChart type="email" />
          </CardContent>
        </Card>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Power Users */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Power Users</CardTitle>
            <CardDescription>Most active applicants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Name</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Role</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">
                      Apps
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {powerUsers.map((user) => (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{user.name || 'No Name'}</td>
                      <td className="p-4 align-middle text-slate-500">{user.roles?.join(', ')}</td>
                      <td className="p-4 align-middle text-right">
                        {user.stats?.applicationCount || 0}
                      </td>
                    </tr>
                  ))}
                  {powerUsers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-slate-500">
                        No power users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Email Activity</CardTitle>
            <CardDescription>Real-time email events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Event</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Email</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {recentActivity.map((log) => (
                    <tr key={log.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium capitalize">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            log.type === 'open'
                              ? 'bg-green-100 text-green-700'
                              : log.type === 'click'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-slate-500">{log.email}</td>
                      <td className="p-4 align-middle text-right text-xs text-slate-400">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                  {recentActivity.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-slate-500">
                        No recent activity
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
