'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { Menu, X, Search, FileText } from 'lucide-react'

// Updated Navigation Items for "Sarkari Portal" style
const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Latest Jobs', href: '/jobs' },
  { label: 'Result', href: '/jobs?status=result' },
  { label: 'Admit Card', href: '/jobs?status=admit_card' },
  { label: 'Answer Key', href: '/jobs?status=answer_key' },
  { label: 'Syllabus', href: '/jobs?status=syllabus' },
  { label: 'Contact Us', href: '#' },
]

export const HeaderClient: React.FC<{ headerPromise: Promise<unknown> }> = ({ headerPromise }) => {
  const _header = React.use(headerPromise)
  const [isOpen, setIsOpen] = useState(false)

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
              <form action="/jobs" method="get" className="relative">
                <input
                  name="q"
                  type="text"
                  placeholder="Type to search jobs..."
                  className="w-full pl-4 pr-10 py-2 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
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
            <ul className="flex items-center justify-center text-sm font-bold whitespace-nowrap">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block px-6 py-3 hover:bg-blue-900 transition-colors uppercase tracking-wide"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <form action="/jobs" method="get" className="relative">
                <input
                  name="q"
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
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
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-3 text-slate-800 font-semibold border-b border-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
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
