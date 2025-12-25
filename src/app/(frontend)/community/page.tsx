import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { MessageSquare, Plus, Search, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function CommunityPage() {
  const payload = await getPayload({ config: configPromise })

  const threads = await payload.find({
    collection: 'threads',
    sort: '-createdAt',
    limit: 10,
    depth: 1,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Community Forum
          </h1>
          <p className="text-slate-500 mt-1">
            Discuss exam strategies, ask doubts, and connect with peers.
          </p>
        </div>
        <Link href="/community/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-4 h-4" />
            Start Discussion
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search discussions..."
            className="pl-10 border-slate-200 focus-visible:ring-blue-500"
          />
        </div>
        {/* Future: Add Tags/Categories filters here */}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Threads List (Left 2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Recent Discussions
          </h2>

          {threads.docs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 mb-4">No discussions yet.</p>
              <Link href="/community/new">
                <Button variant="outline">Be the first to post</Button>
              </Link>
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            threads.docs.map((thread: any) => (
              <Link key={thread.id} href={`/community/thread/${thread.id}`} className="block group">
                <Card className="hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        {thread.tags && thread.tags.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {thread.tags.map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {thread.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-slate-500 text-sm line-clamp-2">
                      {/* We'd render rich text preview here ideally, for now basic text */}
                      Click to read more...
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-slate-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-600">
                        {typeof thread.author === 'object' ? thread.author.name : 'User'}
                      </span>
                      <span>•</span>
                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* Placeholder for reply count if available */}
                    {/* <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>5 replies</span>
                    </div> */}
                  </CardFooter>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Sidebar (Right 1/3) */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-900">
                <TrendingUp className="w-5 h-5" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Exam Strategy', 'IBPS PO', 'Results', 'Interview Tips'].map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="bg-white hover:bg-indigo-100 cursor-pointer border-indigo-200 text-indigo-700"
                  >
                    #{topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-2">
              <p>1. Be respectful and helpful.</p>
              <p>2. No spam or self-promotion.</p>
              <p>3. Stay on topic.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
