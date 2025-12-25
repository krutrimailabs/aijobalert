import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getMeUser } from '@/utilities/getMeUser'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import { DiscussionThread } from '@/components/practice/DiscussionThread'
import { VoteControl } from '@/components/community/VoteControl'
import { formatDistanceToNow } from 'date-fns'
import { RichText } from '@payloadcms/richtext-lexical/react' // Depending on payload version

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ThreadPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const user = await getMeUser()

  // 1. Fetch Thread
  // Query by slug OR id (if slug is numeric-like or we fallback)
  // Since our cards link to /thread/[slug] usually using slug field, assume slug search first.
  let thread
  const threadsBySlug = await payload.find({
    collection: 'threads',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 2,
  })

  thread = threadsBySlug.docs[0]

  if (!thread && !isNaN(Number(slug))) {
    // Fallback try ID
    const threadById = await payload.findByID({
      collection: 'threads',
      id: Number(slug),
      depth: 2,
    })
    thread = threadById
  }

  if (!thread) {
    notFound()
  }

  const authorName =
    typeof thread.author === 'object' && thread.author !== null && 'name' in thread.author
      ? (thread.author as { name: string }).name
      : 'Anonymous'

  const topicSlug =
    typeof thread.topic === 'object' && thread.topic !== null && 'slug' in thread.topic
      ? (thread.topic as { slug: string }).slug
      : null

  const topicTitle =
    typeof thread.topic === 'object' && thread.topic !== null && 'title' in thread.topic
      ? (thread.topic as { title: string }).title
      : 'General'

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Navigation */}
      <div className="mb-4">
        <Link
          href={topicSlug ? `/community/topic/${topicSlug}` : '/community'}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {topicTitle || 'Feed'}
        </Link>
      </div>

      <div className="flex gap-4">
        {/* Vote Side (Desktop) */}
        <div className="hidden sm:flex flex-col items-center pt-2">
          <VoteControl
            initialUpvotes={thread.upvotes || 0}
            initialDownvotes={thread.downvotes || 0}
            threadId={thread.id}
            userId={user?.user?.id}
            orientation="vertical"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
          {/* Thread Header */}
          <div className="mb-6 border-b border-border pb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              {topicTitle && (
                <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded-full">
                  c/{topicTitle}
                </span>
              )}
              <span className="flex items-center gap-1">Posted by u/{authorName}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground break-words leading-tight">
              {thread.title}
            </h1>
          </div>

          {/* Thread Body */}
          <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
            {/* Lexical Renderer would go here. For now, JSON stringify or basic text if simple. 
                     Ideally import serialization mapped to components. */}

            {thread.content && typeof thread.content === 'object' && 'root' in thread.content ? (
              <RichText data={thread.content} />
            ) : (
              <div className="whitespace-pre-wrap">{JSON.stringify(thread.content)}</div>
            )}
          </div>

          {/* Mobile Vote & Actions */}
          <div className="sm:hidden mb-6 border-t border-border pt-4">
            <VoteControl
              initialUpvotes={thread.upvotes || 0}
              initialDownvotes={thread.downvotes || 0}
              threadId={thread.id}
              userId={user?.user?.id}
              orientation="horizontal"
            />
          </div>

          {/* Comments Section */}
          <div className="border-t border-border pt-6">
            <DiscussionThread threadId={thread.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
