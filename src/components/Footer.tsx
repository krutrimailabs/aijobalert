'use client'

import Link from 'next/link'
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin, FileText } from 'lucide-react'

interface FooterColumn {
  title: string
  links: Array<{ label: string; href: string }>
}

const FOOTER_CONTENT: FooterColumn[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Latest Jobs', href: '/jobs' },
      { label: 'Results', href: '/results' },
      { label: 'Admit Cards', href: '/admit-cards' },
      { label: 'Answer Keys', href: '/answer-keys' },
      { label: 'Syllabus', href: '/syllabus' },
    ],
  },
  {
    title: 'Popular Categories',
    links: [
      { label: 'Railway Jobs', href: '/jobs/category/railway' },
      { label: 'Bank Jobs', href: '/jobs/category/bank' },
      { label: 'SSC Jobs', href: '/jobs/category/ssc' },
      { label: 'UPSC Jobs', href: '/jobs/category/upsc' },
      { label: 'Teaching Jobs', href: '/jobs/category/teaching' },
      { label: 'Police Jobs', href: '/jobs/category/police' },
    ],
  },
  {
    title: 'By Qualification',
    links: [
      { label: '10th Pass Jobs', href: '/jobs/qualification/10TH' },
      { label: '12th Pass Jobs', href: '/jobs/qualification/12TH' },
      { label: 'Graduate Jobs', href: '/jobs/qualification/GRADUATE' },
      { label: 'Post Graduate', href: '/jobs/qualification/POST_GRADUATE' },
      { label: 'ITI Jobs', href: '/jobs/qualification/ITI' },
      { label: 'Diploma Jobs', href: '/jobs/qualification/DIPLOMA' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Job Alerts', href: '/job-alerts' },
      { label: 'Exam Calendar', href: '/exam-calendar' },
      { label: 'Preparation Tips', href: '/preparation-tips' },
      { label: 'Previous Papers', href: '/previous-papers' },
      { label: 'Current Affairs', href: '/current-affairs' },
      { label: 'Study Material', href: '/study-material' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Advertise With Us', href: '/advertise' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">AI JOB ALERT</h3>
                <p className="text-xs text-blue-400 font-semibold">Powered by AI</p>
              </div>
            </div>
            <p className="text-sm mb-4 leading-relaxed">
              India&apos;s most trusted AI-powered government job portal. Get instant notifications
              for latest sarkari naukri, admit cards, results, and answer keys.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mb-4">
              <a
                href="https://t.me/aijobalert"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#229ED9] hover:bg-[#1d8dbf] rounded-full transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
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
          </div>

          {/* Footer Links Columns */}
          {FOOTER_CONTENT.map((column) => (
            <div key={column.title}>
              <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white hover:translate-x-1 transition-all inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
        <div className="max-w-7xl mx-auto px-4 py-6">
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
        <div className="max-w-7xl mx-auto px-4 py-4">
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
              <Link href="/cookie-policy" className="hover:text-white">
                Cookies
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
