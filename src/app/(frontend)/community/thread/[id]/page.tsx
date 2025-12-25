import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

// Import existing component for now, we might refactor it later
import { DiscussionThread } from '@/components/practice/DiscussionThread'

// Need to define PageProps type properly for Next.js 15
type Params = Promise<{ id: string }>

export default async function ThreadPage({ params }: { params: Params }) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })

  const thread = await payload.findByID({
    collection: 'threads',
    id,
    depth: 2,
  })

  if (!thread) {
    notFound()
  }

  // Cast author to any to avoid strict type checks for now, or define interface
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const author: any = thread.author

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/community"
        className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Community
      </Link>

      {/* Thread Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex gap-2 mb-4">
            {thread.tags &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (thread.tags as any[]).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700">
                  {tag}
                </Badge>
              ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">{thread.title}</h1>

          <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {typeof author === 'object' && author.name
                    ? author.name.charAt(0).toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-slate-900">
                {typeof author === 'object' ? author.name : 'Unknown User'}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            {/* Render RichText here. For now simpler placeholder or JSON dump if RichText component not handy */}
            {/* <RichText content={thread.content} /> */}
            <div className="text-slate-700">
              {/* Fallback for complex rich text rendering in this snippet */}
              {JSON.stringify(thread.content).length > 100
                ? 'Content available (RichText)'
                : 'No content'}
            </div>
          </div>
        </div>
      </div>

      {/* Discussion/Comments Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments
        </h2>
        {/* Reusing DiscussionThread but it needs refactoring to accept threadId */}
        {/* Use questionId prop as threadId hack for now or refactor component */}
        <DiscussionThread questionId={id} />
      </div>
    </div>
  )
}
