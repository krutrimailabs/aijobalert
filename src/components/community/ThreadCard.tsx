'use client'

import React from 'react'
import Link from 'next/link'
import { MessageSquare, Share2, MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { VoteControl } from './VoteControl'

// Define a local interface or import from payload-types if available/exported to client
// For now, defining shape based on what we know
interface ThreadCardProps {
  thread: {
    id: number
    title: string
    slug?: string | null
    content?: unknown
    createdAt: string
    author?: string | number | { name?: string } | null
    topic?: string | number | { title?: string; slug?: string | null } | null
    upvotes?: number | null
    downvotes?: number | null
    _count?: {
      comments?: number // If we had aggregation, but payload requires relationship lookup usually
    }
  }
  currentUserId?: number
}

// Simple text extractor for Lexical preview
const extractPreview = (content: unknown): string => {
  if (typeof content === 'string') return content
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text = (content as any)?.root?.children?.[0]?.children?.[0]?.text
    if (text) return text.length > 200 ? text.substring(0, 200) + '...' : text
    return ''
  } catch (_e) {
    return ''
  }
}

export const ThreadCard: React.FC<ThreadCardProps> = ({ thread, currentUserId }) => {
  const authorName =
    typeof thread.author === 'object' && thread.author !== null
      ? (thread.author as { name?: string }).name || 'Anonymous'
      : 'User'
  const topicTitle =
    typeof thread.topic === 'object' && thread.topic !== null
      ? (thread.topic as { title?: string }).title
      : 'General'
  const topicSlug =
    typeof thread.topic === 'object' && thread.topic !== null
      ? (thread.topic as { slug?: string | null }).slug
      : 'general'
  const previewText = extractPreview(thread.content)
  const href = thread.slug ? `/community/thread/${thread.slug}` : `/community/thread/${thread.id}`

  return (
    <div className="flex bg-card border border-border rounded-xl hover:border-border/80 transition-all hover:shadow-sm overflow-hidden group">
      {/* Left: Vote Control (Desktop) */}
      <div className="w-10 bg-muted/20 border-r border-border hidden sm:flex flex-col items-center py-3 gap-1">
        <VoteControl
          initialUpvotes={thread.upvotes || 0}
          initialDownvotes={thread.downvotes || 0}
          threadId={thread.id}
          userId={currentUserId}
          orientation="vertical"
          className="bg-transparent"
        />
      </div>

      {/* Right: Content */}
      <div className="flex-1 p-3 sm:p-4">
        {/* Header: Topic • Posted by • Time */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
          {thread.topic && (
            <Link
              href={`/community/topic/${topicSlug}`}
              className="font-bold text-foreground hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {/* <div className="w-4 h-4 rounded-full bg-primary/20"></div> */}
              c/{topicTitle}
            </Link>
          )}
          <span>•</span>
          <span>
            Posted by <span className="hover:underline cursor-pointer">u/{authorName}</span>
          </span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
        </div>

        {/* Body: Title & Preview */}
        <Link href={href} className="block group-hover:no-underline">
          <h3 className="text-lg font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
            {thread.title}
          </h3>
          {previewText && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{previewText}</p>
          )}
        </Link>

        {/* Footer: Actions (Mobile Vote, Comments, Share) */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
          {/* Mobile Vote Control */}
          <div className="sm:hidden mr-2">
            <VoteControl
              initialUpvotes={thread.upvotes || 0}
              initialDownvotes={thread.downvotes || 0}
              threadId={thread.id}
              userId={currentUserId}
              orientation="horizontal"
            />
          </div>

          <Link
            href={href}
            className="flex items-center gap-1.5 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comments</span> {/* Add count if available */}
          </Link>

          <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-muted transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-muted transition-colors ml-auto">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
