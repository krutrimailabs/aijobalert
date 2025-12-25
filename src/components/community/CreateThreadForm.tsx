'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function CreateThreadForm({ topics }: { topics: { id: string | number; title: string }[] }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [topicId, setTopicId] = useState(topics[0]?.id || '')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in title and content')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content, // API expects string and converts to lexical, or we pass string and API handles it (as implemented in route.ts previously)
          // Note: The /api/threads route we viewed earlier performs the conversion for us!
          // "const lexicalContent = ... children: [{ text: content }] ..."
          type: 'thread', // ? API seemed to look for { title, content, relatedQuestion }
          // We should also pass topic relation if we want it linked!
          // Wait, previous API code *didn't* see topic handling in the view I saw?
          // I might need to UPDATE /api/threads to accept `topic`!
          // Checking previous /api/threads logic:
          // "const threadData: Omit... = { title, content, author, status }"
          // It did NOT include 'topic'.
          // I MUST update /api/threads/route.ts to handle 'topic' field from body.
          topic: topicId,
        }),
      })

      if (!res.ok) throw new Error('Failed to create thread')

      await res.json()
      toast.success('Thread created!')

      // If we passed topic, we can redirect to it, or just home
      router.push('/community')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to post thread')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={300}
          required
        />
      </div>

      {topics.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Topic</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
          {/* Note: In real app use Select component, using native select for speed/reliability here */}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <Textarea
          placeholder="Share more details..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Post
        </Button>
      </div>
    </form>
  )
}
