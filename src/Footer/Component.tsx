import Link from 'next/link'
import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

import { Logo } from '@/components/Logo/Logo'
import { INDIAN_STATES, EDUCATION_LEVELS, JOB_CATEGORIES } from '@/lib/constants'

export async function Footer() {
  const currentYear = new Date().getFullYear()

  // Helper function to convert state to URL-friendly slug (just state name in kebab case)
  const stateToSlug = (state: { label: string; value: string }) => {
    return state.label.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
  }

  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {/* Brand Column - Spans 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <Link className="flex items-center mb-4" href="/">
              <Logo />
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              India&apos;s most trusted AI-powered government job portal. Get instant notifications
              for latest sarkari naukri, admit cards, results, and answer keys.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:contact@aijobalert.com" className="hover:text-white">
                  contact@aijobalert.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+91-XXXX-XXXXXX</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Links & CTA */}
            <div className="space-y-3">
              <Link
                href="/about"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors mr-2"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="inline-block px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link href="/jobs" className="text-sm hover:text-white transition-colors">
                Latest Jobs
              </Link>
              <Link href="/results" className="text-sm hover:text-white transition-colors">
                Results
              </Link>
              <Link href="/admit-cards" className="text-sm hover:text-white transition-colors">
                Admit Cards
              </Link>
              <Link href="/answer-keys" className="text-sm hover:text-white transition-colors">
                Answer Keys
              </Link>
              <Link href="/syllabus" className="text-sm hover:text-white transition-colors">
                Syllabus
              </Link>
              <Link href="/exam-calendar" className="text-sm hover:text-white transition-colors">
                Exam Calendar
              </Link>
            </nav>
          </div>

          {/* All Job Categories */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">
              Job Categories
            </h3>
            <nav className="flex flex-col gap-2">
              {JOB_CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/jobs/category/${cat.value}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* All Qualifications */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">
              By Qualification
            </h3>
            <nav className="flex flex-col gap-2">
              {EDUCATION_LEVELS.map((edu) => (
                <Link
                  key={edu.value}
                  href={`/jobs/qualification/${edu.value}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {edu.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company & Legal - Combined */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">Company</h3>
            <nav className="flex flex-col gap-2 mb-6">
              <Link href="/about" className="text-sm hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-sm hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link href="/advertise" className="text-sm hover:text-white transition-colors">
                Advertise With Us
              </Link>
              <Link href="/faqs" className="text-sm hover:text-white transition-colors">
                FAQs
              </Link>
            </nav>

            <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/privacy-policy" className="text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-sm hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/disclaimer" className="text-sm hover:text-white transition-colors">
                Disclaimer
              </Link>
              <Link href="/refund-policy" className="text-sm hover:text-white transition-colors">
                Refund Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* All States Section - Full Width */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">
            Jobs by State & Union Territory
          </h3>
          <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-2">
            {INDIAN_STATES.map((state) => (
              <Link
                key={state.value}
                href={`/jobs/state/${stateToSlug(state)}`}
                className="text-sm hover:text-white transition-colors"
              >
                {state.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="max-w-md">
            <h4 className="text-white font-bold mb-2">Subscribe to Job Alerts</h4>
            <p className="text-sm mb-4">
              Get latest government job notifications directly in your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 focus:outline-none text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Disclaimer Bar */}
      <div className="bg-slate-950 border-t border-slate-800">
        <div className="container py-6">
          <div className="text-xs text-slate-400 leading-relaxed space-y-2">
            <p className="font-semibold text-slate-300">⚠️ Important Disclaimer:</p>
            <p>
              AI Job Alert is an independent job portal and is not associated with any government
              organization. All information published on this website is for informational purposes
              only. We collect data from official government websites and present it in an organized
              format. Users are advised to verify all details from official sources before applying.
              We are not responsible for any inadvertent errors that may have crept in the
              information being published. AI Job Alert does not charge any fee for job
              notifications or applications.
            </p>
            <p>
              All trademarks, logos and brand names are the property of their respective owners. Use
              of these names, trademarks and brands does not imply endorsement.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 border-t border-slate-800">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <p>© {currentYear} AI Job Alert. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white">
                Terms
              </Link>
              <Link href="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>
              <Link href="/sitemap.xml" className="hover:text-white">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
