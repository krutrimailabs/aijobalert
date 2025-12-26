'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Menu, X, Search, FileText, ChevronDown } from 'lucide-react'
import { JOB_CATEGORIES, EDUCATION_LEVELS, INDIAN_STATES } from '@/lib/constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'

// Navigation structure with dropdowns
interface NavItem {
  label: string
  href?: string
  dropdown?: Array<{ label: string; href: string }>
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Latest Jobs', href: '/jobs' },
  {
    label: 'Practice',
    href: '/practice',
    dropdown: [
      { label: 'All Practice Topics', href: '/practice' },
      { label: 'Mock Tests', href: '/practice/mock-tests' },
      { label: 'Previous Papers', href: '/papers' },
      { label: 'Current Affairs', href: '/current-affairs' },
    ],
  },
  {
    label: 'Community',
    href: '/community',
    dropdown: [
      { label: 'All Discussions', href: '/community' },
      { label: 'New Topic', href: '/community/new' },
    ],
  },
  {
    label: 'Jobs by Category',
    dropdown: JOB_CATEGORIES.map((cat) => ({
      label: cat.label,
      href: `/jobs/category/${cat.value}`,
    })),
  },
  {
    label: 'Jobs by Qualification',
    dropdown: EDUCATION_LEVELS.slice(0, 12).map((edu) => ({
      label: edu.label,
      href: `/jobs/qualification/${edu.value}`,
    })),
  },
  {
    label: 'Jobs by State',
    dropdown: INDIAN_STATES.map((state) => ({
      label: state.label,
      href: `/jobs/state/${state.value}`,
    })),
  },
  { label: 'Result', href: '/results' },
  { label: 'Admit Card', href: '/admit-cards' },
  { label: 'Answer Key', href: '/answer-keys' },
  { label: 'Syllabus', href: '/syllabus' },
  {
    label: 'Dashboard',
    dropdown: [
      { label: 'My Profile', href: '/dashboard/profile' },
      { label: 'My Applications', href: '/dashboard/applications' },
      { label: 'Resume Builder', href: '/dashboard/resume' },
      { label: 'Saved Jobs', href: '/saved-jobs' },
    ],
  },
]

export const HeaderClient: React.FC<{ headerPromise: Promise<unknown> }> = ({ headerPromise }) => {
  const _header = React.use(headerPromise)
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isLoading } = useAuthStore()

  const toggleExpanded = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false) // Close mobile menu if open
    }
  }

  return (
    <>
      <header className="bg-white border-b-4 border-blue-700 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-700 text-white p-2 rounded-lg shadow-md hidden sm:block">
                <FileText className="w-8 h-8" />
              </div>
              <Link href="/">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-blue-800 tracking-tight leading-none">
                    AI JOB ALERT
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium tracking-wide">
                    INDIA&apos;S NO. 1 GOVERNMENT JOB PORTAL Powered by AI
                  </p>
                </div>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  name="q"
                  type="text"
                  placeholder="Type to search jobs..."
                  className="w-full pl-4 pr-10 py-2 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <a
                  href="https://t.me/aijobalert"
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-[#229ED9] hover:bg-[#1d8dbf] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-transform hover:scale-105"
                >
                  Join Telegram
                </a>
              </div>

              {/* Auth Section - Desktop */}
              <div className="hidden lg:block ml-2">
                {!isLoading &&
                  (user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity border-2 border-blue-100">
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                            {(user.name || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/profile" className="cursor-pointer">
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/applications" className="cursor-pointer">
                            My Applications
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/saved-jobs" className="cursor-pointer">
                            Saved Jobs
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                          onClick={() => useAuthStore.getState().logout()}
                        >
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    >
                      Login
                    </Link>
                  ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden z-50 p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar (Desktop) */}
        <nav className="hidden lg:block bg-blue-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-2">
            <ul className="flex items-center justify-start text-xs font-bold whitespace-nowrap">
              {NAV_ITEMS.filter((item) => item.label !== 'Dashboard').map((item) => (
                <li key={item.label} className="relative group">
                  {item.dropdown ? (
                    <>
                      <button className="flex items-center gap-1 px-3 py-3 hover:bg-blue-900 transition-colors uppercase tracking-wide">
                        {item.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {/* Dropdown Menu */}
                      <div className="absolute left-0 top-full hidden group-hover:block bg-white text-gray-800 shadow-xl rounded-b-lg min-w-[220px] max-h-[400px] overflow-y-auto z-50">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm font-medium border-b border-gray-100 last:border-b-0"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      className="block px-3 py-3 hover:bg-blue-900 transition-colors uppercase tracking-wide"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Mobile Auth Section */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                {!isLoading &&
                  (user ? (
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{(user.name || 'U').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => useAuthStore.getState().logout()}
                        className="text-xs text-red-600 font-medium px-2 py-1 border border-red-200 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="w-full text-center bg-blue-600 text-white py-2 rounded-lg font-semibold"
                    >
                      Login / Sign Up
                    </Link>
                  ))}
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  name="q"
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-3 rounded-md"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <nav className="flex flex-col space-y-1">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <>
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 text-slate-800 font-semibold border-b border-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => toggleExpanded(item.label)}
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedMenu === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {expandedMenu === item.label && (
                          <div className="bg-gray-50 pl-4">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="block px-4 py-2 text-sm text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors border-b border-gray-100"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href!}
                        className="block px-4 py-3 text-slate-800 font-semibold border-b border-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                <a
                  href="https://t.me/aijobalert"
                  target="_blank"
                  className="block px-4 py-3 text-[#229ED9] font-bold border-b border-gray-50 hover:bg-blue-50 transition-colors"
                >
                  Join Telegram Channel
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
