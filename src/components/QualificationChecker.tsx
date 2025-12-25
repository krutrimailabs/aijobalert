'use client'

import React from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react'
import type { Job } from '@/payload-types'
import Link from 'next/link'

interface QualificationCheckerProps {
  job: Job
}

export const QualificationChecker: React.FC<QualificationCheckerProps> = ({ job }) => {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return (
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-slate-400" />
            <div>
              <p className="font-semibold text-slate-700">Login to check eligibility</p>
              <p className="text-sm text-slate-500">
                Sign in to instantly see if you qualify for this job.
              </p>
            </div>
            <Link
              href="/login"
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // --- Logic Helpers ---

  // 1. Age Check
  const calculateAge = (dobString: string) => {
    const dob = new Date(dobString)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const m = today.getMonth() - dob.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    return age
  }

  let ageStatus: 'pass' | 'fail' | 'warn' = 'warn'
  let ageMessage = 'Age criteria not specified'
  const userAge = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null

  if ((job.minimumAge || job.maximumAge) && userAge !== null) {
    const minRequired = job.minimumAge || 0
    const maxRequired = job.maximumAge || 100

    if (userAge >= minRequired && userAge <= maxRequired) {
      ageStatus = 'pass'
      ageMessage = `You are ${userAge} years old (Required: ${minRequired}-${maxRequired})`
    } else {
      ageStatus = 'fail'
      ageMessage = `You are ${userAge} years old (Required: ${minRequired}-${maxRequired})`
    }
  } else if (!user.dateOfBirth) {
    ageStatus = 'warn'
    ageMessage = 'Update your DOB in profile to check'
  }

  // 2. Education Check
  let eduStatus: 'pass' | 'fail' | 'warn' = 'warn'
  let eduMessage = 'Qualification not specified'

  if (job.education && job.education.length > 0 && user.qualification) {
    // Cast to unknown first to avoid TS error, as user.qualification string might not strictly match enum
    const userQual = user.qualification as unknown as string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasMatch = (job.education as any[]).includes(userQual)

    if (hasMatch) {
      eduStatus = 'pass'
      eduMessage = `Your qualification (${user.qualification}) matches`
    } else {
      eduStatus = 'fail'
      eduMessage = `Requires one of: ${job.education.join(', ')} (You have: ${user.qualification})`
    }
  } else if (!user.qualification) {
    eduStatus = 'warn'
    eduMessage = 'Add qualification to profile to check'
  }

  // 3. State Check
  let stateStatus: 'pass' | 'fail' | 'warn' = 'pass' // Default pass for All India
  let stateMessage = 'Eligible for this location'

  // Use 'AI' code from payload-types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAllIndia = (job.state as any) === 'AI'

  if (!isAllIndia && job.state && user.preferredStates && user.preferredStates.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isPreferred = (user.preferredStates as any[]).includes(job.state as any)
    if (isPreferred) {
      stateStatus = 'pass'
      stateMessage = `Job is in your preferred state: ${job.state}`
    } else {
      stateStatus = 'warn'
      stateMessage = `Job is in ${job.state} (Not in your preferences)`
    }
  }

  // Aggregated Status
  const isEligible = ageStatus !== 'fail' && eduStatus !== 'fail'

  return (
    <Card className="border-l-4 border-l-blue-600 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Eligibility Check</span>
          {isEligible ? (
            <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Likely Eligible
            </span>
          ) : (
            <span className="text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded flex items-center gap-1">
              <XCircle className="w-4 h-4" /> Not Eligible
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Age Indicator */}
        <div className="flex items-start gap-3">
          <StatusIcon status={ageStatus} />
          <div>
            <p className="text-sm font-medium text-slate-900">Age Criteria</p>
            <p className="text-xs text-slate-500">{ageMessage}</p>
          </div>
        </div>

        {/* Education Indicator */}
        <div className="flex items-start gap-3">
          <StatusIcon status={eduStatus} />
          <div>
            <p className="text-sm font-medium text-slate-900">Qualification</p>
            <p className="text-xs text-slate-500">{eduMessage}</p>
          </div>
        </div>

        {/* State Indicator */}
        <div className="flex items-start gap-3">
          <StatusIcon status={stateStatus} />
          <div>
            <p className="text-sm font-medium text-slate-900">Location</p>
            <p className="text-xs text-slate-500">{stateMessage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusIcon({ status }: { status: 'pass' | 'fail' | 'warn' }) {
  if (status === 'pass') return <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
  if (status === 'fail') return <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
  return <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
}
