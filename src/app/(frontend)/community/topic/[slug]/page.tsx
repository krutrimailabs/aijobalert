import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { ThreadCard } from '@/components/community/ThreadCard'
import { getMeUser } from '@/utilities/getMeUser'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const user = await getMeUser()

  // 1. Fetch Topic details
  const topics = await payload.find({
    collection: 'forum-topics',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })

  const topic = topics.docs[0]

  if (!topic) {
    notFound()
  }

  // 2. Fetch Threads for this topic
  const threads = await payload.find({
    collection: 'threads',
    where: {
      'topic.slug': { equals: slug },
    },
    sort: '-createdAt',
    limit: 20,
    depth: 2,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Link
          href="/community"
          className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {/* {topic.icon && ...} */}
            {topic.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            c/{topic.slug} • {topic.threadCount || 0} threads
          </p>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {threads.docs.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} currentUserId={user?.user?.id} />
        ))}
        {threads.docs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No threads in this topic yet.
            <br />
            <Link
              href={`/community/new?topic=${topic.id}`}
              className="text-primary hover:underline mt-2 inline-block"
            >
              Create one?
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
