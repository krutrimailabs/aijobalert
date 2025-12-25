import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { PracticeSession, Question } from '../../../../../components/practice/PracticeSession'

export interface TopicDoc {
  id: string | number
  name: string
  slug: string
}

export default async function PracticeTopicPage({
  params,
}: {
  params: Promise<{ category: string; topic: string }>
}) {
  const { category, topic } = await params
  const payload = await getPayload({ config: configPromise })

  // 1. Fetch the Topic by Slug
  const topicResult = await payload.find({
    collection: 'practice-topics',
    where: {
      slug: {
        equals: topic,
      },
    },
    limit: 1,
  })

  // If topic not found, return 404
  if (topicResult.totalDocs === 0) {
    return notFound()
  }

  const topicDoc = topicResult.docs[0] as unknown as TopicDoc

  // 2. Fetch Questions for this Topic
  const questionsResult = await payload.find({
    collection: 'questions',
    where: {
      topic: {
        equals: topicDoc.id,
      },
    },
    limit: 50,
    sort: 'difficulty',
  })

  // Prepare questions for the client component
  const questions = questionsResult.docs as unknown as Question[]

  return (
    <PracticeSession questions={questions} category={category} topicDoc={topicDoc} topic={topic} />
  )
}
