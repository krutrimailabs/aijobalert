import { getPayload } from 'payload'
import config from '@/payload.config'

// Define a type for your Job
interface Job {
  id: string
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  aiSummary?: string
  applyLink: string
  state?: string
  education?: string[]
}

export default async function Home() {
  const payload = await getPayload({ config })
  
  // Type the response properly
  const { docs } = await payload.find({
    collection: 'jobs',
    limit: 10,
    sort: '-createdAt',
  })
  
  // Cast to Job type
  const jobs = docs as unknown as Job[]
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Job Alert - Government Jobs Simplified
          </h1>
          <p className="text-gray-600 mt-2">
            Latest government job notifications with AI-powered summaries
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {job.recruitmentBoard}
                  </span>
                  <h3 className="text-xl font-bold mt-2">{job.postName}</h3>
                  {job.totalVacancies && (
                    <p className="text-gray-600 mt-1">
                      Vacancies: <strong>{job.totalVacancies}</strong>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-red-500 font-medium">
                    ⏰ Ends: {new Date(job.lastDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {job.aiSummary && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">AI Summary</h4>
                  <p className="text-gray-600">{job.aiSummary}</p>
                </div>
              )}
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-3">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    💾 Save
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    📊 Check Eligibility
                  </button>
                </div>
                <a 
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}