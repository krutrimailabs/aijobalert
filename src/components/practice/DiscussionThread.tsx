'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThumbsUp, MessageCircle, MoreVertical, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Type definition matching the API response structure roughly
interface Comment {
  id: string
  user:
    | {
        name: string
        avatar?: string
        initials: string
      }
    | string
    | number // Handle populated vs ID
  content:
    | {
        root: {
          children: Array<{
            children: Array<{
              text: string
            }>
          }>
        }
      }
    | string // Handle rich text vs fallbacks
  createdAt: string
  upvotes: number
  replies?: number
  thread?: string | { id: string }
  question?: string | number | { id: string | number }
}

interface DiscussionThreadProps {
  questionId?: string | number
  threadId?: string | number
}

// Helper to extract text from simple Lexical structure
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractText = (content: any): string => {
  if (typeof content === 'string') return content
  try {
    return content?.root?.children?.[0]?.children?.[0]?.text || 'No content'
  } catch (_e) {
    return 'Content unavailable'
  }
}

// Helper to get user display info
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserInfo = (user: any) => {
  if (typeof user === 'object' && user !== null) {
    return {
      name: user.name || 'Anonymous',
      initials: user.name ? user.name.charAt(0).toUpperCase() : 'U',
    }
  }
  return { name: 'User', initials: 'U' }
}

export const DiscussionThread: React.FC<DiscussionThreadProps> = ({ questionId, threadId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isPosting, setIsPosting] = useState(false)

  const fetchComments = useCallback(async () => {
    setIsLoading(true)
    try {
      let url = '/api/comments?'
      if (threadId) url += `threadId=${threadId}`
      if (questionId) url += `&questionId=${questionId}`

      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()
      // Payload returns paginated response 'docs'
      setComments(data.docs || [])
    } catch (error) {
      console.error(error)
      toast.error('Failed to load comments')
    } finally {
      setIsLoading(false)
    }
  }, [threadId, questionId])

  useEffect(() => {
    if (threadId || questionId) {
      fetchComments()
    }
  }, [fetchComments, threadId, questionId])

  const handlePost = async () => {
    if (!newComment.trim()) return

    setIsPosting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          threadId: threadId ? threadId : undefined,
          questionId: questionId ? questionId : undefined,
        }),
      })

      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized')
        throw new Error('Failed to post')
      }

      const _savedComment = await res.json()

      // Re-fetching is safer for ensuring consistent state
      fetchComments()
      setNewComment('')
      toast.success('Comment posted!')
    } catch (error) {
      console.error(error)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).message === 'Unauthorized') {
        toast.error('You must be logged in to post.')
      } else {
        toast.error('Failed to post comment')
      }
    } finally {
      setIsPosting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized')
        throw new Error('Failed to delete')
      }

      setComments(comments.filter((c) => c.id !== commentId))
      toast.success('Comment deleted')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete comment')
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <h3 className="font-bold text-gray-800 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Discussion ({comments.length})
      </h3>

      {/* Post Comment Box */}
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">ME</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] bg-white"
          />
          <div className="flex justify-end">
            <Button
              onClick={handlePost}
              disabled={!newComment.trim() || isPosting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPosting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading discussions...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 italic">
            No comments yet. Be the first to start the discussion!
          </div>
        ) : (
          comments.map((comment) => {
            const userInfo = getUserInfo(comment.user)
            const textContent = extractText(comment.content)

            return (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                    {userInfo.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-gray-900 text-sm mr-2">
                          {userInfo.name}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">{textContent}</p>
                    <div className="flex gap-4 text-xs font-medium text-gray-500">
                      <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.upvotes || 0}</span>
                      </button>
                      <button className="hover:text-blue-600 transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
