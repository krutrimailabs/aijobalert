import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Briefcase } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const payload = await getPayload({ config })

  // Fetch all users sorted by latest join date
  const { docs: users } = await payload.find({
    collection: 'users',
    sort: '-createdAt',
    limit: 100, // Reasonable limit for now
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Directory</h1>
          <p className="text-slate-500 mt-1">Manage and view all registered users</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm">
          Total Users: {users.length}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            {/* Search Placeholder - Client Component can be added later for interactivity */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-9 pr-4 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled // Disabled for now until client component is added
              />
            </div>
          </div>
          <CardDescription>List of all registered users on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-medium text-slate-500">User</th>
                  <th className="h-12 px-4 align-middle font-medium text-slate-500">Contact</th>
                  <th className="h-12 px-4 align-middle font-medium text-slate-500">Profile</th>
                  <th className="h-12 px-4 align-middle font-medium text-slate-500">Engagement</th>
                  <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {users.map((user) => (
                  <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-semibold">
                          {user.name || 'No Name'}
                        </span>
                        <div className="flex gap-1 mt-1">
                          {user.roles?.map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className="text-[10px] px-1 py-0 uppercase"
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col text-slate-600">
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-1 text-slate-600 text-xs">
                        {user.domicileState && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {user.domicileState}
                          </div>
                        )}
                        {user.qualification && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-slate-400" />
                            {user.qualification}
                          </div>
                        )}
                        {!user.domicileState && !user.qualification && (
                          <span className="text-slate-400 italic">Incomplete</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900">
                            {user.stats?.applicationCount || 0}
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            Apps
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900">
                            {user.stats?.loginCount || 0}
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            Logins
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
