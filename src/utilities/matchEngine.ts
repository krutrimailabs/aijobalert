import { Job, User } from '@/payload-types'

export interface MatchResult {
  score: number // 0 to 100
  isEligible: boolean
  reasons: string[] // e.g., "Age requirement not met", "Perfect education match"
}

/**
 * Calculates a match score between a user profile and a job posting.
 *
 * Scoring Logic:
 * - Eligibility (Hard Gates):
 *   - Age within limit (taking relaxation into account): Pass/Fail
 *   - Education Level met: Pass/Fail
 *   - Gender met: Pass/Fail
 *
 *   If any Hard Gate fails, Score = 0 (or very low like 10 if close).
 *   If all Hard Gates pass, Base Score = 50.
 *
 * - Relevance (Soft Boosts):
 *   - State Match: +20
 *   - Stream/Degree Match: +20
 *   - Category Match (Reserved posts): +10
 *
 * Max Score: 100
 */
export const calculateMatchScore = (user: User, job: Job): MatchResult => {
  let score = 0
  const reasons: string[] = []
  let isEligible = true

  // --- 1. Hard Gates (Eligibility) ---

  // A. Age Check
  if (user.dateOfBirth && job.maximumAge) {
    const dob = new Date(user.dateOfBirth)
    const today = new Date()
    // Calculate age (simple version, ideally use job.ageCalculationDate)
    let age = today.getFullYear() - dob.getFullYear()
    const m = today.getMonth() - dob.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--
    }

    // Relaxation
    let maxAge = job.maximumAge
    if (job.ageRelaxationRules && user.category && user.category !== 'General') {
      const rule = job.ageRelaxationRules.find((r) => r.category === user.category)
      if (rule) {
        maxAge += rule.years
        reasons.push(`Age relaxation of ${rule.years} years applied (${user.category})`)
      }
    }

    if (age > maxAge) {
      isEligible = false
      reasons.push(`Over age limit (Your age: ${age}, Max: ${maxAge})`)
    } else if (job.minimumAge && age < job.minimumAge) {
      isEligible = false
      reasons.push(`Under age limit (Your age: ${age}, Min: ${job.minimumAge})`)
    } else {
      reasons.push('Age requirement met')
    }
  }

  if (job.structuredRequirements?.gender && job.structuredRequirements.gender !== 'Any') {
    if (user.gender && user.gender !== job.structuredRequirements.gender) {
      isEligible = false

      reasons.push(`Gender requirement not met (Required: ${job.structuredRequirements.gender})`)
    }
  }

  const jobEdu = job.structuredRequirements?.education
  const userEdu = user.educationHistory

  if (jobEdu && Array.isArray(jobEdu) && jobEdu.length > 0) {
    if (!userEdu || userEdu.length === 0) {
      isEligible = false
      reasons.push('No education history found in profile')
    } else {
      // Check if any job requirement set is satisfied by user
      // Job needs (Grad AND CS) OR (Diploma AND Civil) -> represented as array of groups
      let eduMatchFound = false

      for (const reqGroup of jobEdu) {
        // In a group, user must have AT LEAST ONE of the required levels (if specified)
        // AND if degrees/streams specified, must match.
        // Logic: For this group to Pass, User must have an entry matching Level.

        const requiredLevels = reqGroup.levels
        if (requiredLevels && requiredLevels.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const hasLevel = userEdu.some((u) => requiredLevels.includes(u.level as any))
          if (hasLevel) {
            eduMatchFound = true
            // If Streams specified, check stream
            if (reqGroup.streams && reqGroup.streams.length > 0) {
              const requiredStreams = reqGroup.streams
              const hasStream = userEdu.some(
                (u) =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  requiredLevels.includes(u.level as any) &&
                  requiredStreams.some((s: string) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (u.stream as any)?.toLowerCase().includes(s.toLowerCase()),
                  ),
              )
              if (!hasStream) eduMatchFound = false
            }
          }
        } else {
          // No specific level? assume open (rare)
          eduMatchFound = true
        }
        if (eduMatchFound) break
      }

      if (!eduMatchFound) {
        isEligible = false
        reasons.push('Education qualifications do not match requirements')
      } else {
        reasons.push('Education requirements met')
      }
    }
  }

  // --- Scoring ---

  if (!isEligible) {
    return { score: 0, isEligible: false, reasons }
  }

  score = 50 // Base score for being eligible

  // 1. Domicile / State Match (+20)
  // If job is for specific state and user matches
  if (job.state && (job.state as string) !== 'All India') {
    if (user.domicileState === job.state) {
      score += 20
      reasons.push('Domicile state match (+20)')
    } else if (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user.preferredStates?.includes(job.state as any)
    ) {
      score += 10
      reasons.push('Preferred state match (+10)')
    }
  } else {
    // All India jobs
    score += 10
    reasons.push('All India job (+10)')
  }

  // 2. Category Match (+15)
  // If job has vacancies for user's category (Assuming we parse vacancyBreakdown later,
  // currently check if category is mentioned in job.category classification)
  if (user.category && job.category && Array.isArray(job.category)) {
    // Logic: If job has specific category tag or vacancy (future), boost.
    // For now, if user is Reserved and Job has Age Relaxation for them, imply benefit
    if (job.ageRelaxationRules?.some((r) => r.category === user.category)) {
      score += 15
      reasons.push(`Category benefit available for ${user.category} (+15)`)
    }
  }

  // 3. High Qual Bonus (+15)
  // If user has higher degree than min required?
  // (Simplified: if user has PG/PhD, boost)
  if (user.educationHistory?.some((e) => ['PostGraduate', 'PhD'].includes(e.level))) {
    score += 15
    reasons.push('Higher qualification bonus (+15)')
  }

  return {
    score: Math.min(score, 100),
    isEligible: true,
    reasons,
  }
}
