'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Check, X, Loader2, MessageSquare, FileText } from 'lucide-react'

// Types
interface Thread {
  id: string
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  author: { name: string; email: string } | string | number
  createdAt: string
  status: 'published' | 'pending' | 'rejected'
}

interface Comment {
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  user: { name: string; email: string } | string | number
  createdAt: string
  status: 'published' | 'pending' | 'rejected'
  thread?: { id: string; title: string } | string
}

// Helper to extract text from Lexical
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractText = (content: any): string => {
  if (typeof content === 'string') return content
  try {
    return content?.root?.children?.[0]?.children?.[0]?.text || 'No content'
  } catch (_e) {
    return 'Content unavailable'
  }
}

// Helper to get user/author name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getName = (user: any) => {
  if (typeof user === 'object' && user !== null) return user.name || user.email || 'Unknown'
  return `User ID: ${user}`
}

export default function ModerationDashboard() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [threadsRes, commentsRes] = await Promise.all([
        fetch('/api/threads?status=pending'),
        fetch('/api/comments?status=pending'),
      ])

      if (threadsRes.ok) {
        const data = await threadsRes.json()
        setThreads(data.docs || [])
      }
      if (commentsRes.ok) {
        const data = await commentsRes.json()
        setComments(data.docs || [])
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load pending items')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAction = async (
    type: 'threads' | 'comments',
    id: string,
    action: 'published' | 'rejected',
  ) => {
    try {
      const res = await fetch(`/api/${type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action }),
      })

      if (!res.ok) throw new Error(`Failed to ${action}`)

      toast.success(`${type === 'threads' ? 'Thread' : 'Comment'} ${action}`)

      // Update local state
      if (type === 'threads') {
        setThreads(threads.filter((t) => t.id !== id))
      } else {
        setComments(comments.filter((c) => c.id !== id))
      }
    } catch (error) {
      console.error(error)
      toast.error(`Failed to ${action} item`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Moderation Dashboard</h1>
        <p className="text-gray-500 mt-2">Review and manage user-submitted content.</p>
      </div>

      <Tabs defaultValue="threads" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-lg">
          <TabsTrigger value="threads" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Threads ({threads.length})
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comments ({comments.length})
          </TabsTrigger>
        </TabsList>

        {/* Threads Tab */}
        <TabsContent value="threads">
          {threads.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">No pending threads to review.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {threads.map((thread) => (
                <Card key={thread.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{thread.title}</CardTitle>
                        <CardDescription>
                          by {getName(thread.author)} •{' '}
                          {new Date(thread.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 line-clamp-3">{extractText(thread.content)}</p>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleAction('threads', thread.id, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAction('threads', thread.id, 'published')}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments">
          {comments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">No pending comments to review.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">Comment on Thread</CardTitle>
                        <CardDescription>
                          by {getName(comment.user)} •{' '}
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-md">
                      {extractText(comment.content)}
                    </p>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleAction('comments', comment.id, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAction('comments', comment.id, 'published')}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
