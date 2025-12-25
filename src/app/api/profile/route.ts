import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: request.headers })

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      category,
      domicileState,
      qualification,
      preferredStates,
      dateOfBirth,
      gender,
      educationHistory,
      disability,
    } = body

    // Validation (Basic) - Payload will handle schema validation but we can be explicit
    // Filtering only allowed fields to be updated by the user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}
    if (category !== undefined) updateData.category = category
    if (domicileState !== undefined) updateData.domicileState = domicileState
    if (qualification !== undefined) updateData.qualification = qualification
    if (preferredStates !== undefined) updateData.preferredStates = preferredStates
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth
    if (gender !== undefined) updateData.gender = gender
    if (educationHistory !== undefined) updateData.educationHistory = educationHistory
    if (disability !== undefined) updateData.disability = disability

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const updatedUser = await payload.update({
      collection: 'users',
      id: user.user.id,
      data: updateData,
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
