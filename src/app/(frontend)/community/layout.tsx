import { TopicSidebar } from '@/components/community/TopicSidebar'

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-6 md:py-8 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Hidden on mobile, sticky on desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <TopicSidebar />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
