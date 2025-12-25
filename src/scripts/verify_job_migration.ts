import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function verifyJobMigration() {
  const payload = await getPayload({ config: configPromise })

  // Fetch recent jobs to check
  const jobs = await payload.find({
    collection: 'jobs',
    limit: 50,
    sort: '-createdAt',
  })

  console.log(`Found ${jobs.totalDocs} jobs to check.`)

  if (jobs.totalDocs > 0) {
    for (const job of jobs.docs) {
      console.log(`Checking Job: ${job.postName}`)
      const legacyEdu = job.education
      const newReqs = job.structuredRequirements

      console.log('Legacy Education:', legacyEdu)
      console.log('Structured Reqs:', JSON.stringify(newReqs, null, 2))

      if (legacyEdu && legacyEdu.length > 0) {
        if (newReqs?.education && newReqs.education.length > 0) {
          console.log(`✅ Job '${job.postName}' migrated successfully.`)
        } else {
          console.error(
            `❌ Job '${job.postName}' has legacy data ${JSON.stringify(legacyEdu)} but EMPTY structured requirements.`,
          )
          // process.exit(1) // Don't exit immediately, let's see others
        }
      } else {
        console.log(`ℹ️ Job '${job.postName}' had no legacy education. Skipping check.`)
      }
    }
  } else {
    console.log(
      '⚠️ No jobs found with both legacy and new data. Checking if ANY job has new data...',
    )
    const anyNew = await payload.find({
      collection: 'jobs',
      where: { 'structuredRequirements.education': { exists: true } },
      limit: 1,
    })
    if (anyNew.totalDocs > 0) {
      console.log('✅ Found at least one job with structured requirements populated.')
    } else {
      console.log(
        '⚠️ No jobs found with structuredRequirements. Migration might not have applied if no legacy data existed.',
      )
    }
  }

  process.exit(0)
}

verifyJobMigration()
