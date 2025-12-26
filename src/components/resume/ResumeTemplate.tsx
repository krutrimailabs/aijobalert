'use client'

import { User } from '@/payload-types'
import { forwardRef } from 'react'

interface ResumeTemplateProps {
  user: User
  font?: string
}

export const ResumeTemplate = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ user, font = 'font-sans' }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-[210mm] min-h-[297mm] bg-white p-8 md:p-12 shadow-md mx-auto print:shadow-none print:w-full print:p-0 ${font}`}
        style={{ pageBreakAfter: 'always' }}
      >
        {/* Header */}
        <header className="border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-widest">
            {user.name}
          </h1>
          <div className="mt-2 text-sm text-slate-600 flex flex-wrap gap-4">
            <span>{user.email}</span>
            {/* Add phone/location if available in profile schema later */}
            {user.domicileState && <span>{user.domicileState}</span>}
          </div>
        </header>

        {/* Education */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 uppercase border-b border-slate-300 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-4">
            {user.educationHistory?.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {edu.level} {edu.degree ? `- ${edu.degree}` : ''}
                  </h3>
                  <p className="text-sm text-slate-600">{edu.stream}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{edu.passingYear}</p>
                  <p className="text-xs text-slate-500">
                    {edu.percentage ? `${edu.percentage}%` : ''}
                  </p>
                </div>
              </div>
            ))}
            {(!user.educationHistory || user.educationHistory.length === 0) && (
              <p className="text-sm text-slate-400 italic">No education details added.</p>
            )}
          </div>
        </section>

        {/* Skills - Static for now, strictly speaking we need a skills field in user profile */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 uppercase border-b border-slate-300 pb-1 mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2 text-sm text-slate-700">
            {/* Placeholder until we add skills to User schema */}
            <span className="px-2 py-1 bg-slate-100 rounded">Communication</span>
            <span className="px-2 py-1 bg-slate-100 rounded">Problem Solving</span>
            <p className="text-xs text-slate-400 w-full mt-2 italic">
              (Add Generic Skills or update profile to populate this)
            </p>
          </div>
        </section>

        {/* Category info for Govt Jobs */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 uppercase border-b border-slate-300 pb-1 mb-3">
            Candidate Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <span className="font-semibold block text-slate-900">Category:</span>
              {user.category || 'General'}
            </div>
            <div>
              <span className="font-semibold block text-slate-900">Date of Birth:</span>
              {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
            </div>
            <div>
              <span className="font-semibold block text-slate-900">Gender:</span>
              {user.gender || 'N/A'}
            </div>
            {user.disability?.isEnabled && (
              <div>
                <span className="font-semibold block text-slate-900">PWD:</span>
                Yes ({user.disability.type} - {user.disability.percentage}%)
              </div>
            )}
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Generated via AI Job Alert
        </footer>
      </div>
    )
  },
)

ResumeTemplate.displayName = 'ResumeTemplate'
