import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SyllabusExplorer, SyllabusDoc } from '@/components/syllabus/SyllabusExplorer'
import { FileText } from 'lucide-react'

// Force dynamic because we might want fresh data, though standard revalidation is also fine.
// Using force-dynamic for simplicity in dev/demo.
export const dynamic = 'force-dynamic'

export default async function SyllabusPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'syllabus',
    depth: 1,
    limit: 100, // Fetch ample amount
    sort: '-updatedAt',
  })

  // Cast to our component type
  const syllabusData = docs as unknown as SyllabusDoc[]

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Syllabus Explorer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Detailed breakdown of exam subjects, topics, and sub-topics. Know exactly what to study
            for your next government exam.
          </p>
        </div>

        <SyllabusExplorer initialSyllabus={syllabusData} />
      </div>
    </div>
  )
}
