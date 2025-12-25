import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { Hash, Home, MessageSquare, Plus } from 'lucide-react'
import { cn } from '@/utilities/cn'

export async function TopicSidebar({ className }: { className?: string }) {
  const payload = await getPayload({ config: configPromise })

  const topics = await payload.find({
    collection: 'forum-topics',
    sort: '-threadCount',
    limit: 50,
  })

  return (
    <div className={cn('sticky top-20 h-fit w-full max-w-xs space-y-6 hidden lg:block', className)}>
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-muted/30 border-b border-border">
          <h2 className="font-semibold text-lg flex items-center gap-2">Home</h2>
        </div>
        <div className="p-2">
          <nav className="flex flex-col gap-1">
            <Link
              href="/community"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-foreground font-medium"
            >
              <Home className="w-4 h-4" />
              <span>All Feeds</span>
            </Link>
            <Link
              href="/community?sort=top"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-foreground font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Popular</span>
            </Link>
          </nav>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-center">
          <h2 className="font-semibold text-lg">Topics</h2>
          <Link
            href="/admin/collections/forum-topics/create"
            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition"
          >
            Create
          </Link>
        </div>
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {topics.docs.map((topic) => (
              <Link
                key={topic.id}
                href={`/community/topic/${topic.slug}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-foreground group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs shrink-0">
                    {/* Optionally use topic.icon if available */}
                    <Hash className="w-3 h-3" />
                  </div>
                  <span className="font-medium truncate max-w-[140px]">{topic.title}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted group-hover:bg-background px-1.5 py-0.5 rounded-full transition-colors">
                  {topic.threadCount || 0}
                </span>
              </Link>
            ))}
            {topics.docs.length === 0 && (
              <div className="text-sm text-muted-foreground p-4 text-center">No topics yet.</div>
            )}
          </nav>
        </div>
      </div>

      <Link
        href="/community/new"
        className={cn(
          'flex items-center justify-center gap-2 w-full py-3 rounded-xl',
          'bg-primary text-primary-foreground font-bold shadow-lg hover:opacity-90 transition-all',
          'transform active:scale-95',
        )}
      >
        <Plus className="w-5 h-5" />
        Create Post
      </Link>
    </div>
  )
}
