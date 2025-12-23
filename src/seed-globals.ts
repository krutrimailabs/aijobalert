import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding CMS globals...')

  // 1. Seed Navigation
  console.log('📍 Seeding Navigation...')
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      mainMenu: [
        { label: 'Home', href: '/', order: 0 },
        { label: 'Latest Jobs', href: '/jobs', order: 1 },
        {
          label: 'Jobs by Category',
          order: 2,
          dropdown: [
            { label: 'Railway Jobs', href: '/jobs/category/railway' },
            { label: 'Bank Jobs', href: '/jobs/category/bank' },
            { label: 'SSC Jobs', href: '/jobs/category/ssc' },
            { label: 'Teaching Jobs', href: '/jobs/category/teaching' },
            { label: 'Police Jobs', href: '/jobs/category/police' },
            { label: 'UPSC Jobs', href: '/jobs/category/upsc' },
            { label: 'CRPF Jobs', href: '/jobs/category/crpf' },
            { label: 'BSF Jobs', href: '/jobs/category/bsf' },
            { label: 'CISF Jobs', href: '/jobs/category/cisf' },
            { label: 'Postal Jobs', href: '/jobs/category/postal' },
            { label: 'Defence Jobs', href: '/jobs/category/defence' },
            { label: 'Medical Jobs', href: '/jobs/category/medical' },
            { label: 'Engineering Jobs', href: '/jobs/category/engineering' },
            { label: 'IBPS Jobs', href: '/jobs/category/ibps' },
            { label: 'DRDO Jobs', href: '/jobs/category/drdo' },
          ],
        },
        {
          label: 'Jobs by Qualification',
          order: 3,
          dropdown: [
            { label: '8th Pass', href: '/jobs/qualification/8TH' },
            { label: '10th Pass', href: '/jobs/qualification/10TH' },
            { label: '12th Pass', href: '/jobs/qualification/12TH' },
            { label: 'Graduate', href: '/jobs/qualification/GRADUATE' },
            { label: 'Post Graduate', href: '/jobs/qualification/POST_GRADUATE' },
            { label: 'ITI', href: '/jobs/qualification/ITI' },
            { label: 'Diploma', href: '/jobs/qualification/DIPLOMA' },
            { label: 'BE/B.Tech', href: '/jobs/qualification/BE_BTECH' },
            { label: 'BA/B.Sc/B.Com', href: '/jobs/qualification/BA_BSC_BCOM' },
            { label: 'MA/M.Sc/M.Com', href: '/jobs/qualification/MA_MSC_MCOM' },
            { label: 'MBA', href: '/jobs/qualification/MBA' },
            { label: 'PhD', href: '/jobs/qualification/PHD' },
          ],
        },
        {
          label: 'Jobs by State',
          order: 4,
          dropdown: [
            { label: 'All India', href: '/jobs/state/AI' },
            { label: 'Delhi', href: '/jobs/state/DL' },
            { label: 'Maharashtra', href: '/jobs/state/MH' },
            { label: 'Uttar Pradesh', href: '/jobs/state/UP' },
            { label: 'Karnataka', href: '/jobs/state/KA' },
            { label: 'Tamil Nadu', href: '/jobs/state/TN' },
            { label: 'West Bengal', href: '/jobs/state/WB' },
            { label: 'Gujarat', href: '/jobs/state/GJ' },
            { label: 'Rajasthan', href: '/jobs/state/RJ' },
            { label: 'Madhya Pradesh', href: '/jobs/state/MP' },
          ],
        },
        { label: 'Result', href: '/results', order: 5 },
        { label: 'Admit Card', href: '/admit-cards', order: 6 },
        { label: 'Answer Key', href: '/answer-keys', order: 7 },
        { label: 'Syllabus', href: '/syllabus', order: 8 },
        { label: 'About Us', href: '/about', order: 9 },
        { label: 'Contact Us', href: '/contact', order: 10 },
      ],
    },
  })
  console.log('✅ Navigation seeded')

  // 2. Seed Site Settings
  console.log('⚙️ Seeding Site Settings...')
  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      siteName: 'AI JOB ALERT',
      tagline: "INDIA'S NO. 1 GOVERNMENT JOB PORTAL Powered by AI",
      telegramLink: 'https://t.me/aijobalert',
      contactEmail: 'contact@aijobalert.com',
    },
  })
  console.log('✅ Site Settings seeded')

  // 3. Seed Footer
  console.log('📄 Seeding Footer...')
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          title: 'Quick Links',
          links: [
            { label: 'Latest Jobs', href: '/jobs' },
            { label: 'Results', href: '/results' },
            { label: 'Admit Cards', href: '/admit-cards' },
            { label: 'Answer Keys', href: '/answer-keys' },
          ],
        },
        {
          title: 'Popular Categories',
          links: [
            { label: 'Railway Jobs', href: '/jobs/category/railway' },
            { label: 'Bank Jobs', href: '/jobs/category/bank' },
            { label: 'SSC Jobs', href: '/jobs/category/ssc' },
            { label: 'Teaching Jobs', href: '/jobs/category/teaching' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact Us', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms of Service', href: '/terms-of-service' },
          ],
        },
      ],
      copyrightText: `© ${new Date().getFullYear()} AI Job Alert. All rights reserved.`,
    },
  })
  console.log('✅ Footer seeded')

  // 4. Seed SEO Settings
  console.log('🔍 Seeding SEO Settings...')
  await payload.updateGlobal({
    slug: 'seoSettings',
    data: {
      defaultTitle: 'AI Job Alert - Latest Government Jobs, Results & Admit Cards 2024',
      defaultDescription:
        "India's No. 1 AI-powered government job portal. Find latest sarkari naukri, job notifications, admit cards, results, answer keys, and syllabus. Get daily updates on railway, bank, SSC, UPSC, teaching, police jobs and more.",
      keywords:
        'government jobs, sarkari naukri, latest jobs, admit card, result, answer key, railway jobs, bank jobs, SSC jobs, UPSC jobs',
      jobsSEO: {
        titleTemplate: '{postName} | Latest Notification {year}',
        descriptionTemplate:
          'Apply for {postName} - {organization}. Total Vacancies: {vacancies}. Last Date: {lastDate}. Get complete details, eligibility, salary, how to apply.',
      },
    },
  })
  console.log('✅ SEO Settings seeded')

  console.log('🎉 All globals seeded successfully!')
  process.exit(0)
}

seed().catch((error) => {
  console.error('❌ Error seeding data:', error)
  process.exit(1)
})
