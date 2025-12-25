'use client'

import React, { useState, useEffect } from 'react'
import {
  Clock,
  Menu,
  Home,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  List,
  X,
  CheckCircle,
  BookOpen,
  Target,
  BarChart3,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { PracticeQuestionCard } from './QuestionCard'

// --- Types ---

interface QuestionOption {
  text: any // Lexical rich text or string
  isCorrect?: boolean
}

export interface Question {
  id: string | number
  text: any
  options?: QuestionOption[]
  explanation?: any
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
  marks?: number
  timeLimit?: number
}

interface TopicDoc {
  id: string | number
  name: string
  slug: string
}

interface PracticeSessionProps {
  questions: Question[]
  topicDoc: TopicDoc
  category: string
  topic: string
}

// --- Helper Functions ---

// Helper to extract text from Lexical RichText JSON (basic implementation)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractTextFromLexical = (node: any): string => {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractTextFromLexical).join('')
  if (node.type === 'text') return node.text || ''
  if (node.children) return extractTextFromLexical(node.children)
  if (node.root) return extractTextFromLexical(node.root)
  return ''
}

// --- Components ---

function MobileSidebar({
  questions,
  currentQuestion,
  onSelectQuestion,
  isOpen,
  onClose,
}: {
  questions: Question[]
  currentQuestion: number
  onSelectQuestion: (index: number) => void
  isOpen: boolean
  onClose: () => void
}) {
  const [filter, setFilter] = useState<'all' | 'unanswered'>('all')

  const filteredQuestions = questions.filter((_, idx) => {
    if (filter === 'all') return true
    return true
  })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:w-72 lg:shadow-none
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <List className="w-5 h-5 text-blue-600" />
            Questions
            <span className="text-sm font-normal text-slate-500 ml-2">({questions.length})</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
            type="button"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="p-4 border-b border-slate-200">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">0</div>
              <div className="text-xs text-slate-600">Answered</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-700">{questions.length}</div>
              <div className="text-xs text-slate-600">Total</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">0</div>
              <div className="text-xs text-slate-600">Correct</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 text-sm px-3 py-1.5 rounded-lg ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}
              type="button"
            >
              All
            </button>
            <button
              onClick={() => setFilter('unanswered')}
              className={`flex-1 text-sm px-3 py-1.5 rounded-lg ${filter === 'unanswered' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}
              type="button"
            >
              Unanswered
            </button>
          </div>
        </div>

        {/* Question List */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-200px)]">
          <div className="grid grid-cols-3 gap-2">
            {filteredQuestions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectQuestion(idx + 1)
                  onClose()
                }}
                className={`
                  aspect-square flex items-center justify-center rounded-lg border text-sm font-medium transition-colors
                  ${
                    currentQuestion === idx + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
                type="button"
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
          <div className="space-y-2">
            <button
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              type="button"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Practice
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              type="button"
            >
              <Clock className="w-4 h-4" />
              Start Timer (30:00)
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export function PracticeSession({ questions, topicDoc, category }: PracticeSessionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [timer, setTimer] = useState(1800) // 30 minutes in seconds

  // Start timer on component mount
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion((prev) => prev + 1)
      setShowExplanation(false)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion((prev) => prev - 1)
      setShowExplanation(false)
    }
  }

  const currentQ = questions[currentQuestion - 1]

  return (
    <>
      <MobileSidebar
        questions={questions}
        currentQuestion={currentQuestion}
        onSelectQuestion={(idx) => setCurrentQuestion(idx)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen bg-slate-50 font-sans">
        {/* Mobile Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30 lg:static">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between p-4">
              {/* Left: Menu & Breadcrumb */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
                  type="button"
                  aria-label="Open sidebar"
                >
                  <Menu className="w-5 h-5 text-slate-600" />
                </button>
                <div className="flex items-center text-sm text-slate-600">
                  <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link
                    href={`/practice/${category}`}
                    className="hover:text-blue-600 hidden sm:inline"
                  >
                    {category.replace(/-/g, ' ')}
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-1 hidden sm:inline" />
                  <span className="font-semibold text-slate-900 text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
                    {topicDoc.name}
                  </span>
                </div>
              </div>

              {/* Right: Timer & Stats */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{formatTime(timer)}</span>
                </div>
                <div className="text-sm text-slate-600 hidden md:inline">
                  Q{currentQuestion}/{questions.length}
                </div>
                <Link
                  href={`/practice/${category}`}
                  className="hidden sm:flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex">
            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white min-h-[calc(100vh-80px)]">
                {questions.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Questions Yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Questions for this topic are being prepared.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 md:p-8">
                    {/* Question Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                        <span>
                          Question {currentQuestion} of {questions.length}
                        </span>
                        <span className="font-medium">
                          {Math.round((currentQuestion / questions.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Current Question */}
                    <div className="space-y-6">
                      <PracticeQuestionCard
                        key={currentQ.id}
                        id={currentQ.id}
                        questionNumber={currentQuestion}
                        text={extractTextFromLexical(currentQ.text)}
                        options={(currentQ.options || []).map((opt, idx) => ({
                          text: extractTextFromLexical(opt.text),
                          isCorrect: opt.isCorrect || false,
                        }))}
                        explanation={extractTextFromLexical(currentQ.explanation)}
                        difficulty={currentQ.difficulty}
                        tags={currentQ.tags}
                        marks={currentQ.marks}
                        timeLimit={currentQ.timeLimit}
                        userAnswer={userAnswers[currentQuestion - 1]}
                        onAnswerSelect={(optionIndex) =>
                          handleAnswerSelect(currentQuestion - 1, optionIndex)
                        }
                      />

                      {/* Question Navigation */}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                        <button
                          onClick={handlePreviousQuestion}
                          disabled={currentQuestion <= 1}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          type="button"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="hidden sm:inline">Previous</span>
                        </button>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            type="button"
                          >
                            {showExplanation ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                <span className="hidden sm:inline">Hide Explanation</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                <span className="hidden sm:inline">Show Explanation</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={handleNextQuestion}
                            disabled={currentQuestion >= questions.length}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            type="button"
                          >
                            <span className="hidden sm:inline">Next Question</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Quick Actions */}
                      <div className="lg:hidden flex items-center justify-center gap-3 mt-6">
                        <button
                          onClick={() => setIsSidebarOpen(true)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                          type="button"
                        >
                          <List className="w-4 h-4" />
                          Questions
                        </button>
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{formatTime(timer)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Sidebar (hidden on mobile) */}
            <div className="hidden lg:block w-72 border-l border-slate-200 bg-white">
              <div className="sticky top-0">
                {/* Stats */}
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Practice Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Time Spent</span>
                      <span className="font-medium">{formatTime(timer)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Questions Done</span>
                      <span className="font-medium">
                        {Object.keys(userAnswers).length}/{questions.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Accuracy</span>
                      <span className="font-medium text-green-600">
                        {Object.keys(userAnswers).length > 0 ? '0%' : '--'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    Quick Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Focus on understanding concepts, not just answers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Use the timer to improve speed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Review explanations for wrong answers</span>
                    </li>
                  </ul>
                </div>

                {/* Question Quick Jump */}
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Jump to Question</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {questions.slice(0, 16).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestion(idx + 1)}
                        className={`
                          aspect-square flex items-center justify-center rounded-lg border text-sm font-medium transition-colors
                          ${
                            currentQuestion === idx + 1
                              ? 'bg-blue-600 text-white border-blue-600'
                              : userAnswers[idx] !== undefined
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                          }
                        `}
                        type="button"
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  {questions.length > 16 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        type="button"
                      >
                        View all {questions.length} questions →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
