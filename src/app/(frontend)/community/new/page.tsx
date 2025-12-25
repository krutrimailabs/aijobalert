'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

function CreateThreadForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const questionId = searchParams.get('questionId')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content, // Sending raw text, API will convert to Lexical
          relatedQuestion: questionId,
        }),
      })

      if (!res.ok) throw new Error('Failed to create thread')

      toast.success('Discussion started successfully!')
      router.push('/community')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to start discussion.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Link
        href="/community"
        className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Community
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Start a New Discussion</CardTitle>
          <CardDescription>
            Ask a question, share an update, or discuss exam strategies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-lg font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post details here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[200px]"
              />
            </div>

            {questionId && (
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 border border-blue-100">
                This discussion will be linked to Question #{questionId}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/community">
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Post Discussion
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default function CreateThreadPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        }
      >
        <CreateThreadForm />
      </Suspense>
    </div>
  )
}
