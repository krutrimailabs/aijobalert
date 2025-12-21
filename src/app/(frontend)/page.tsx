import { getPayload } from 'payload'
import config from '@/payload.config'
import { JobCard } from '@/components/JobCard'
import { CategorySection } from '../../components/CategorySection'
import { QuickStats } from '../../components/QuickStats'
import { SearchBar } from '../../components/SearchBar'
import { StateFilter } from '../../components/StateFilter'

interface Job {
  id: string
  postName: string
  recruitmentBoard: string
  totalVacancies?: number
  lastDate: string
  aiSummary?: string
  applyLink: string
  state?: string
  salaryStipend?: string
  category?: string[]
  education?: string[]
  advtNo?: string
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  const payload = await getPayload({ config })
  
  // Fetch latest jobs
  const { docs } = await payload.find({
    collection: 'jobs',
    limit: 20,
    sort: '-createdAt',
    where: {
      status: { equals: 'open' }
    }
  })
  
  const jobs = docs as unknown as Job[]
  
  // Get job counts by category for stats
  const categories = [
    { name: 'Bank Jobs', count: 45, icon: '🏦', slug: 'banking' },
    { name: 'SSC Jobs', count: 32, icon: '📋', slug: 'ssc' },
    { name: 'Railway Jobs', count: 28, icon: '🚂', slug: 'railway' },
    { name: 'Teaching Jobs', count: 56, icon: '👨‍🏫', slug: 'teaching' },
    { name: 'Engineering Jobs', count: 41, icon: '⚙️', slug: 'engineering' },
    { name: 'Police/Defence Jobs', count: 23, icon: '👮', slug: 'police' },
  ]
  
  // Get trending jobs (most viewed/applied)
  const trendingJobs = jobs.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Job Alert
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Government jobs simplified with AI-powered matching
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-xl p-1">
              <SearchBar />
            </div>
            
            {/* Quick Stats */}
            <div className="mt-8">
              <QuickStats />
            </div>
          </div>
        </div>
      </header>

      {/* State-wise Quick Filters */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">QUICK FILTER BY STATE:</h3>
          <StateFilter />
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Categories Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📂</span> Job Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <a
                      key={cat.slug}
                      href={`/jobs?category=${cat.slug}`}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-blue-50 group transition-colors"
                    >
                      <span className="flex items-center">
                        <span className="mr-3 text-lg">{cat.icon}</span>
                        <span className="font-medium text-gray-700 group-hover:text-blue-600">
                          {cat.name}
                        </span>
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                        {cat.count}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Education Level Filter */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🎓 Education Level</h3>
                <div className="space-y-2">
                  {[
                    { label: '10th Pass', count: 156 },
                    { label: '12th Pass', count: 234 },
                    { label: 'Graduate', count: 189 },
                    { label: 'Post Graduate', count: 67 },
                    { label: 'Diploma', count: 89 },
                    { label: 'B.Tech/B.E', count: 56 },
                  ].map((edu) => (
                    <a
                      key={edu.label}
                      href={`/jobs?education=${edu.label.toLowerCase().replace(' ', '_')}`}
                      className="flex justify-between items-center p-2 hover:text-blue-600"
                    >
                      <span className="text-gray-700">{edu.label}</span>
                      <span className="text-sm text-gray-500">({edu.count})</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Trending Jobs Section */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🔥 Trending Jobs</h2>
                <a href="/jobs/trending" className="text-blue-600 hover:text-blue-800 font-medium">
                  View All →
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          TRENDING
                        </span>
                        <h3 className="font-bold text-lg mt-2">{job.postName}</h3>
                        <p className="text-gray-600 text-sm">{job.recruitmentBoard}</p>
                      </div>
                      <span className="text-red-500 text-sm font-semibold bg-red-50 px-3 py-1 rounded-full">
                        ⏰ {new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    {job.aiSummary && (
                      <p className="text-gray-700 mt-3 text-sm line-clamp-2">{job.aiSummary}</p>
                    )}
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-green-600 font-medium">{job.totalVacancies} vacancies</span>
                      <a
                        href={job.applyLink}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Latest Jobs Section */}
            <section className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">📢 Latest Job Notifications</h2>
                <div className="flex space-x-2">
                  <select className="border rounded-lg px-3 py-2 text-sm">
                    <option>Sort by: Newest</option>
                    <option>Sort by: Closing Soon</option>
                    <option>Sort by: Most Vacancies</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard 
                    key={job.id}
                    id={job.id}
                    postName={job.postName}
                    recruitmentBoard={job.recruitmentBoard}
                    totalVacancies={job.totalVacancies}
                    lastDate={job.lastDate}
                    state={job.state}
                    salaryStipend={job.salaryStipend}
                    aiSummary={job.aiSummary}
                    applyLink={job.applyLink}
                    advtNo={job.advtNo}
                  />
                ))}
              </div>

              {jobs.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-lg text-gray-500 mb-2">No active jobs found at the moment.</p>
                  <p className="text-gray-400">Check back soon for new government job notifications.</p>
                </div>
              )}

              {jobs.length > 0 && (
                <div className="mt-8 text-center">
                  <a
                    href="/jobs"
                    className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
                  >
                    View All Job Notifications ({jobs.length}+)
                  </a>
                </div>
              )}
            </section>

            {/* Category-wise Sections */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📁 Jobs by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.slice(0, 4).map((category) => (
                  <CategorySection 
                    key={category.slug}
                    category={category}
                    jobs={jobs.filter(j => j.category?.includes(category.slug)).slice(0, 3)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Stats Banner */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-b border-blue-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">500+</div>
              <div className="text-gray-600 mt-2">Active Job Notifications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">50,000+</div>
              <div className="text-gray-600 mt-2">Monthly Job Seekers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">28</div>
              <div className="text-gray-600 mt-2">Indian States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700">95%</div>
              <div className="text-gray-600 mt-2">AI Match Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Get AI-Powered Job Alerts</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Never miss a government job opportunity. Our AI matches jobs to your profile and sends personalized alerts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
            >
              Create Free Account
            </a>
            <a
              href="/how-it-works"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium border border-gray-700"
            >
              How AI Job Alert Works
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}