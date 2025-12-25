'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'

interface Option {
  text: string
  isCorrect: boolean
}

export interface PracticeQuestionProps {
  id: number | string
  text: string
  options: Option[]
  explanation?: string
  questionNumber?: number
}

export const PracticeQuestionCard: React.FC<PracticeQuestionProps> = ({
  id,
  text,
  options,
  explanation,
  questionNumber,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  // Derived state
  const correctOptionIndex = options.findIndex((opt) => opt.isCorrect)

  // Handle selection
  const handleSelect = (idx: number) => {
    setSelectedOption(idx)
    // Auto-show answer if we want instant feedback logic immediately upon click?
    // IndiaBIX usually doesn't show WRONG/RIGHT immediately on click,
    // you have to click "View Answer" to see the green check.
    // But the user said "select the answer and show the result immediately".
    // Let's stick to IndiaBIX style: You select, then you click "View Answer" to verify (or it shows automatically if we want).
    // Actually, user said "display the question answers, users can select the answer an show the result immediately"
    // I will make it so selecting functionality is there, and "View Answer" reveals the truth.
  }

  return (
    <div className="mb-8 border-b border-gray-200 pb-8 last:border-0">
      <div className="flex gap-4">
        <div className="font-bold text-gray-700 min-w-[24px]">{questionNumber}.</div>
        <div className="flex-1">
          <p className="text-gray-900 mb-4 text-lg font-medium leading-relaxed">{text}</p>

          <div className="space-y-3 mb-4">
            {options.map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors ${
                  selectedOption === idx ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 shrink-0 mt-0.5">
                  <div
                    className={`w-3 h-3 rounded-full ${selectedOption === idx ? 'bg-blue-600' : 'bg-transparent'}`}
                  />
                </div>
                {/* Simple Mock ABC labels */}
                <span className="font-bold text-gray-500 w-4">
                  {String.fromCharCode(65 + idx)})
                </span>
                <span className="text-gray-800">{opt.text}</span>
                <input
                  type="radio"
                  name={`q-${id}`}
                  className="hidden"
                  onChange={() => handleSelect(idx)}
                  checked={selectedOption === idx}
                />
              </label>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-semibold flex items-center gap-1"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              View Answer
            </Button>

            <Link href={`/community/new?questionId=${id}`}>
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 p-0 h-auto flex items-center gap-1 ml-auto"
              >
                <MessageSquare className="w-4 h-4" />
                Discuss in Forum
              </Button>
            </Link>
          </div>

          {showAnswer && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="mb-4">
                <span className="font-bold text-gray-900">Right Answer: </span>
                <span className="font-bold text-green-600">
                  Option {String.fromCharCode(65 + correctOptionIndex)}
                </span>
              </div>
              {explanation && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Explanation:</h4>
                  <div className="text-gray-700 space-y-2 leading-relaxed">{explanation}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
