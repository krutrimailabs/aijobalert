import Link from 'next/link'
import {
  Calculator,
  Code,
  Users,
  Globe,
  Database,
  Cpu,
  Brain,
  Activity,
  Terminal,
  Puzzle,
} from 'lucide-react'

// Mock Data representing the major categories requested
const PRACTICE_CATEGORIES = [
  {
    title: 'General Aptitude',
    icon: Calculator,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    topics: [
      'Arithmetic Aptitude',
      'Data Interpretation',
      'Online Aptitude Test',
      'Data Interpretation Test',
    ],
  },
  {
    title: 'Verbal and Reasoning',
    icon: Brain,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    topics: ['Verbal Ability', 'Logical Reasoning', 'Verbal Reasoning', 'Non Verbal Reasoning'],
  },
  {
    title: 'Current Affairs & GK',
    icon: Globe,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    topics: ['Current Affairs', 'Basic General Knowledge', 'General Science'],
  },
  {
    title: 'Engineering',
    icon: Cpu,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    topics: [
      'Mechanical Engineering',
      'Civil Engineering',
      'ECE',
      'EEE',
      'CSE',
      'Chemical Engineering',
    ],
  },
  {
    title: 'Programming',
    icon: Code,
    color: 'text-green-600',
    bg: 'bg-green-50',
    topics: ['C Programming', 'C++', 'C#', 'Java', 'Python', 'React'],
  },
  {
    title: 'Technical MCQs',
    icon: Database,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    topics: ['Networking', 'Database', 'Basic Electronics', 'Digital Electronics'],
  },
  {
    title: 'Technical Short Answers',
    icon: Terminal,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    topics: ['Software Testing', 'The C Language Basics', 'SQL Server', 'Networking'],
  },
  {
    title: 'Medical Science',
    icon: Activity,
    color: 'text-red-600',
    bg: 'bg-red-50',
    topics: ['Microbiology', 'Biochemistry', 'Biotechnology', 'Biochemical Engineering'],
  },
  {
    title: 'Interview',
    icon: Users,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    topics: ['Placement Papers', 'HR Interview', 'Group Discussion', 'Technical Interview'],
  },
  {
    title: 'Puzzles',
    icon: Puzzle,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    topics: [
      'Sudoku',
      'Number puzzles',
      'Missing letters puzzles',
      'Logical puzzles',
      'Clock puzzles',
    ],
  },
]

export default function PracticeHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Practice & Prep Hub</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Aptitude questions and answers for your placement interviews and competitive exams!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRACTICE_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                href={`/practice/${category.title.toLowerCase().replace(/ /g, '-').replace(/[&+,]/g, '')}`}
                className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.bg}`}
                >
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h2 className="font-bold text-xl text-slate-800">{category.title}</h2>
              </Link>

              <ul className="space-y-3">
                {category.topics.map((topic) => {
                  // Special handling for nested categories like Arithmetic Aptitude being treated as top-level routes
                  const isGeneralAptitude = category.title === 'General Aptitude'
                  const slug = topic.toLowerCase().replace(/ /g, '-').replace(/[&+,]/g, '')
                  // If it is General Aptitude, links go to /practice/arithmetic-aptitude (Category Page)
                  // Else, links go to /practice/programming/java (Topic Page)
                  const href = isGeneralAptitude
                    ? `/practice/${slug}`
                    : `/practice/${category.title.toLowerCase().replace(/ /g, '-').replace(/[&+,]/g, '')}/${slug}`

                  return (
                    <li key={topic}>
                      <Link
                        href={href}
                        className="text-slate-600 hover:text-blue-600 hover:translate-x-1 transition-all flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-blue-600 transition-colors" />
                        {topic}
                      </Link>
                    </li>
                  )
                })}
                <li className="pt-2">
                  <Link
                    href={`/practice/${category.title.toLowerCase().replace(/ /g, '-').replace(/[&+,]/g, '')}`}
                    className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wider"
                  >
                    View All Topics
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
