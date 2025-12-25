import 'dotenv/config'
import { bulkImportPractice } from './bulk-import-practice'
import path from 'path'

// Resolve absolute path to seed file relative to CWD
const seedFile = path.resolve(process.cwd(), 'practice-seed-data.json')

bulkImportPractice(seedFile)
  .then(() => {
    console.log('Seed execution finished.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Seed execution failed:', err)
    process.exit(1)
  })
