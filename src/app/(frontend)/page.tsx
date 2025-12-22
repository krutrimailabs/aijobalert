import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { INDIAN_STATES, JOB_CATEGORIES, EDUCATION_LEVELS } from '../../lib/constants'

// Define Job interface manually since we don't have the generated types imported here easily
interface Job {
  id: string
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate?: string
  status?: string
  updatedAt: string
  slug?: string
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Initialize empty data
  let jobNotifications: Job[] = []
  let admitCards: Job[] = []
  let results: Job[] = []
  let answerKeys: Job[] = []
  let syllabus: Job[] = []
  let eduNotifications: Job[] = []
  let latestUpdates: Job[] = []

  try {
    const payload = await getPayload({ config })

    // Helper to fetch jobs by status
    const fetchJobs = async (status: string, limit: number = 20) => {
      try {
        const { docs } = await payload.find({
          collection: 'jobs',
          limit,
          sort: '-updatedAt',
          where: {
            status: { equals: status }
          }
        })
        return docs as unknown as Job[]
      } catch (error) {
        console.error(`Error fetching jobs for status ${status}:`, error)
        return []
      }
    }

    // Parallel data fetching for all sections
    ;[
      jobNotifications,
      admitCards,
      results,
      answerKeys,
      syllabus,
      eduNotifications,
      latestUpdates
    ] = await Promise.all([
      fetchJobs('open'),
      fetchJobs('admit_card'),
      fetchJobs('result'),
      fetchJobs('answer_key'),
      fetchJobs('syllabus'),
      fetchJobs('edu_notification'),
      // Fetch generic "New Updates" - essentially anything recently updated across categories
      payload.find({
        collection: 'jobs',
        limit: 15,
        sort: '-updatedAt',
      }).then(res => res.docs as unknown as Job[]).catch(err => {
        console.error('Error fetching latest updates:', err)
        return []
      })
    ])
  } catch (error) {
    console.error('CRITICAL: Failed to initialize Payload or fetch data (DB likely down):', error)
    // Fallback is already empty arrays, so the page will simply render empty.
  }

  // Component for the high-density list sections
  const PortalSection = ({ title, jobs, colorClass }: { title: string, jobs: Job[], colorClass: string }) => (
    <div className="border border-gray-400">
      <div className={`${colorClass} text-white font-bold text-center py-2 text-lg uppercase tracking-wide`}>
        {title}
      </div>
      <ul className="bg-white min-h-[400px]">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <li key={job.id} className="border-b border-gray-300 last:border-0">
               <Link 
                href={`/jobs/${job.id}`} 
                className="block px-2 py-2 text-blue-700 hover:text-red-600 hover:underline text-[13px] font-medium leading-tight"
                title={job.postName}
              >
                • {job.postName}
              </Link>
            </li>
          ))
        ) : (
           <li className="p-4 text-center text-gray-500 text-sm italic">No updates available.</li>
        )}
      </ul>
      <div className="bg-gray-100 p-2 text-right border-t border-gray-300">
        <Link href="/jobs" className="text-xs font-bold text-gray-800 hover:underline uppercase">View All</Link>
      </div>
    </div>
  )

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      
      {/* 1. Top Quick Links (State) */}
      <div className="bg-white border-b border-gray-300 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-2 py-2">
           <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm font-bold">
            {INDIAN_STATES.slice(0, 18).map((state) => (
              <Link 
                key={state.value} 
                href={`/jobs?state=${state.value}`}
                className="text-gray-700 hover:text-red-600 transition-colors uppercase"
              >
                {state.value}
              </Link>
            ))}
             <Link href="/jobs" className="text-red-600">» MORE</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 md:px-4 py-4">

         {/* 2. Marquee "New Updates" */}
         <div className="border-2 border-dashed border-red-500 p-1 mb-6 rounded-md bg-yellow-50">
            <div className="overflow-hidden relative h-8 flex items-center">
               <div className="whitespace-nowrap animate-marquee flex items-center space-x-8">
                 {latestUpdates.map((job, i) => (
                    <Link 
                      key={`${job.id}-${i}`} 
                      href={`/jobs/${job.id}`}
                      className="text-blue-800 hover:text-red-600 font-bold text-sm inline-flex items-center"
                    >
                       <span className="text-red-500 mr-1 animate-pulse">NEW</span> 
                       {job.postName}
                    </Link>
                 ))}
                  {/* Duplicate for infinite loop illusion if needed, or CSS handles it with pure translation */}
               </div>
            </div>
         </div>


        {/* 3. Main 3-Column Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          
          {/* Column 1: Job Notifications */}
          <div>
             <PortalSection 
                title="Job Notifications" 
                jobs={jobNotifications} 
                colorClass="bg-[#8B0000]" // Dark Red
             />
             <div className="mt-4"></div>
             <PortalSection 
                title="Education" 
                jobs={eduNotifications} 
                colorClass="bg-[#2F4F4F]" // Dark Slate Gray
             />
          </div>

           {/* Column 2: Admit Cards */}
           <div>
             <PortalSection 
                title="Admit Cards" 
                jobs={admitCards} 
                colorClass="bg-[#00008B]" // Dark Blue
             />
             <div className="mt-4"></div>
             <PortalSection 
                title="Results" 
                jobs={results} 
                colorClass="bg-[#006400]" // Dark Green
             />
          </div>

           {/* Column 3: Answer Keys / Syllabus */}
           <div>
             <PortalSection 
                title="Answer Keys" 
                jobs={answerKeys} 
                colorClass="bg-[#FF8C00]" // Dark Orange
             />
             <div className="mt-4"></div>
             <PortalSection 
                title="Syllabus" 
                jobs={syllabus} 
                colorClass="bg-[#800080]" // Purple
             />
          </div>

        </div>

        {/* 4. Dense Footer Tables */}
        <div className="mt-8 border border-gray-400">
           <div className="bg-gray-200 p-2 font-bold text-center border-b border-gray-400 text-gray-800 uppercase text-sm">
              Browse by Category
           </div>
           <div className="bg-white p-4">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]">
                  {JOB_CATEGORIES.map(cat => (
                   <Link 
                    key={cat.value} 
                    href={`/jobs?category=${cat.value}`}
                    className="text-blue-700 hover:text-red-500 font-medium hover:underline"
                  >
                    {cat.label}
                  </Link>
                 ))}
              </div>
           </div>
        </div>

         <div className="mt-4 border border-gray-400">
           <div className="bg-gray-200 p-2 font-bold text-center border-b border-gray-400 text-gray-800 uppercase text-sm">
              Jobs by Qualification
           </div>
           <div className="bg-white p-4">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]">
                 {EDUCATION_LEVELS.slice(0, 15).map(edu => (
                   <Link 
                    key={edu.value} 
                    href={`/jobs?education=${edu.value}`}
                    className="text-blue-700 hover:text-red-500 font-medium hover:underline"
                  >
                    {edu.label}
                  </Link>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}