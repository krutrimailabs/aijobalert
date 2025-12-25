import React from 'react'
import { PracticeQuestionCard } from '@/components/practice/QuestionCard'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'

// Helper to extract text from Lexical RichText JSON
interface LexicalNode {
  type?: string
  text?: string
  children?: LexicalNode[]
  root?: LexicalNode
}

const extractTextFromLexical = (node: LexicalNode | LexicalNode[] | string): string => {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractTextFromLexical).join('')
  if (node.type === 'text') return node.text || ''
  if (node.children) return extractTextFromLexical(node.children)
  if (node.root) return extractTextFromLexical(node.root)
  return ''
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

  // If topic not found, return 404 (or handle gracefully)
  if (topicResult.totalDocs === 0) {
    // For MVP, if we don't have the topic in DB yet (failed seed?), we might want to fallback or 404
    // Use standard notFound()
    return notFound()
  }

  const topicDoc = topicResult.docs[0]

  // 2. Fetch Questions for this Topic
  const questionsResult = await payload.find({
    collection: 'questions',
    where: {
      topic: {
        equals: topicDoc.id,
      },
    },
    limit: 50, // Reasonable limit for a page
  })

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Simple Header for MVP */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center text-sm text-slate-500">
          <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="hover:text-blue-600 cursor-pointer capitalize">
            {category.replace(/-/g, ' ')}
          </span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-slate-900 capitalize">
            {topic.replace(/-/g, ' ')}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {topicDoc.name} - General Questions
            </h1>
            <p className="text-slate-500 mb-8">Exercise :: {topicDoc.name} - General Questions</p>

            {questionsResult.docs.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-lg">
                <p className="text-slate-500">No questions added for this topic yet.</p>
              </div>
            ) : (
              questionsResult.docs.map((q: any, idx: number) => (
                <PracticeQuestionCard
                  key={q.id}
                  id={q.id}
                  questionNumber={idx + 1}
                  text={extractTextFromLexical(q.text)}
                  options={(q.options || []).map((opt: any) => ({
                    text: extractTextFromLexical(opt.text),
                    isCorrect: opt.isCorrect,
                  }))}
                  explanation={extractTextFromLexical(q.explanation)}
                />
              ))
            )}
          </div>
        </div>

        {/* Sidebar (Ad Placeholder / Other Topics) */}
        <div className="w-80 space-y-6 hidden lg:block">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 border-b pb-2">Topic Categories</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="hover:bg-slate-50 p-2 rounded cursor-pointer font-medium text-blue-600 bg-blue-50">
                {topicDoc.name}
              </li>
              {/* TODO: Dynamically fetch siblings if needed, for now just show current as active */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
