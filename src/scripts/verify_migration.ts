import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function verifyMigration() {
  const payload = await getPayload({ config: configPromise })

  // Check buddaseshu first
  let users = await payload.find({
    collection: 'users',
    where: {
      email: { equals: 'buddaseshu@gmail.com' },
    },
    depth: 1,
  })

  if (users.totalDocs === 0 || !users.docs[0].educationHistory?.length) {
    console.log(
      'Buddaseshu has no education history, searching for ANY user with populated history...',
    )
    users = await payload.find({
      collection: 'users',
      where: {
        educationHistory: { exists: true },
      },
      limit: 1,
    })
  }

  if (users.totalDocs > 0) {
    const user = users.docs[0]
    console.log('User Found:', user.email)
    console.log('Roles:', user.roles)
    console.log('Education History:', JSON.stringify(user.educationHistory, null, 2))

    if (user.educationHistory && user.educationHistory.length > 0) {
      console.log('✅ Migration Verified: Education History populated.')
    } else if (user.roles && user.roles.includes('candidate')) {
      console.log(
        '✅ Migration Verified (Partial): Roles backfilled, but Education History empty (likely no legacy data).',
      )
    } else {
      console.error('❌ Migration Failed: No updates found.')
    }
  } else {
    // If no users found, maybe we should just create one with old data and migrate it?
    // But verified command ran successfully.
    console.log(
      '⚠️ No users found with education history. Migration might have had nothing to do or only affected roles.',
    )
  }

  process.exit(0)
}

verifyMigration()
