'use client'

import { useState, useTransition } from 'react'
import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { toggleVote } from '@/actions/vote'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface VoteControlProps {
  initialUpvotes: number
  initialDownvotes: number
  // initialUserVote?: 'up' | 'down' | null // To correctly show highlighted state, we need to know if user voted.
  // For MVP, passing vote status from server is expensive without aggregations.
  // We will trust the count update and maybe just toggle locally visual state if we track it?
  // Let's assume we fetch user vote status in thread detail, but for list view it might be heavy.
  // Compromise: Pass userVote if known, otherwise just counters.
  userVote?: 'up' | 'down' | null
  threadId?: number
  commentId?: number
  orientation?: 'vertical' | 'horizontal'
  userId?: number // Needed to verify auth on client before action? Or just try action.
  className?: string
}

export function VoteControl({
  initialUpvotes = 0,
  initialDownvotes = 0,
  userVote: initialUserVote = null,
  threadId,
  commentId,
  orientation = 'vertical',
  userId,
  className,
}: VoteControlProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleVote = (type: 'up' | 'down') => {
    if (!userId) {
      toast.error('Please login to vote')
      return
    }

    // Optimistic Update
    const previousVote = userVote
    const previousUp = upvotes
    const previousDown = downvotes

    let newUp = upvotes
    let newDown = downvotes
    let newVote = userVote

    if (userVote === type) {
      // Toggle Off
      newVote = null
      if (type === 'up') newUp--
      else newDown--
    } else {
      // New Vote or Switch
      newVote = type
      if (type === 'up') {
        newUp++
        if (previousVote === 'down') newDown--
      } else {
        newDown++
        if (previousVote === 'up') newUp--
      }
    }

    setUserVote(newVote)
    setUpvotes(newUp)
    setDownvotes(newDown)

    startTransition(async () => {
      const result = await toggleVote({
        userId,
        type,
        threadId,
        commentId,
      })

      if (!result.success) {
        // Revert
        setUserVote(previousVote)
        setUpvotes(previousUp)
        setDownvotes(previousDown)
        toast.error('Failed to vote')
      } else {
        router.refresh()
      }
    })
  }

  const score = upvotes - downvotes

  return (
    <div
      className={cn(
        'flex items-center gap-1 bg-muted/50 rounded-lg p-1',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        className,
      )}
    >
      <button
        onClick={(e) => {
          e.preventDefault()
          handleVote('up')
        }}
        disabled={isPending}
        className={cn(
          'p-1 rounded hover:bg-background transition-colors',
          userVote === 'up' ? 'text-orange-500' : 'text-muted-foreground hover:text-orange-500',
        )}
        aria-label="Upvote"
      >
        <ArrowBigUp className={cn('w-6 h-6', userVote === 'up' && 'fill-current')} />
      </button>

      <span
        className={cn(
          'font-bold text-sm min-w-[2ch] text-center',
          userVote === 'up'
            ? 'text-orange-500'
            : userVote === 'down'
              ? 'text-blue-500'
              : 'text-foreground',
        )}
      >
        {Intl.NumberFormat('en-US', { notation: 'compact' }).format(score)}
      </span>

      <button
        onClick={(e) => {
          e.preventDefault()
          handleVote('down')
        }}
        disabled={isPending}
        className={cn(
          'p-1 rounded hover:bg-background transition-colors',
          userVote === 'down' ? 'text-blue-500' : 'text-muted-foreground hover:text-blue-500',
        )}
        aria-label="Downvote"
      >
        <ArrowBigDown className={cn('w-6 h-6', userVote === 'down' && 'fill-current')} />
      </button>
    </div>
  )
}
