import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID

  if (!clientId) {
    return NextResponse.json({ error: 'Google Client ID not configured' }, { status: 500 })
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/oauth/google/callback`
  const scope = 'openid email profile'
  const responseType = 'code'

  // In a production app, you should generate a random state and store it in a cookie to verify on callback
  const state = 'google-oauth-state'

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&state=${state}`

  return NextResponse.redirect(googleAuthUrl)
}
