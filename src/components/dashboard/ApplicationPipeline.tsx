'use client'

import { CheckCircle2, Circle, XCircle } from 'lucide-react'
import { cn } from '@/utilities/ui'

export type ApplicationStatus =
  | 'applied'
  | 'admit-card-downloaded'
  | 'exam-given'
  | 'result-awaited'
  | 'selected'
  | 'rejected'

interface TimelineStep {
  status: string
  date: string
  note?: string | null
}

interface ApplicationPipelineProps {
  currentStatus: string
  timeline?: TimelineStep[] | null
}

const STEPS = [
  { id: 'applied', label: 'Applied' },
  { id: 'admit-card-downloaded', label: 'Admit Card' },
  { id: 'exam-given', label: 'Exam Done' },
  { id: 'result-awaited', label: 'Result' },
  { id: 'selected', label: 'Selected' },
]

export function ApplicationPipeline({ currentStatus, timeline = [] }: ApplicationPipelineProps) {
  // Determine current step index
  let currentStepIndex = STEPS.findIndex((s) => s.id === currentStatus)
  if (currentStepIndex === -1 && currentStatus === 'rejected') {
    currentStepIndex = STEPS.length // Treat rejected as final but special
  }
  // Fallback for intermediate mapped statuses if needed
  if (currentStatus === 'selected') currentStepIndex = 4

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between w-full">
        {/* Progress Line Background */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-100 -z-10" />

        {/* Active Progress Line */}
        <div
          className={cn(
            'absolute left-0 top-1/2 transform -translate-y-1/2 h-1 transition-all duration-500 -z-10',
            currentStatus === 'rejected' ? 'bg-red-200' : 'bg-green-500',
          )}
          style={{ width: `${Math.min((currentStepIndex / (STEPS.length - 1)) * 100, 100)}%` }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex
          const isCurrent = idx === currentStepIndex
          const isRejected = currentStatus === 'rejected' && idx === currentStepIndex

          // Find specific timeline entry for this step if exists
          const timelineEntry = timeline?.find((t) => t.status === step.id)
          const dateStr = timelineEntry ? new Date(timelineEntry.date).toLocaleDateString() : null

          return (
            <div key={step.id} className="flex flex-col items-center group relative">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-4 transition-colors bg-white z-10',
                  isCompleted
                    ? 'border-green-500 text-green-500'
                    : 'border-slate-200 text-slate-300',
                  isCurrent && 'scale-110 shadow-md',
                  isRejected && 'border-red-500 text-red-500',
                )}
              >
                {isRejected ? (
                  <XCircle className="w-4 h-4 fill-current" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 fill-current" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              <div className="absolute top-10 flex flex-col items-center w-24 text-center">
                <span
                  className={cn(
                    'text-[10px] md:text-xs font-semibold transition-colors',
                    isCompleted ? 'text-slate-900' : 'text-slate-400',
                    isCurrent && 'text-blue-600',
                    isRejected && 'text-red-600',
                  )}
                >
                  {step.label}
                </span>
                {dateStr && <span className="text-[9px] text-slate-500 mt-0.5">{dateStr}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
