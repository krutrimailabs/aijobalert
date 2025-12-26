import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/oauth/google/callback`

    if (!clientId || !clientSecret) {
      throw new Error('Google credentials not configured')
    }

    // 1. Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Token Exchange Failed:', tokenData)
      throw new Error('Failed to exchange token')
    }

    const { access_token } = tokenData

    // 2. Get User Info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info')
    }

    // 3. Find or Create User in Payload
    const payload = await getPayload({ config })

    // Check if user exists by email
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: { equals: userData.email },
      },
    })

    let user = existingUsers.docs[0]

    if (!user) {
      // Create new user
      // Provide a random password as it's required by default auth strategy usually
      const randomPassword =
        Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

      user = await payload.create({
        collection: 'users',
        data: {
          email: userData.email,
          name: userData.name,
          password: randomPassword,
          roles: ['candidate'],
          // @ts-expect-error - We are adding a field that might not be in schema yet
          imageUrl: userData.picture, // We will just store it even if schema doesn't strictly have it yet, or better, we add it to schema
        },
      })
    }

    // 4. Generate Session Token
    // Payload tokens expire in 7200 seconds by default (2 hours), let's match or set 7 days
    // Standard Payload JWT content
    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
        collection: 'users',
      },
      process.env.PAYLOAD_SECRET || '',
      {
        expiresIn: '7d',
      },
    )

    // 5. Set Cookie
    const cookieStore = await cookies()
    cookieStore.set('payload-token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NEXT_PUBLIC_SERVER_URL?.startsWith('https') || false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // 6. Redirect to Dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/dashboard`,
    )
  } catch (error) {
    console.error('Google Auth Error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
