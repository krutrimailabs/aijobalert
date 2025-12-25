import { calculateMatchScore } from '../utilities/matchEngine'
import { User, Job } from '@/payload-types'

function testMatchingEngine() {
  console.log('🧪 Starting Matching Engine Tests...\n')

  // --- Mock Data ---

  // 1. Eligible User (Graduate, CS, Age 24)
  const eligibleUser = {
    id: 'u1',
    email: 'alex@example.com',
    dateOfBirth: '2000-01-01', // Age ~25
    category: 'General',
    gender: 'Male',
    domicileState: 'Maharashtra',
    educationHistory: [
      { level: '10th', passingYear: 2016, percentage: 80 },
      { level: '12th', passingYear: 2018, percentage: 80 },
      {
        level: 'Graduate',
        degree: 'B.Tech',
        stream: 'Computer Science',
        passingYear: 2022,
        percentage: 75,
      },
    ],
    updatedAt: '',
    createdAt: '',
  } as unknown as User

  // 2. Ineligible User (Underage or Wrong Education)
  const ineligibleUser = {
    id: 'u2',
    email: 'kid@example.com',
    dateOfBirth: '2010-01-01', // Age ~15 (Too young for most)
    gender: 'Male',
    educationHistory: [{ level: '10th', passingYear: 2024, percentage: 60 }],
    updatedAt: '',
    createdAt: '',
  } as unknown as User

  // 3. Job Recommendation (Requires Graduate CS, Age < 30)
  const softwareJob = {
    id: 'j1',
    postName: 'Software Engineer',
    minimumAge: 21,
    maximumAge: 30,
    state: 'Maharashtra', // Domicile match (+20)
    structuredRequirements: {
      gender: 'Any',
      education: [
        {
          levels: ['Graduate', 'PostGraduate'],
          streams: ['Computer Science', 'IT'],
        },
      ],
    },
    updatedAt: '',
    createdAt: '',
  } as unknown as Job

  // --- Test Cases ---

  // Test 1: Eligible User vs Job
  console.log('Test 1: Eligible User vs Software Job')
  const result1 = calculateMatchScore(eligibleUser, softwareJob)
  console.log(`Score: ${result1.score}% | Eligible: ${result1.isEligible}`)
  console.log('Reasons:', result1.reasons)

  if (result1.isEligible && result1.score >= 70) {
    // Base 50 + State 20 = 70
    console.log('✅ PASS: User identified as eligible with correct score.')
  } else {
    console.error('❌ FAIL: User should be eligible with high score.')
  }
  console.log('--------------------------------------------------')

  // Test 2: Ineligible User vs Job
  console.log('Test 2: Ineligible User (Age 15) vs Software Job')
  const result2 = calculateMatchScore(ineligibleUser, softwareJob)
  console.log(`Score: ${result2.score}% | Eligible: ${result2.isEligible}`)
  console.log('Reasons:', result2.reasons)

  if (!result2.isEligible && result2.score === 0) {
    console.log('✅ PASS: User correctly rejected (Underage/Education).')
  } else {
    console.error('❌ FAIL: User should be ineligible.')
  }
  console.log('--------------------------------------------------')

  // Test 3: Stream Mismatch (eligible level, wrong stream)
  const mechUser = {
    ...eligibleUser,
    educationHistory: [{ level: 'Graduate', stream: 'Mechanical Engineering' }],
  } as User
  console.log('Test 3: Wrong Stream User (Mechanical) vs Software Job')
  const result3 = calculateMatchScore(mechUser, softwareJob)
  console.log(`Score: ${result3.score}% | Eligible: ${result3.isEligible}`)

  if (!result3.isEligible) {
    console.log('✅ PASS: User rejected for stream mismatch.')
  } else {
    console.error('❌ FAIL: User should be rejected (Mechanical != CS).')
  }

  console.log('\n✅ All Tests Completed.')
}

testMatchingEngine()
