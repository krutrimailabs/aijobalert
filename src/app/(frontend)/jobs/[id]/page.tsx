import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { ArrowLeft, Calendar, MapPin, Briefcase, CheckCircle, Clock, Globe } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export const dynamic = 'force-dynamic'

interface Job {
  id: string
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  postDate: string
  state?: string
  salaryStipend?: string
  aiSummary?: string
  eligibilityDetails?: SerializedEditorState
  applyLink: string
  officialNotification?: {
    url: string
    filename: string
  }
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const payload = await getPayload({ config })
  
  let job: Job | null = null

  try {
    const { docs } = await payload.find({
      collection: 'jobs',
      where: {
        id: {
          equals: id,
        },
      },
      limit: 1,
    })
    job = docs[0] as unknown as Job
  } catch (error) {
    console.error('Error fetching job:', error)
  }

  if (!job) {
    return notFound()
  }

  // Parse CoVe AI Summary if structured
  // The AI output is plain text, so we'll display it in a nice container.
  // We can try to format headers if they exist in the text.
  
  return (
     <div className="min-h-screen bg-slate-50 pb-20">
        {/* Navigation / Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
           <div className="container mx-auto px-4 h-16 flex items-center">
              <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium">
                 <ArrowLeft className="w-5 h-5 mr-2" />
                 Back to Jobs
              </Link>
           </div>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-5xl">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Content Column */}
              <div className="lg:col-span-2 space-y-8">
                 
                 {/* Header Card */}
                 <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <div className="flex flex-wrap gap-2 mb-4">
                       <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {job.recruitmentBoard}
                       </span>
                       {job.state && (
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                             <MapPin className="w-3 h-3 mr-1" /> {job.state}
                          </span>
                       )}
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                       {job.postName}
                    </h1>
                    
                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-slate-600 text-sm md:text-base">
                       <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                          <span>Vacancies: <strong>{job.totalVacancies || 'NA'}</strong></span>
                       </div>
                       <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                          <span>Posted: {new Date(job.postDate).toLocaleDateString()}</span>
                       </div>
                       <div className="flex items-center text-red-600 font-medium">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Deadine: {new Date(job.lastDate).toLocaleDateString()}</span>
                       </div>
                    </div>
                 </div>

                 {/* AI Intelligence / CoVe Summary Section */}
                 {job.aiSummary && (
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 md:p-8 border border-indigo-100 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Briefcase className="w-32 h-32 text-indigo-900" />
                       </div>
                       
                       <div className="relative z-10">
                          <div className="flex items-center mb-6">
                             <div className="bg-indigo-600 text-white p-2 rounded-lg mr-4 shadow-lg shadow-indigo-500/30">
                                <Globe className="w-6 h-6" />
                             </div>
                             <div>
                                <h3 className="text-xl font-bold text-indigo-900">AI Smart Summary</h3>
                                <p className="text-indigo-600 text-sm">Verified by Chain-of-Verification (CoVe)</p>
                             </div>
                          </div>
                          
                          <div className="prose prose-indigo max-w-none text-slate-700 bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-100/50">
                             <div className="whitespace-pre-wrap leading-relaxed font-medium">
                                {job.aiSummary}
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* Detailed Eligibility / Rich Text */}
                 <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">
                       Full Eligibility & Details
                    </h3>
                    <div className="prose max-w-none text-slate-600">
                       {job.eligibilityDetails && <RichText data={job.eligibilityDetails} />}
                       {!job.eligibilityDetails && <p>No detailed description provided.</p>}
                    </div>
                 </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                 {/* Action Card */}
                 <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 sticky top-24">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                    
                    <Link 
                       href={job.applyLink || '#'} 
                       target="_blank"
                       className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 mb-3"
                    >
                       Apply Online
                    </Link>
                    
                    {job.officialNotification && (
                       <Link 
                          href={job.officialNotification.url} 
                          target="_blank"
                          className="flex items-center justify-center w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors mb-3"
                       >
                          Download Notification
                       </Link>
                    )}

                    <div className="pt-4 border-t border-slate-100">
                       <p className="text-xs text-center text-slate-400">
                          Last checked: Today
                       </p>
                    </div>
                 </div>

                 {/* Unified Timeline / Lifecycle (Competitive Strategy) */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Job Timeline</h3>
                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                       
                       {/* Step 1: Notification */}
                       <div className="relative pl-8">
                          <div className="absolute left-0 top-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center ring-4 ring-white">
                             <CheckCircle className="w-3 h-3 text-green-600" />
                          </div>
                          <p className="text-sm font-semibold text-slate-900">Notification Released</p>
                          <p className="text-xs text-slate-500">{new Date(job.postDate).toLocaleDateString()}</p>
                       </div>

                       {/* Step 2: Application Ends */}
                       <div className={`relative pl-8 ${new Date(job.lastDate) < new Date() ? '' : 'opacity-60'}`}>
                          <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${new Date(job.lastDate) < new Date() ? 'bg-green-100' : 'bg-slate-100'}`}>
                             {new Date(job.lastDate) < new Date() ? <CheckCircle className="w-3 h-3 text-green-600" /> : <div className="w-2 h-2 bg-slate-300 rounded-full" />}
                          </div>
                          <p className="text-sm font-semibold text-slate-900">Application Ends</p>
                          <p className="text-xs text-slate-500">{new Date(job.lastDate).toLocaleDateString()}</p>
                       </div>

                       {/* Step 3: Admit Card (Placeholder) */}
                       <div className="relative pl-8 opacity-40">
                          <div className="absolute left-0 top-1 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center ring-4 ring-white">
                             <div className="w-2 h-2 bg-slate-300 rounded-full" />
                          </div>
                          <p className="text-sm font-semibold text-slate-900">Admit Card</p>
                          <p className="text-xs text-slate-500">Wait for update</p>
                       </div>

                       {/* Step 4: Result (Placeholder) */}
                       <div className="relative pl-8 opacity-40">
                          <div className="absolute left-0 top-1 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center ring-4 ring-white">
                             <div className="w-2 h-2 bg-slate-300 rounded-full" />
                          </div>
                          <p className="text-sm font-semibold text-slate-900">Result</p>
                          <p className="text-xs text-slate-500">Wait for update</p>
                       </div>

                    </div>
                 </div>
              </div>
           </div>
        </main>
     </div>
  )
}
