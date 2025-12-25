'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function toggleVote({
  userId,
  type,
  threadId,
  commentId,
}: {
  userId: number
  type: 'up' | 'down'
  threadId?: number
  commentId?: number
}) {
  const payload = await getPayload({ config: configPromise })

  await headers()
  // 1. Check for existing vote
  const existingVotes = await payload.find({
    collection: 'votes',
    where: {
      and: [
        { user: { equals: userId } },
        threadId ? { thread: { equals: threadId } } : {},
        commentId ? { comment: { equals: commentId } } : {},
      ],
    },
    limit: 1,
  })

  const existingVote = existingVotes.docs[0]

  try {
    if (existingVote) {
      // Logic: Same type -> remove vote (toggle off). Different type -> update vote.
      if (existingVote.type === type) {
        // Toggle OFF
        await payload.delete({
          collection: 'votes',
          id: existingVote.id,
        })

        // Update counters (Decrement)
        if (threadId) {
          // We can't use atomic increment easily with payload local API yet?
          // We have to read-modify-write or use raw SQL.
          // For MVP, read-modify-write is okay but race-condition prone.
          // Using raw SQL is safer for counters.
          const field = type === 'up' ? 'upvotes' : 'downvotes'
          await payload.db.drizzle.execute(
            `UPDATE threads SET ${field} = ${field} - 1 WHERE id = ${threadId}`,
          )
        }
        if (commentId) {
          const field = type === 'up' ? 'upvotes' : 'downvotes'
          await payload.db.drizzle.execute(
            `UPDATE comments SET ${field} = ${field} - 1 WHERE id = ${commentId}`,
          )
        }
      } else {
        // Switch Vote (e.g. Up -> Down)
        await payload.update({
          collection: 'votes',
          id: existingVote.id,
          data: { type },
        })

        // Update counters: Decrement old, Increment new
        if (threadId) {
          const oldField = existingVote.type === 'up' ? 'upvotes' : 'downvotes'
          const newField = type === 'up' ? 'upvotes' : 'downvotes'
          await payload.db.drizzle.execute(
            `UPDATE threads SET ${oldField} = ${oldField} - 1, ${newField} = ${newField} + 1 WHERE id = ${threadId}`,
          )
        }
        if (commentId) {
          const oldField = existingVote.type === 'up' ? 'upvotes' : 'downvotes'
          const newField = type === 'up' ? 'upvotes' : 'downvotes'
          await payload.db.drizzle.execute(
            `UPDATE comments SET ${oldField} = ${oldField} - 1, ${newField} = ${newField} + 1 WHERE id = ${commentId}`,
          )
        }
      }
    } else {
      // New Vote
      await payload.create({
        collection: 'votes',
        data: {
          user: userId,
          type,
          thread: threadId,
          comment: commentId,
        },
      })

      // Update counters (Increment)
      if (threadId) {
        const field = type === 'up' ? 'upvotes' : 'downvotes'
        await payload.db.drizzle.execute(
          `UPDATE threads SET ${field} = ${field} + 1 WHERE id = ${threadId}`,
        )
      }
      if (commentId) {
        const field = type === 'up' ? 'upvotes' : 'downvotes'
        await payload.db.drizzle.execute(
          `UPDATE comments SET ${field} = ${field} + 1 WHERE id = ${commentId}`,
        )
      }
    }

    revalidatePath('/community')
    if (threadId) revalidatePath(`/community/thread/${threadId}`)

    return { success: true }
  } catch (error) {
    console.error('Vote Error:', error)
    return { success: false, error: 'Failed to vote' }
  }
}
