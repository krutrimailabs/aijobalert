import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home, BookOpen, Search, Filter } from 'lucide-react'

// Mock Data Structure matching the user's request
const CATEGORY_MAP: Record<string, { title: string; topics: string[]; color: string }> = {
  'general-aptitude': {
    title: 'General Aptitude',
    topics: [
      'Arithmetic Aptitude',
      'Data Interpretation',
      'Online Aptitude Test',
      'Data Interpretation Test',
    ],
    color: 'text-orange-600',
  },
  'arithmetic-aptitude': {
    title: 'Arithmetic Aptitude',
    topics: [
      'Problems on Trains',
      'Time and Distance',
      'Height and Distance',
      'Time and Work',
      'Simple Interest',
      'Compound Interest',
      'Profit and Loss',
      'Partnership',
      'Percentage',
      'Problems on Ages',
      'Calendar',
      'Clock',
      'Average',
      'Area',
      'Volume and Surface Area',
      'Permutation and Combination',
      'Numbers',
      'Problems on Numbers',
      'Problems on H.C.F and L.C.M',
      'Decimal Fraction',
      'Simplification',
      'Square Root and Cube Root',
      'Surds and Indices',
      'Ratio and Proportion',
      'Chain Rule',
      'Pipes and Cistern',
      'Boats and Streams',
      'Alligation or Mixture',
      'Logarithm',
      'Races and Games',
      'Stocks and Shares',
      'Probability',
      'True Discount',
      "Banker's Discount",
      'Odd Man Out and Series',
    ],
    color: 'text-orange-600',
  },
  'data-interpretation': {
    title: 'Data Interpretation',
    topics: ['Table Charts', 'Pie Charts', 'Bar Charts', 'Line Charts'],
    color: 'text-orange-600',
  },
  'verbal-and-reasoning': {
    title: 'Verbal and Reasoning',
    topics: ['Verbal Ability', 'Logical Reasoning', 'Verbal Reasoning', 'Non Verbal Reasoning'],
    color: 'text-purple-600',
  },
  'current-affairs-gk': {
    title: 'Current Affairs & GK',
    topics: [
      'Current Affairs',
      'Basic General Knowledge',
      'General Science',
      'Inventions',
      'Geography',
      'History',
    ],
    color: 'text-blue-600',
  },
  engineering: {
    title: 'Engineering',
    topics: [
      'Mechanical Engineering',
      'Civil Engineering',
      'ECE',
      'EEE',
      'CSE',
      'Chemical Engineering',
    ],
    color: 'text-cyan-600',
  },
  programming: {
    title: 'Programming',
    topics: ['C Programming', 'C++', 'C#', 'Java', 'Python', 'Database', 'Networking'],
    color: 'text-green-600',
  },
  'technical-mcqs': {
    title: 'Technical MCQs',
    topics: [
      'Networking',
      'Database',
      'Basic Electronics',
      'Digital Electronics',
      'Software Testing',
    ],
    color: 'text-indigo-600',
  },
  'technical-short-answers': {
    title: 'Technical Short Answers',
    topics: ['Software Testing', 'The C Language Basics', 'SQL Server', 'Networking'],
    color: 'text-slate-600',
  },
  'medical-science': {
    title: 'Medical Science',
    topics: ['Microbiology', 'Biochemistry', 'Biotechnology', 'Biochemical Engineering'],
    color: 'text-red-600',
  },
  puzzles: {
    title: 'Puzzles',
    topics: [
      'Sudoku',
      'Number puzzles',
      'Missing letters puzzles',
      'Logical puzzles',
      'Clock puzzles',
    ],
    color: 'text-pink-600',
  },
  interview: {
    title: 'Interview',
    topics: ['Placement Papers', 'HR Interview', 'Group Discussion', 'Technical Interview'],
    color: 'text-yellow-600',
  },
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const categoryKey = category // e.g., 'general-aptitude'
  const categoryData = CATEGORY_MAP[categoryKey] || {
    title: category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()), // Fallback title
    topics: CATEGORY_MAP['general-aptitude'].topics.slice(0, 10), // Fallback topics
    color: 'text-blue-600',
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center text-sm text-slate-500">
          <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/practice" className="hover:text-blue-600">
            Practice Hub
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-slate-900">{categoryData.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col lg:flex-row gap-8">
        {/* Main Content: Topic Grid */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                {categoryData.title}{' '}
                <span className="text-lg font-normal text-slate-500">Questions and Answers</span>
              </h1>
              <div className="hidden sm:flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded text-slate-500">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded text-slate-500">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed">
              Welcome to the {categoryData.title} section. Here you can find objective type{' '}
              {categoryData.title} questions and answers for interview and entrance examination.
              Multiple choice and true or false type questions are also provided.
            </p>

            <h2 className="font-bold text-xl text-slate-800 mb-4 pb-2 border-b border-slate-100">
              List of Topics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {categoryData.topics.map((topic, index) => (
                <Link
                  key={index}
                  href={`/practice/${category}/${topic.toLowerCase().replace(/ /g, '-').replace(/[&+,]/g, '')}`}
                  className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors`}
                  >
                    <BookOpen className={`w-4 h-4 text-slate-500 group-hover:text-blue-600`} />
                  </div>
                  <span className="text-slate-700 font-medium group-hover:text-blue-700 transition-colors">
                    {topic}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
          <div className="bg-blue-600 rounded-xl p-6 text-white text-center shadow-lg transform hover:-translate-y-1 transition-transform cursor-pointer">
            <h3 className="font-bold text-xl mb-2">Online Aptitude Test</h3>
            <p className="text-blue-100 text-sm mb-4">
              Take a timed test to check your speed and accuracy!
            </p>
            <button className="bg-white text-blue-700 px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors">
              Take Test Now
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 border-b pb-2">Category Menu</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between text-blue-600 font-medium">
                <span>Aptitude</span> <ChevronRight className="w-4 h-4" />
              </li>
              <li className="flex items-center justify-between text-slate-600 hover:text-blue-600 cursor-pointer">
                <span>Reasoning</span> <ChevronRight className="w-4 h-4" />
              </li>
              <li className="flex items-center justify-between text-slate-600 hover:text-blue-600 cursor-pointer">
                <span>Verbal Ability</span> <ChevronRight className="w-4 h-4" />
              </li>
              <li className="flex items-center justify-between text-slate-600 hover:text-blue-600 cursor-pointer">
                <span>Programming</span> <ChevronRight className="w-4 h-4" />
              </li>
              <li className="flex items-center justify-between text-slate-600 hover:text-blue-600 cursor-pointer">
                <span>GK & Current Affairs</span> <ChevronRight className="w-4 h-4" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
