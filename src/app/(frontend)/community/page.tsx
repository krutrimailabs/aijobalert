import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ThreadCard } from '@/components/community/ThreadCard'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { getMeUser } from '@/utilities/getMeUser' // Assuming this utility exists, widely used in Payload starters

export const dynamic = 'force-dynamic'

export default async function CommunityPage() {
  const payload = await getPayload({ config: configPromise })
  const user = await getMeUser()

  const threads = await payload.find({
    collection: 'threads',
    sort: '-createdAt',
    limit: 20,
    depth: 2, // Populate author and topic
  })

  return (
    <div className="space-y-6">
      {/* Create Post Bar */}
      <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
          {/* User Avatar Placeholder */}
          <span className="font-bold text-muted-foreground">
            {user?.user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <Link
          href="/community/new"
          className="flex-1 bg-muted/50 hover:bg-muted cursor-text py-2.5 px-4 rounded-lg text-muted-foreground transition-colors text-sm"
        >
          Create Post...
        </Link>
        <Link
          href="/community/new"
          className="p-2 rounded-full hover:bg-muted transition-colors shrink-0"
          title="Create Post"
        >
          <Plus className="w-6 h-6 text-muted-foreground" />
        </Link>
      </div>

      {/* Filters (Optional Tab Bar) */}
      {/* <div className="flex gap-2 pb-2 overflow-x-auto"> ... </div> */}

      {/* Feed */}
      <div className="space-y-4">
        {threads.docs.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} currentUserId={user?.user?.id} />
        ))}
        {threads.docs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No threads found. Be the first to post!
          </div>
        )}
      </div>
    </div>
  )
}
