import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-slate-50 text-slate-900">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link className="flex items-center mb-4" href="/">
              <Logo />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted source for latest government job notifications, admit cards, results, and
              answer keys.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/jobs"
                className="text-slate-400 hover:text-slate-900 text-sm transition-colors"
              >
                Latest Jobs
              </Link>
              <Link
                href="/jobs?status=admit_card"
                className="text-slate-400 hover:text-slate-900 text-sm transition-colors"
              >
                Admit Cards
              </Link>
              <Link
                href="/jobs?status=result"
                className="text-slate-400  text-sm transition-colors"
              >
                Results
              </Link>
              <Link
                href="/jobs?status=answer_key"
                className="text-slate-400  text-sm transition-colors"
              >
                Answer Keys
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Categories</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/jobs/category/ssc"
                className="text-slate-400 hover:text-slate-900 text-sm transition-colors"
              >
                SSC Jobs
              </Link>
              <Link
                href="/jobs/category/railway"
                className="text-slate-400  text-sm transition-colors"
              >
                Railway Jobs
              </Link>
              <Link
                href="/jobs/category/bank"
                className="text-slate-400  text-sm transition-colors"
              >
                Banking Jobs
              </Link>
              <Link
                href="/jobs/category/upsc"
                className="text-slate-400  text-sm transition-colors"
              >
                UPSC Jobs
              </Link>
            </nav>
          </div>

          {/* States */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Popular States</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/jobs/state/uttar-pradesh"
                className="text-slate-400  text-sm transition-colors"
              >
                Uttar Pradesh
              </Link>
              <Link href="/jobs/state/bihar" className="text-slate-400  text-sm transition-colors">
                Bihar
              </Link>
              <Link
                href="/jobs/state/maharashtra"
                className="text-slate-400  text-sm transition-colors"
              >
                Maharashtra
              </Link>
              <Link href="/jobs/state/delhi" className="text-slate-400  text-sm transition-colors">
                Delhi
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} AI Job Alert. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-6">
            <Link
              href="/about"
              className="text-slate-600 hover:text-blue-600 text-sm transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/privacy-policy"
              className="text-slate-600 hover:text-blue-600 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-600 hover:text-blue-600 text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
