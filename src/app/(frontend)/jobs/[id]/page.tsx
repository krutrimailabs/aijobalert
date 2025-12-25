import { getPayload } from 'payload'
import config from '@/payload.config'
import { generateJobPostingSchema } from '@/utilities/schemaGenerator'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  CheckCircle,
  Globe,
  Users,
  IndianRupee,
  FileText,
  AlertCircle,
  ExternalLink,
  Download,
} from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PreviousPaper } from '@/payload-types'
import { QualificationWidget } from '@/components/QualificationWidget'

// cleaned up unused import

import type { Job } from '@/payload-types'
import { QualificationChecker } from '@/components/QualificationChecker'
import { SalaryCalculator } from '@/components/SalaryCalculator'

export const dynamic = 'force-dynamic'

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

  // Fetch related jobs
  const { docs: relatedJobs } = await payload.find({
    collection: 'jobs',
    where: {
      and: [
        {
          id: {
            not_equals: id,
          },
        },
        {
          or: [
            { category: { in: job.category || [] } },
            { state: { equals: job.state } },
            { education: { in: job.education || [] } },
          ],
        },
      ],
    },
    limit: 4,
  })

  interface RelatedJob {
    id: string | number
    postName: string
    recruitmentBoard: string
    totalVacancies?: number
    lastDate?: string
  }

  const isUrgent = new Date(job.lastDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const isNew = new Date(job.postDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const jobSchema = job ? generateJobPostingSchema(job) : null

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {jobSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
        />
      )}
      {/* Navigation / Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link
            href="/jobs"
            className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {job.recruitmentBoard}
                </span>
                {job.state && (
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> {job.state}
                  </span>
                )}
                {isNew && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    NEW
                  </span>
                )}
                {isUrgent && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                    URGENT
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                {job.postName}
              </h1>

              {/* Quick Facts Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Vacancies</div>
                  <div className="text-lg font-bold text-slate-900">
                    {job.totalVacancies?.toLocaleString() || 'NA'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Last Date</div>
                  <div className="text-lg font-bold text-red-600">
                    {new Date(job.lastDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                {job.minimumAge && job.maximumAge && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Age Limit</div>
                    <div className="text-lg font-bold text-slate-900">
                      {job.minimumAge}-{job.maximumAge} yrs
                    </div>
                  </div>
                )}
                {job.salaryStipend && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Salary</div>
                    <div className="text-sm font-bold text-slate-900 line-clamp-2">
                      {job.salaryStipend}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Intelligence / CoVe Summary Section */}
            {job.aiSummary && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 md:p-8 border border-indigo-100 shadow-sm relative overflow-hidden">
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
                      <p className="text-indigo-600 text-sm">
                        Verified by Chain-of-Verification (CoVe)
                      </p>
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

            {/* Important Dates */}
            {(job.postDate ||
              job.applicationStartDate ||
              job.lastDate ||
              job.examDate ||
              job.admitCardDate ||
              job.resultDate) && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                  Important Dates
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                          Event
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {job.postDate && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">
                            Notification Released
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(job.postDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      )}
                      {job.applicationStartDate && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">
                            Application Start Date
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(job.applicationStartDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      )}
                      <tr className="bg-red-50">
                        <td className="px-4 py-3 text-sm font-bold text-red-700">
                          Application Last Date
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-red-700">
                          {new Date(job.lastDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                      {job.examDate && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">
                            Exam Date
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(job.examDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      )}
                      {job.admitCardDate && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">
                            Admit Card Release
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(job.admitCardDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      )}
                      {job.resultDate && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">
                            Result Declaration
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(job.resultDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Vacancy Breakdown */}
            {(job.totalVacancies || job.vacancyBreakdown || job.reservationDetails) && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  Vacancy Details
                </h2>
                {job.totalVacancies && (
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg mb-4">
                    <div className="text-sm font-medium">Total Posts</div>
                    <div className="text-3xl font-bold">
                      {job.totalVacancies.toLocaleString('en-IN')}
                    </div>
                  </div>
                )}
                {job.vacancyBreakdown && (
                  <div className="prose max-w-none mb-4">
                    <RichText data={job.vacancyBreakdown} />
                  </div>
                )}
                {job.reservationDetails && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-bold text-slate-900 mb-2">Reservation</h3>
                    <div className="prose max-w-none text-sm">
                      <RichText data={job.reservationDetails} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Eligibility Criteria */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-blue-600" />
                Eligibility Criteria
              </h2>

              {/* Educational Qualification */}
              {(job.education || job.eligibilityDetails) && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Educational Qualification
                  </h3>
                  {job.education && job.education.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.education.map((edu) => (
                        <span
                          key={edu}
                          className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {edu}
                        </span>
                      ))}
                    </div>
                  )}
                  {job.eligibilityDetails && (
                    <div className="prose max-w-none text-slate-700">
                      <RichText data={job.eligibilityDetails} />
                    </div>
                  )}
                </div>
              )}

              {/* Age Limit */}
              {(job.minimumAge || job.maximumAge || job.ageRelaxation) && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Age Limit</h3>
                  {(job.minimumAge || job.maximumAge) && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-3">
                      <div className="text-2xl font-bold text-blue-900">
                        {job.minimumAge || 18} - {job.maximumAge || 'NA'} Years
                      </div>
                      {job.ageCalculationDate && (
                        <div className="text-sm text-blue-700 mt-1">
                          As on{' '}
                          {new Date(job.ageCalculationDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  {job.ageRelaxation && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Age Relaxation</h4>
                      <div className="prose max-w-none text-sm text-slate-700">
                        <RichText data={job.ageRelaxation} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Physical Standards */}
              {job.physicalStandards && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Physical Standards</h3>
                  <div className="prose max-w-none text-slate-700">
                    <RichText data={job.physicalStandards} />
                  </div>
                </div>
              )}
            </div>

            {/* Application Fee */}
            {(job.feeGeneral ||
              job.feeOBC ||
              job.feeSC ||
              job.feeST ||
              job.feeExemptions ||
              job.applicationFee) && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <IndianRupee className="w-6 h-6 mr-2 text-blue-600" />
                  Application Fee
                </h2>

                {(job.feeGeneral || job.feeOBC || job.feeSC || job.feeST) && (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">
                            Fee
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {job.feeGeneral && (
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">
                              General / UR / OBC (NCL)
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-slate-700">
                              {job.feeGeneral}
                            </td>
                          </tr>
                        )}
                        {job.feeOBC && (
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">OBC</td>
                            <td className="px-4 py-3 text-sm font-bold text-slate-700">
                              {job.feeOBC}
                            </td>
                          </tr>
                        )}
                        {job.feeSC && (
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">SC</td>
                            <td className="px-4 py-3 text-sm font-bold text-slate-700">
                              {job.feeSC}
                            </td>
                          </tr>
                        )}
                        {job.feeST && (
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">ST</td>
                            <td className="px-4 py-3 text-sm font-bold text-slate-700">
                              {job.feeST}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {job.feeExemptions && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Fee Exemptions
                    </h4>
                    <p className="text-sm text-green-800">{job.feeExemptions}</p>
                  </div>
                )}

                {job.paymentModes && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Payment Modes</h4>
                    <p className="text-sm text-blue-800">{job.paymentModes}</p>
                  </div>
                )}

                {job.applicationFee && (
                  <div className="prose max-w-none text-slate-700">
                    <RichText data={job.applicationFee} />
                  </div>
                )}
              </div>
            )}
            {/* Selection Process */}
            {job.selectionProcess && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Selection Process
                </h2>
                <div className="prose max-w-none text-slate-700">
                  <RichText data={job.selectionProcess} />
                </div>
              </div>
            )}

            {/* Previous Year Papers */}
            {job.previousPapers && job.previousPapers.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Previous Year Papers
                </h2>
                <div className="grid gap-4">
                  {job.previousPapers.map((paper: PreviousPaper | string | number) => {
                    if (typeof paper !== 'object') return null
                    return (
                      <div
                        key={paper.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors"
                      >
                        <div>
                          <h3 className="font-bold text-slate-900">{paper.title}</h3>
                          <p className="text-sm text-slate-500">
                            {paper.examName} • {paper.year}
                          </p>
                        </div>
                        <Link
                          href={
                            paper.file && typeof paper.file !== 'number' && paper.file.url
                              ? paper.file.url
                              : '#'
                          }
                          target="_blank"
                          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* How to Apply */}
            {(job.applicationProcess || job.requiredDocuments) && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2 text-blue-600" />
                  How to Apply
                </h2>

                {job.applicationProcess && (
                  <div className="prose max-w-none text-slate-700 mb-6">
                    <RichText data={job.applicationProcess} />
                  </div>
                )}

                {job.requiredDocuments && job.requiredDocuments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Required Documents</h3>
                    <div className="space-y-2">
                      {job.requiredDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                        >
                          <CheckCircle
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              doc.mandatory ? 'text-red-600' : 'text-slate-400'
                            }`}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">
                              {doc.documentName}
                              {doc.mandatory && (
                                <span className="text-red-600 text-xs ml-2">*Mandatory</span>
                              )}
                            </div>
                            {doc.description && (
                              <div className="text-sm text-slate-600 mt-1">{doc.description}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FAQs */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {job.minimumAge && job.maximumAge && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Q: What is the age limit for this recruitment?
                    </h4>
                    <p className="text-slate-700">
                      A: The age limit is {job.minimumAge} to {job.maximumAge} years
                      {job.ageCalculationDate &&
                        ` as on ${new Date(job.ageCalculationDate).toLocaleDateString('en-IN')}`}
                      .
                    </p>
                  </div>
                )}
                {job.feeGeneral && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Q: What is the application fee?
                    </h4>
                    <p className="text-slate-700">
                      A: The application fee is {job.feeGeneral} for General/UR candidates.
                      {job.feeExemptions && ` Exemptions: ${job.feeExemptions}`}
                    </p>
                  </div>
                )}
                {job.requiredDocuments && job.requiredDocuments.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Q: What documents are required to apply?
                    </h4>
                    <p className="text-slate-700">
                      A: You need to upload:{' '}
                      {job.requiredDocuments.map((doc) => doc.documentName).join(', ')}.
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Q: What is the last date to apply?
                  </h4>
                  <p className="text-slate-700">
                    A: The last date to apply is{' '}
                    {new Date(job.lastDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Jobs</h2>
                <div className="grid gap-4">
                  {(relatedJobs as RelatedJob[]).map((relJob) => (
                    <Link
                      key={relJob.id}
                      href={`/jobs/${relJob.id}`}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-2">
                        {relJob.postName}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        <span>{relJob.recruitmentBoard}</span>
                        {relJob.totalVacancies && <span>• {relJob.totalVacancies} Posts</span>}
                        {relJob.lastDate && (
                          <span>
                            • Due:{' '}
                            {new Date(relJob.lastDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <QualificationChecker job={job} />
            <SalaryCalculator salaryString={job.salaryStipend} />

            {/* Action Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>

              <Link
                href={job.applyLink || '#'}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 mb-3"
              >
                <ExternalLink className="w-5 h-5" />
                Apply Online
              </Link>

              {job.officialNotification &&
                typeof job.officialNotification !== 'number' &&
                job.officialNotification.url && (
                  <Link
                    href={job.officialNotification.url}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors mb-3"
                  >
                    <FileText className="w-5 h-5" />
                    Download Notification
                  </Link>
                )}

              {job.importantLinks && job.importantLinks.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-slate-900 mb-3 text-sm">Important Links</h4>
                  <div className="space-y-2">
                    {job.importantLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* AI Prediction Widget */}
            <QualificationWidget jobId={job.id} expectedCutoff={job.expectedCutoff} />

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {/* Notification */}
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center ring-4 ring-white">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Notification Released</p>
                  <p className="text-xs text-slate-500">
                    {new Date(job.postDate).toLocaleDateString('en-IN')}
                  </p>
                </div>

                {/* Application Ends */}
                <div
                  className={`relative pl-8 ${new Date(job.lastDate) < new Date() ? '' : 'opacity-60'}`}
                >
                  <div
                    className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${new Date(job.lastDate) < new Date() ? 'bg-green-100' : 'bg-slate-100'}`}
                  >
                    {new Date(job.lastDate) < new Date() ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <div className="w-2 h-2 bg-slate-300 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Application Deadline</p>
                  <p className="text-xs text-slate-500">
                    {new Date(job.lastDate).toLocaleDateString('en-IN')}
                  </p>
                </div>

                {/* Exam */}
                {job.examDate && (
                  <div className="relative pl-8 opacity-40">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center ring-4 ring-white">
                      <div className="w-2 h-2 bg-slate-300 rounded-full" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Exam Date</p>
                  </div>
                )}

                {/* Result */}
                {job.resultDate ? (
                  <div className="relative pl-8 opacity-40">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center ring-4 ring-white">
                      <div className="w-2 h-2 bg-slate-300 rounded-full" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Result</p>
                    <p className="text-xs text-slate-500">
                      {new Date(job.resultDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                ) : (
                  <div className="relative pl-8 opacity-40">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center ring-4 ring-white">
                      <div className="w-2 h-2 bg-slate-300 rounded-full" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Result</p>
                    <p className="text-xs text-slate-500">TBA</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
