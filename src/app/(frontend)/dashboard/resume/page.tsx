'use client'

import { useAuthStore } from '@/stores/authStore'
import { ResumeTemplate } from '@/components/resume/ResumeTemplate'
import { Button } from '@/components/ui/button'
import { Printer, Loader2 } from 'lucide-react'
import { User } from '@/payload-types'

export default function ResumePage() {
  const { user } = useAuthStore()

  const handlePrint = () => {
    window.print()
  }

  // Fallback to authStore user
  const displayUser = user as unknown as User

  if (!displayUser) return <Loader2 className="animate-spin w-8 h-8 mx-auto mt-10" />

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Resume Builder</h1>
          <p className="text-slate-500">
            ATS-friendly template based on your profile. Update your profile to change details.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="flex justify-center bg-slate-100 p-4 md:p-8 rounded-xl print:p-0 print:bg-white">
        <div className="print:w-full">
          <ResumeTemplate user={displayUser} />
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-content,
          #resume-content * {
            visibility: visible;
          }
          #resume-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          nav,
          header,
          footer,
          .sidebar {
            display: none !important;
          }
        }
      `}</style>

      {/* Wrapper with ID for print targeting */}
      <div id="resume-content" className="hidden print:block">
        <ResumeTemplate user={displayUser} />
      </div>
    </div>
  )
}
