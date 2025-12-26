'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'

export type SyllabusTopic = {
  id?: string
  topicName: string
  subTopics?: string // Comma separated as per schema
  weightage?: string
}

export type SyllabusDoc = {
  id: string
  title: string
  category: string
  subject?: string
  topics?: SyllabusTopic[]
  updatedAt: string
}

interface SyllabusExplorerProps {
  initialSyllabus: SyllabusDoc[]
}

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'SSC', value: 'ssc' },
  { label: 'Banking', value: 'banking' },
  { label: 'UPSC', value: 'upsc' },
  { label: 'Railways', value: 'railways' },
  { label: 'Teaching', value: 'teaching' },
  { label: 'Defence', value: 'defence' },
  { label: 'State Exams', value: 'state-exams' },
]

export function SyllabusExplorer({ initialSyllabus }: SyllabusExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({})
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({})

  // Filter logic
  const filteredSyllabus =
    selectedCategory === 'all'
      ? initialSyllabus
      : initialSyllabus.filter((s) => s.category === selectedCategory)

  const toggleDoc = (id: string) => {
    setExpandedDocs((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleTopic = (id: string, docId: string) => {
    const key = `${docId}-${id}`
    setExpandedTopics((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
              selectedCategory === cat.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Syllabus List */}
      <div className="space-y-4">
        {filteredSyllabus.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p>No syllabus found for this category.</p>
          </div>
        ) : (
          filteredSyllabus.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Document Header */}
              <button
                onClick={() => toggleDoc(doc.id)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{doc.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <span className="uppercase text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                        {doc.category}
                      </span>
                      {doc.subject && <span>• {doc.subject}</span>}
                      <span>• {doc.topics?.length || 0} Topics</span>
                    </div>
                  </div>
                </div>
                {expandedDocs[doc.id] ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Topics Accordion */}
              {expandedDocs[doc.id] && (
                <div className="border-t border-slate-100 bg-slate-50/30">
                  {doc.topics?.map((topic, idx) => {
                    // Generate a pseudo-ID if not present
                    const topicId = topic.id || `topic-${idx}`
                    const isExpanded = expandedTopics[`${doc.id}-${topicId}`]
                    const subTopicsList = topic.subTopics
                      ? topic.subTopics
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : []

                    return (
                      <div key={topicId} className="border-b border-slate-100 last:border-0">
                        <button
                          onClick={() => toggleTopic(topicId, doc.id)}
                          className="w-full flex items-center justify-between px-4 py-3 md:px-6 hover:bg-slate-50 transition-colors text-left"
                        >
                          <div className="flex items-start gap-3">
                            <Layers className="w-4 h-4 mt-1 text-slate-400" />
                            <div>
                              <span className="text-sm md:text-base font-semibold text-slate-800">
                                {topic.topicName}
                              </span>
                              {topic.weightage && (
                                <p className="text-xs text-green-600 font-medium mt-0.5">
                                  Weightage: {topic.weightage}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* Only show chevron if there are subtopics */}
                          {subTopicsList.length > 0 &&
                            (isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            ))}
                        </button>

                        {/* Subtopics List */}
                        {isExpanded && subTopicsList.length > 0 && (
                          <div className="px-10 py-3 pb-5 space-y-2 bg-white">
                            {subTopicsList.map((sub, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-start gap-2 text-sm text-slate-600"
                              >
                                <CheckCircle2 className="w-3 h-3 mt-1 text-blue-400 shrink-0" />
                                <span>{sub}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
