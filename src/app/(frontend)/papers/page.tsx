import React from 'react'
import Link from 'next/link'
import { FileText, Download, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// Mock Data for Papers
const MOCK_PAPERS = [
  {
    id: 1,
    title: 'SSC CGL Tier-1 2023 Question Paper (All Shifts)',
    examCategory: 'ssc',
    examName: 'SSC CGL',
    year: 2023,
    size: '12 MB',
    downloadCount: 1540,
  },
  {
    id: 2,
    title: 'IBPS PO Prelims 2023 Memory Based Paper',
    examCategory: 'banking',
    examName: 'IBPS PO',
    year: 2023,
    size: '4.5 MB',
    downloadCount: 890,
  },
  {
    id: 3,
    title: 'UPSC CSE Prelims 2023 - GS Paper 1',
    examCategory: 'upsc',
    examName: 'UPSC CSE',
    year: 2023,
    size: '2.1 MB',
    downloadCount: 3200,
  },
  {
    id: 4,
    title: 'RRB NTPC CBT-2 2022 Official Paper',
    examCategory: 'railway', // Mapping 'defence' or 'state' if needed, mostly 'railway' might fall under 'other' or add to schema
    examName: 'RRB NTPC',
    year: 2022,
    size: '8 MB',
    downloadCount: 4100,
  },
  {
    id: 5,
    title: 'SBI Clerk Mains 2022 Question Paper',
    examCategory: 'banking',
    examName: 'SBI Clerk',
    year: 2022,
    size: '5.2 MB',
    downloadCount: 1200,
  },
  {
    id: 6,
    title: 'CTET July 2023 Paper-1',
    examCategory: 'teaching',
    examName: 'CTET',
    year: 2023,
    size: '3.8 MB',
    downloadCount: 650,
  },
]

const CATEGORIES = [
  { label: 'All Exams', value: 'all' },
  { label: 'SSC', value: 'ssc' },
  { label: 'Banking', value: 'banking' },
  { label: 'UPSC', value: 'upsc' },
  { label: 'Teaching', value: 'teaching' },
  { label: 'Defence', value: 'defence' },
]

export default function PapersHubPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Previous Year Papers</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
            Download official question papers for SSC, Banking, UPSC, and other government exams.
            Practicing previous papers is the key to success!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search by exam name (e.g., SSC CGL, IBPS PO)..."
                className="pl-10 h-12 bg-white/10 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 space-y-6 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Category
                  </label>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                        />
                        <span className="text-slate-600 group-hover:text-blue-600 transition-colors text-sm">
                          {cat.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Year
                  </label>
                  <select className="w-full rounded-md border-slate-300 py-2 text-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>All Years</option>
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                    <option>2021</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2">Need Solutions?</h4>
              <p className="text-sm text-blue-700 mb-4">
                Check out our Practice Hub for detailed solutions and explanations.
              </p>
              <Link href="/practice">
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                >
                  Go to Practice
                </Button>
              </Link>
            </div>
          </div>

          {/* Papers Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Latest Papers</h2>
              <span className="text-sm text-slate-500">Showing {MOCK_PAPERS.length} results</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_PAPERS.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <Badge
                          variant="secondary"
                          className="mb-1 text-[10px] tracking-wide uppercase"
                        >
                          {paper.examCategory}
                        </Badge>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {paper.examName} {paper.year}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-slate-600 text-sm mb-6 line-clamp-2 h-10">{paper.title}</h4>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>{paper.size}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>{paper.downloadCount} downloads</span>
                    </div>
                    <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800">
                      <Download className="w-4 h-4" /> Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination / Load More */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Load More Papers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
