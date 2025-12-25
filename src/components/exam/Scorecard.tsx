import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'

interface ScorecardProps {
  score: number
  totalQuestions: number
  correct: number
  wrong: number
  skipped: number
}

export const Scorecard: React.FC<ScorecardProps> = ({
  score,
  totalQuestions,
  correct,
  wrong,
  skipped,
}) => {
  const accuracy = totalQuestions > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl overflow-hidden">
        <div className="bg-slate-900 text-white p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Test Result</h1>
          <div className="flex justify-center items-end gap-2">
            <span className="text-5xl font-bold text-yellow-400">{score}</span>
            <span className="text-slate-400 mb-1">/ {totalQuestions} Marks</span>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="grid grid-cols-3 gap-6 mb-8 text-center">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700">{correct}</p>
              <p className="text-sm text-green-600 font-medium">Correct</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex justify-center mb-2">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-700">{wrong}</p>
              <p className="text-sm text-red-600 font-medium">Wrong</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-center mb-2">
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-700">{skipped}</p>
              <p className="text-sm text-slate-500 font-medium">Skipped</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span>Accuracy</span>
                <span>{accuracy}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${accuracy}%` }} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="w-full" asChild variant="outline">
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Re-attempt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
