import React from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Home,
  BookOpen,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Target,
  Zap,
  BarChart3,
  Star,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react'

// Mock Data Structure with enhanced properties
const CATEGORY_MAP: Record<
  string,
  {
    title: string
    topics: string[]
    color: string
    bgColor: string
    description: string
    questionCount: number
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    popularity: number
  }
> = {
  'general-aptitude': {
    title: 'General Aptitude',
    topics: [
      'Arithmetic Aptitude',
      'Data Interpretation',
      'Online Aptitude Test',
      'Data Interpretation Test',
    ],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Fundamental quantitative and analytical skills assessment',
    questionCount: 1250,
    difficulty: 'Beginner',
    popularity: 95,
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
    bgColor: 'bg-orange-50',
    description: 'Mathematical problem solving and calculations',
    questionCount: 2850,
    difficulty: 'Intermediate',
    popularity: 92,
  },
  'data-interpretation': {
    title: 'Data Interpretation',
    topics: ['Table Charts', 'Pie Charts', 'Bar Charts', 'Line Charts'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Analyzing and interpreting graphical data',
    questionCount: 850,
    difficulty: 'Intermediate',
    popularity: 88,
  },
  'verbal-and-reasoning': {
    title: 'Verbal and Reasoning',
    topics: ['Verbal Ability', 'Logical Reasoning', 'Verbal Reasoning', 'Non Verbal Reasoning'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Language skills and logical thinking',
    questionCount: 2100,
    difficulty: 'Intermediate',
    popularity: 87,
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
    bgColor: 'bg-blue-50',
    description: 'General knowledge and current events',
    questionCount: 3500,
    difficulty: 'Beginner',
    popularity: 82,
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
    bgColor: 'bg-cyan-50',
    description: 'Engineering disciplines and concepts',
    questionCount: 4200,
    difficulty: 'Advanced',
    popularity: 78,
  },
  programming: {
    title: 'Programming',
    topics: ['C Programming', 'C++', 'C#', 'Java', 'Python', 'Database', 'Networking'],
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Coding languages and development skills',
    questionCount: 3800,
    difficulty: 'Advanced',
    popularity: 96,
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
    bgColor: 'bg-indigo-50',
    description: 'Technical multiple choice questions',
    questionCount: 1950,
    difficulty: 'Advanced',
    popularity: 84,
  },
  'technical-short-answers': {
    title: 'Technical Short Answers',
    topics: ['Software Testing', 'The C Language Basics', 'SQL Server', 'Networking'],
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    description: 'Descriptive technical questions',
    questionCount: 1200,
    difficulty: 'Intermediate',
    popularity: 76,
  },
  'medical-science': {
    title: 'Medical Science',
    topics: ['Microbiology', 'Biochemistry', 'Biotechnology', 'Biochemical Engineering'],
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Medical and life sciences concepts',
    questionCount: 1650,
    difficulty: 'Advanced',
    popularity: 71,
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
    bgColor: 'bg-pink-50',
    description: 'Brain teasers and logical puzzles',
    questionCount: 950,
    difficulty: 'Intermediate',
    popularity: 89,
  },
  interview: {
    title: 'Interview',
    topics: ['Placement Papers', 'HR Interview', 'Group Discussion', 'Technical Interview'],
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    description: 'Interview preparation and practice',
    questionCount: 2800,
    difficulty: 'Intermediate',
    popularity: 94,
  },
}

// Difficulty Badge Component
const DifficultyBadge = ({ level }: { level: string }) => {
  const colors = {
    Beginner: 'bg-green-100 text-green-800 border-green-200',
    Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Advanced: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[level as keyof typeof colors]}`}
    >
      {level}
    </span>
  )
}

// Popularity Indicator Component
const PopularityIndicator = ({ percentage }: { percentage: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-slate-700">{percentage}%</span>
    </div>
  )
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const categoryKey = category
  const categoryData = CATEGORY_MAP[categoryKey] || {
    title: category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    topics: CATEGORY_MAP['general-aptitude'].topics.slice(0, 10),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Practice questions and answers for various topics',
    questionCount: 1000,
    difficulty: 'Beginner' as const,
    popularity: 80,
  }

  // Stats for the category
  const stats = [
    {
      icon: BookOpen,
      label: 'Total Questions',
      value: categoryData.questionCount.toLocaleString(),
    },
    { icon: Clock, label: 'Avg. Time/Question', value: '45s' },
    { icon: Target, label: 'Success Rate', value: '78%' },
    { icon: TrendingUp, label: 'Popularity', value: `${categoryData.popularity}%` },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* Enhanced Breadcrumb Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-slate-600">
              <Link
                href="/dashboard"
                className="hover:text-blue-600 flex items-center gap-2 transition-colors group"
              >
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                  <Home className="w-4 h-4" />
                </div>
                <span className="ml-2">Home</span>
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
              <Link
                href="/practice"
                className="hover:text-blue-600 flex items-center gap-2 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="ml-2">Practice Hub</span>
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
              <span className="font-semibold text-slate-900 flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg ${categoryData.bgColor} border ${categoryData.color.replace('text', 'border')}`}
                >
                  <div className={`w-4 h-4 ${categoryData.color}`}>•</div>
                </div>
                {categoryData.title}
              </span>
            </div>
            <Link
              href="/practice"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Categories
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Header with Stats */}
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-slate-900">{categoryData.title}</h1>
                <DifficultyBadge level={categoryData.difficulty} />
              </div>
              <p className="text-slate-600 text-lg max-w-3xl mb-6">
                {categoryData.description}. Practice objective type questions and answers for
                interview and entrance examinations.
              </p>
              <div className="flex flex-wrap gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white/60 rounded-xl p-3 border border-slate-200"
                  >
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-slate-500">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:text-right">
              <div className="inline-flex flex-col items-end gap-3">
                <PopularityIndicator percentage={categoryData.popularity} />
                <span className="text-sm text-slate-500">Community Popularity</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content: Topic Grid */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Enhanced Search and Filter Bar */}
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      List of Topics
                      <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {categoryData.topics.length} topics
                      </span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Click on any topic to start practicing
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search topics..."
                        className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                      />
                    </div>
                    <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 border border-slate-300 transition-colors">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryData.topics.map((topic, index) => (
                    <Link
                      key={index}
                      href={`/practice/${category}/${topic.toLowerCase().replace(/ /g, '-').replace(/[&+,]/g, '')}`}
                      className="group relative overflow-hidden bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-xl ${categoryData.bgColor} group-hover:scale-110 transition-transform duration-300`}
                          >
                            <BookOpen className={`w-6 h-6 ${categoryData.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
                              {topic}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Target className="w-4 h-4" />
                                <span>150 Qs</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-slate-500">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span>4.5</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Tips for {categoryData.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/70 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Quick Practice
                  </h4>
                  <p className="text-sm text-slate-600">
                    Start with easier topics to build confidence before moving to advanced concepts.
                  </p>
                </div>
                <div className="bg-white/70 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-green-500" />
                    Track Progress
                  </h4>
                  <p className="text-sm text-slate-600">
                    Monitor your performance with detailed analytics and improvement suggestions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="w-full lg:w-96 space-y-6 shrink-0">
            {/* Featured Test Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl">Online Assessment</h3>
                </div>
                <p className="text-blue-100 mb-6">
                  Take a timed test to evaluate your speed, accuracy, and overall proficiency.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-sm">Timed environment simulation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-sm">Detailed performance report</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-sm">Comparison with peers</span>
                  </div>
                </div>
                <button className="w-full bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 group-hover:shadow-lg">
                  Take Assessment Now
                </button>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Browse Categories</h3>
                <p className="text-slate-500 text-sm">Jump to related practice areas</p>
              </div>
              <div className="p-4">
                {Object.entries(CATEGORY_MAP)
                  .slice(0, 6)
                  .map(([key, cat]) => (
                    <Link
                      key={key}
                      href={`/practice/${key}`}
                      className={`flex items-center justify-between p-3 rounded-xl mb-2 transition-all hover:scale-[1.02] ${categoryKey === key ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${cat.bgColor}`}>
                          <div className={`w-4 h-4 ${cat.color}`}>•</div>
                        </div>
                        <span
                          className={`font-medium ${categoryKey === key ? 'text-blue-700' : 'text-slate-700'}`}
                        >
                          {cat.title}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 ${categoryKey === key ? 'text-blue-600' : 'text-slate-400'}`}
                      />
                    </Link>
                  ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Topics Completed</span>
                    <span>3/12</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                      style={{ width: '25%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Accuracy Rate</span>
                    <span>82%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                      style={{ width: '82%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Time Spent</span>
                    <span>14h 30m</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"
                      style={{ width: '65%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
