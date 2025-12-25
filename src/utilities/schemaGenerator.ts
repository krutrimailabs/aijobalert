import { Job } from '@/payload-types'
import type { WithContext, JobPosting, Organization, WebSite } from 'schema-dts'

export const generateJobPostingSchema = (job: Job): WithContext<JobPosting> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.postName,
    description: `<div>
      <p><strong>Recruitment Board:</strong> ${job.recruitmentBoard}</p>
      <p><strong>Total Vacancies:</strong> ${job.totalVacancies || 'Not Specified'}</p>
      <p><strong>Last Date:</strong> ${new Date(job.lastDate).toLocaleDateString()}</p>
      <p><strong>Qualification:</strong> ${job.education?.join(', ') || 'See details'}</p>
    </div>`,
    datePosted: job.postDate,
    validThrough: job.lastDate,
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.recruitmentBoard,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: job.state || 'India',
        addressCountry: 'IN',
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        value: 0, // Placeholder, as we don't have salary field yet
        unitText: 'MONTH',
      },
    },
  }
}

export const generateOrganizationSchema = (): WithContext<Organization> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI Job Alert',
    url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://aijobalert.in',
    logo: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/logo.png`, // Placeholder logic
    sameAs: [
      'https://twitter.com/aijobalert',
      'https://facebook.com/aijobalert',
      'https://linkedin.com/company/aijobalert',
    ],
  }
}

export const generateWebSiteSchema = (): WithContext<WebSite> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI Job Alert',
    url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://aijobalert.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SERVER_URL}/jobs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    } as any,
  }
}
