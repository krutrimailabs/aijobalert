'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { Logo } from '@/components/Logo/Logo'
import { Menu, X, ChevronDown, Bell } from 'lucide-react'

// Hardcoded navigation structure for immediate utility
const NAV_ITEMS = [
  {
    label: 'By State',
    children: [
      { label: 'Andhra Pradesh', href: '/jobs/state/andhra-pradesh' },
      { label: 'Maharashtra', href: '/jobs/state/maharashtra' },
      { label: 'Delhi', href: '/jobs/state/delhi' },
      { label: 'Uttar Pradesh', href: '/jobs/state/uttar-pradesh' },
      { label: 'Karnataka', href: '/jobs/state/karnataka' },
      { label: 'All States', href: '/jobs/state' },
    ]
  },
  {
    label: 'By Qualification',
    children: [
      { label: '10th Pass', href: '/jobs/qualification/10th' },
      { label: '12th Pass', href: '/jobs/qualification/12th' },
      { label: 'Graduate', href: '/jobs/qualification/graduate' },
      { label: 'B.Tech/B.E', href: '/jobs/qualification/btech' },
      { label: 'Diploma', href: '/jobs/qualification/diploma' },
    ]
  },
  {
    label: 'By Category',
    children: [
      { label: 'Railway', href: '/jobs/category/railway' },
      { label: 'Bank', href: '/jobs/category/bank' },
      { label: 'Police/Defense', href: '/jobs/category/defense' },
      { label: 'SSC', href: '/jobs/category/ssc' },
      { label: 'UPSC', href: '/jobs/category/upsc' },
    ]
  },
]

export const HeaderClient: React.FC<any> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label)
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              AI
           </div>
           <span className="text-xl font-bold text-slate-900 tracking-tight">JobAlert</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
            Latest Jobs
          </Link>
          
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative group">
              <button 
                className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-600 py-4 focus:outline-none"
              >
                {item.label}
                <ChevronDown className="w-4 h-4 opacity-50" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 p-2 z-50">
                {item.children.map((child) => (
                  <Link 
                    key={child.label} 
                    href={child.href}
                    className="block px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <Link href="/about" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <Link href="/admin" className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors">
            Post Job
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden z-50 p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 px-4 pb-8 overflow-y-auto lg:hidden">
           <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-lg font-semibold text-slate-800 py-2 border-b border-slate-100"
                onClick={() => setIsOpen(false)}
              >
                Latest Jobs
              </Link>
              
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="border-b border-slate-100 pb-2">
                   <button 
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center justify-between w-full text-lg font-semibold text-slate-800 py-2"
                   >
                      {item.label}
                      <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                   </button>
                   
                   {activeDropdown === item.label && (
                      <div className="pl-4 space-y-2 mt-2 bg-slate-50 rounded-lg p-3">
                         {item.children.map((child) => (
                            <Link 
                               key={child.label} 
                               href={child.href}
                               className="block text-slate-600 py-1.5 text-base"
                               onClick={() => setIsOpen(false)}
                            >
                               {child.label}
                            </Link>
                         ))}
                      </div>
                   )}
                </div>
              ))}
              
              <Link 
                href="/admin" 
                className="mt-4 w-full bg-blue-600 text-white text-center font-bold py-3 rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                Admin Login / Post Job
              </Link>
           </nav>
        </div>
      )}
    </header>
  )
}
