import React from 'react'
import { Calendar, Tag, ChevronRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Mock Data for MVP
const MOCK_AFFAIRS = [
  {
    id: 1,
    title: 'India becomes first country to land on Lunar South Pole',
    date: '2025-08-23',
    summary:
      'The Chandrayaan-3 mission successfully soft-landed near the lunar south pole, making India the fourth country to achieve a lunar landing.',
    category: 'Science & Tech',
    tags: ['Space', 'ISRO'],
  },
  {
    id: 2,
    title: 'RBI Keep Repo Rate Unchanged at 6.5%',
    date: '2025-08-10',
    summary:
      'The Reserve Bank of India Monetary Policy Committee decided to keep the policy repo rate unchanged at 6.5% for the third consecutive time.',
    category: 'Economy',
    tags: ['Banking', 'RBI'],
  },
  {
    id: 3,
    title: 'Union Budget 2025-26 Highlights',
    date: '2025-02-01',
    summary:
      'Key takeaways from the Union Budget presented by the Finance Minister, focusing on infrastructure and digital growth.',
    category: 'National',
    tags: ['Budget', 'Finance'],
  },
]

export default function CurrentAffairsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Daily Current Affairs</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Stay updated with daily happenings for competitive exams. Covering National,
            International, Sports, and Economy.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1">
          <div className="space-y-6">
            {MOCK_AFFAIRS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none"
                  >
                    {item.category}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                  {item.title}
                </h2>

                <p className="text-slate-600 mb-4 leading-relaxed">{item.summary}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" /> {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/current-affairs/${item.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-semibold"
                    >
                      Read Full Article <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline">Load More Updates</Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Browse by Category</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex justify-between hover:text-blue-600 cursor-pointer">
                <span>National News</span>{' '}
                <span className="bg-slate-100 px-2 rounded-full text-xs">12</span>
              </li>
              <li className="flex justify-between hover:text-blue-600 cursor-pointer">
                <span>International</span>{' '}
                <span className="bg-slate-100 px-2 rounded-full text-xs">8</span>
              </li>
              <li className="flex justify-between hover:text-blue-600 cursor-pointer">
                <span>Sports</span>{' '}
                <span className="bg-slate-100 px-2 rounded-full text-xs">5</span>
              </li>
              <li className="flex justify-between hover:text-blue-600 cursor-pointer">
                <span>Economy</span>{' '}
                <span className="bg-slate-100 px-2 rounded-full text-xs">10</span>
              </li>
              <li className="flex justify-between hover:text-blue-600 cursor-pointer">
                <span>Banker&apos;s</span>{' '}
                <span className="bg-slate-100 px-2 rounded-full text-xs">3</span>
              </li>
            </ul>
          </div>

          <div className="bg-indigo-600 rounded-xl p-6 text-white text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <h3 className="font-bold text-lg mb-2">Weekly PDF Capsule</h3>
            <p className="text-indigo-100 text-sm mb-4">
              Download the compiled PDF for this week&apos;s current affairs.
            </p>
            <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50">
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
