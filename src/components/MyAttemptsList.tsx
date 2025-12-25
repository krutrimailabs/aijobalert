'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ChevronRight, BarChart } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'

// Mock Data for MVP - In real app, fetch from /api/test-attempts
const MOCK_ATTEMPTS = [
  {
    id: 1,
    testName: 'General Aptitude Mock Test 1',
    score: 18,
    totalMarks: 25,
    percentage: 72,
    date: '2025-08-20',
    status: 'Completed',
    timeTaken: '12m 30s',
  },
  {
    id: 2,
    testName: 'SSC CGL Previous Year Quant',
    score: 35,
    totalMarks: 50,
    percentage: 70,
    date: '2025-08-18',
    status: 'Completed',
    timeTaken: '22m 10s',
  },
  {
    id: 3,
    testName: 'Reasoning Ability Practice Set',
    score: 0,
    totalMarks: 20,
    percentage: 0,
    date: '2025-08-25',
    status: 'In Progress',
    timeTaken: '--',
  },
]

export function MyAttemptsList() {
  const [attempts] = useState(MOCK_ATTEMPTS)
  const [isLoading] = useState(false)

  // TODO: Fetch real attempts
  // useEffect(() => {
  //  if(user) fetchAttempts()
  // }, [user])

  if (isLoading) {
    return <div className="text-center py-8">Loading your progress...</div>
  }

  if (attempts.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
        <BarChart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-900">No Tests Attempted Yet</h3>
        <p className="text-slate-500 mb-6">Start practicing to track your performance!</p>
        <Link href="/practice">
          <Button>Go to Practice Hub</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {attempts.map((attempt) => (
        <div
          key={attempt.id}
          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                attempt.percentage >= 70
                  ? 'bg-green-100 text-green-700'
                  : attempt.percentage >= 40
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {attempt.percentage}%
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{attempt.testName}</h4>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {attempt.date}
                </span>
                <span>•</span>
                <span>
                  Score: {attempt.score}/{attempt.totalMarks}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {attempt.status === 'Completed' ? (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                Completed
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                In Progress
              </Badge>
            )}
            <Button variant="ghost" size="icon">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
