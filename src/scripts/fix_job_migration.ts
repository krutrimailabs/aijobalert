import { getPayload } from 'payload'
import configPromise from '@payload-config'

function mapQualificationToLevel(qual: string): string {
  const q = qual.toUpperCase()
  if (q === '10TH PASS' || q === '10TH' || q === '8TH PASS' || q === '8TH') return '10th'
  if (q === '12TH PASS' || q === '12TH' || q === 'ITI') return '12th'
  if (q === 'DIPLOMA') return 'Diploma'
  if (
    q === 'GRADUATE' ||
    q === 'B.TECH' ||
    q === 'B.TECH/B.E' ||
    q === 'MBBS' ||
    q === 'BDS' ||
    q === 'LLB' ||
    q === 'B.ED' ||
    q === 'B.PHARM' ||
    q === 'B.SC NURSING' ||
    q === 'B.SC_NURSING' ||
    q === 'CA/ICWA' ||
    q === 'CA_ICWA'
  )
    return 'Graduate'

  if (
    q === 'POST GRADUATE' ||
    q === 'PG' ||
    q === 'M.TECH' ||
    q === 'M.TECH/M.E' ||
    q === 'LLM' ||
    q === 'M.ED' ||
    q === 'M.PHARM' ||
    q === 'M.SC NURSING' ||
    q === 'M.SC_NURSING'
  )
    return 'PostGraduate'

  if (q === 'PHD') return 'PhD'

  return 'Graduate'
}

async function fixJobMigration() {
  const payload = await getPayload({ config: configPromise })

  const jobs = await payload.find({
    collection: 'jobs',
    limit: 100,
    where: {
      education: { exists: true },
    },
  })

  console.log(`Checking ${jobs.totalDocs} jobs for fix...`)

  for (const job of jobs.docs) {
    // Check if needs update: has legacy but missing or empty structured
    // @ts-ignore
    const legacy = job.education
    const structured = job.structuredRequirements

    if (legacy && legacy.length > 0) {
      if (!structured?.education || structured.education.length === 0) {
        console.log(`Fixing Job: ${job.postName}`)
        try {
          await payload.update({
            collection: 'jobs',
            id: job.id,
            data: {
              structuredRequirements: {
                ...structured,
                education: [
                  {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    levels: legacy.map((l: string) => mapQualificationToLevel(l)) as any,
                    degrees: [],
                    streams: [],
                  },
                ],
                gender: 'Any',
              },
            },
          })
          console.log(`✅ Fixed.`)
        } catch (e) {
          console.error(`❌ Failed to fix ${job.postName}:`, e)
        }
      }
    }
  }

  process.exit(0)
}

fixJobMigration()
