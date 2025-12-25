'use client'

import { submitTest } from '@/actions/submitTest'
import { Scorecard } from '@/components/exam/Scorecard'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Clock, User, Info, Menu } from 'lucide-react'
import Countdown from 'react-countdown'

// Mock Data for MVP
const MOCK_SECTIONS = [
  'General Intelligence',
  'General Awareness',
  'Quantitative Aptitude',
  'English Language',
]
const MOCK_QUESTIONS = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  text: `Question ${i + 1}: Which of the following is true regarding the React Virtual DOM?`,
  options: [
    'It is a direct copy of the DOM',
    'It is a lightweight copy of the DOM',
    'It is slower than Real DOM',
    'None of the above',
  ],
  status: 'not_visited', // | not_answered | answered | marked_review
}))

export default function ExamPage({ params: _params }: { params: Promise<{ id: string }> }) {
  const [currentSection, setCurrentSection] = useState(MOCK_SECTIONS[0])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({}) // qId -> optionIndex
  const [markedForReview, setMarkedForReview] = useState<number[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex]

  interface ExamResult {
    score: number
    totalQuestions: number
    correct?: number
    wrong?: number
    skipped: number
    correctAnswers?: number
    wrongAnswers?: number
  }

  const [result, setResult] = useState<ExamResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // In real app, pass dynamic ID. Here sending 'mock-id'
      const res = await submitTest('mock-test-id', answers)
      setResult(res)
      setExamStatus('ended')
    } catch (e) {
      console.error(e)
      // Fallback for demo if DB fails (e.g. no mock-id)
      setResult({
        score: 15.5,
        totalQuestions: 25,
        correctAnswers: 18,
        wrongAnswers: 7,
        skipped: 0,
      })
      setExamStatus('ended')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOptionSelect = (optIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optIndex }))
  }

  const [examStatus, setExamStatus] = useState<'instructions' | 'started' | 'ended'>('instructions')
  const [isChecked, setIsChecked] = useState(false)

  const startExam = () => {
    if (isChecked) setExamStatus('started')
  }

  if (examStatus === 'instructions') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl h-[80vh] flex flex-col shadow-xl">
          <div className="h-14 bg-slate-900 text-white flex items-center px-6 shrink-0 rounded-t-xl">
            <h1 className="font-bold text-lg">General Instructions</h1>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-700">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 border-b pb-2">
                Please read the instructions carefully
              </h3>
              <p>
                <strong>1.</strong> The clock has been set at the server and the countdown timer at
                the top right corner of your screen will display the time remaining for you to
                complete the exam.
              </p>
              <p>
                <strong>2.</strong> The question palette at the right of screen shows one of the
                following statuses of each of the questions numbered:
              </p>
              <ul className="list-none space-y-2 ml-4 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-slate-200 rounded text-center leading-6 text-xs">
                    1
                  </span>{' '}
                  You have not visited the question yet.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-500 text-white rounded text-center leading-6 text-xs">
                    3
                  </span>{' '}
                  You have not answered the question.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded text-center leading-6 text-xs clip-path-polygon">
                    5
                  </span>{' '}
                  You have answered the question.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-500 text-white rounded-full text-center leading-6 text-xs">
                    7
                  </span>{' '}
                  You have NOT answered the question but have marked the question for review.
                </li>
              </ul>
              <p className="mt-4">
                <strong>3.</strong> The Marked for Review status simply acts as a reminder that you
                have set to look at the question again. If an answer is selected for a question that
                is Marked for Review, the answer will be considered in the final evaluation.
              </p>
            </div>
          </div>
          <div className="h-20 border-t bg-slate-100 flex items-center justify-between px-8 shrink-0 rounded-b-xl">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-blue-600 rounded"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium text-slate-700 cursor-pointer select-none"
              >
                I have read and understood the instructions.
              </label>
            </div>
            <Button
              onClick={startExam}
              disabled={!isChecked}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              I am ready to begin
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (examStatus === 'ended' && result) {
    return (
      <Scorecard
        score={result.score}
        totalQuestions={result.totalQuestions || 25}
        correct={result.correctAnswers ?? result.correct ?? 0}
        wrong={result.wrongAnswers ?? result.wrong ?? 0}
        skipped={result.skipped}
      />
    )
  }

  const toggleReview = () => {
    if (markedForReview.includes(currentQuestionIndex)) {
      setMarkedForReview((prev) => prev.filter((i) => i !== currentQuestionIndex))
    } else {
      setMarkedForReview((prev) => [...prev, currentQuestionIndex])
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white">
      {/* Header: Fixed TCS Style */}
      <header className="h-14 bg-[#2C3E50] text-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">AI Job Alert Mock Exam</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="font-mono text-xl font-bold">
              <Countdown
                date={Date.now() + 3600000}
                onComplete={handleSubmit}
                renderer={({ hours, minutes, seconds }) => (
                  <span>
                    {hours}:{minutes}:{seconds}
                  </span>
                )}
              />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700">
              <User className="w-5 h-5" />
            </div>
            <span className="text-sm hidden sm:block">Candidate Name</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Question Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Section Tabs */}
          <div className="h-10 bg-slate-100 flex items-center px-2 gap-1 overflow-x-auto border-b border-slate-200 shrink-0">
            {MOCK_SECTIONS.map((section) => (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
                  currentSection === section
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                {section}
                <span className="ml-2 bg-black/20 text-xs px-1.5 rounded-full opacity-70">
                  <Info className="w-3 h-3 inline pb-0.5" />
                </span>
              </button>
            ))}
          </div>

          {/* Question Container */}
          <div className="flex-1 overflow-y-auto p-6 relative">
            <div className="max-w-4xl mx-auto">
              <div className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-start">
                <h2 className="text-xl font-bold text-slate-800">
                  Question No. {currentQuestionIndex + 1}
                </h2>
                <div className="flex gap-2 text-sm text-slate-500 font-medium">
                  <span className="text-green-600">+1.0</span>
                  <span className="text-red-600">-0.25</span>
                </div>
              </div>

              <div className="prose max-w-none mb-8 text-lg text-slate-700">
                <p>{currentQuestion.text}</p>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[currentQuestionIndex] === idx
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        answers[currentQuestionIndex] === idx
                          ? 'border-blue-600'
                          : 'border-slate-400'
                      }`}
                    >
                      {answers[currentQuestionIndex] === idx && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                      )}
                    </div>
                    <span className="text-base font-medium text-slate-800">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="h-16 border-t border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-300" onClick={toggleReview}>
                {markedForReview.includes(currentQuestionIndex)
                  ? 'Unmark Review'
                  : 'Mark for Review'}
              </Button>
              <Button
                variant="outline"
                className="border-slate-300"
                onClick={() =>
                  setAnswers((prev) => {
                    const newAns = { ...prev }
                    delete newAns[currentQuestionIndex]
                    return newAns
                  })
                }
              >
                Clear Response
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                onClick={() => setCurrentQuestionIndex((p) => p + 1)}
              >
                Save & Next
              </Button>
            </div>
          </div>
        </main>

        {/* Right: Palette Sidebar */}
        <aside
          className={`w-80 bg-slate-50 border-l border-slate-200 flex flex-col shrink-0 transition-all ${sidebarOpen ? 'translate-x-0' : 'translate-x-full hidden'}`}
        >
          <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden">
              {/* User Img Placeholder */}
              <User className="w-full h-full p-2 text-slate-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">John Doe</h3>
            </div>
          </div>

          <div className="p-3 bg-sky-50 border-b border-sky-100">
            <h4 className="font-bold text-xs uppercase text-sky-800 tracking-wider mb-2">Legend</h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-green-500 clip-path-polygon" /> Answered
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-red-500" /> Not Answered
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-slate-200" /> Not Visited
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-purple-500 rounded-full" /> Review
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="font-bold text-sm text-slate-700 mb-3 bg-slate-200 px-2 py-1 rounded">
              {currentSection}
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }).map((_, i) => {
                let statusClass = 'bg-slate-200 text-slate-700' // Not Visited
                if (answers[i] !== undefined)
                  statusClass = 'bg-green-500 text-white clip-path-polygon'
                // if (visited) statusClass = 'bg-red-500 text-white'
                if (markedForReview.includes(i))
                  statusClass = 'bg-purple-500 text-white rounded-full'

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`h-10 w-10 flex items-center justify-center text-sm font-bold rounded hover:opacity-80 transition-all ${statusClass} ${currentQuestionIndex === i ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          </div>
        </aside>
      </div>

      {/* Mobile Toggle for Sidebar */}
      <div className="fixed bottom-20 right-4 md:hidden">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          size="icon"
          className="rounded-full shadow-lg h-12 w-12 bg-blue-600"
        >
          <Menu />
        </Button>
      </div>
    </div>
  )
}
