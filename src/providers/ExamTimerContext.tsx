'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ExamTimerContextType {
  timeLeft: number
  totalDuration: number
  currentSection: string
  isPaused: boolean
  startExam: () => void
  pauseExam: () => void
  switchSection: (section: string) => void
  formatTime: (seconds: number) => string
}

const ExamTimerContext = createContext<ExamTimerContextType | undefined>(undefined)

export const ExamTimerProvider = ({
  children,
  durationInMinutes,
  sections,
}: {
  children: React.ReactNode
  durationInMinutes: number
  sections: string[]
}) => {
  // Convert minutes to seconds
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60)
  const [currentSection, setCurrentSection] = useState(sections[0])
  const [isPaused, setIsPaused] = useState(true)

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused])

  const startExam = () => setIsPaused(false)
  const pauseExam = () => setIsPaused(true)

  const switchSection = (section: string) => {
    if (sections.includes(section)) {
      setCurrentSection(section)
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <ExamTimerContext.Provider
      value={{
        timeLeft,
        totalDuration: durationInMinutes * 60,
        currentSection,
        isPaused,
        startExam,
        pauseExam,
        switchSection,
        formatTime,
      }}
    >
      {children}
    </ExamTimerContext.Provider>
  )
}

export const useExamTimer = () => {
  const context = useContext(ExamTimerContext)
  if (!context) throw new Error('useExamTimer must be used within ExamTimerProvider')
  return context
}
