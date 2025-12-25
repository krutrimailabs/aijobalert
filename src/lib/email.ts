import { Resend } from 'resend'

export const sendEmail = async ({
  to,
  subject,
  html,
  fromName = 'AI Job Alert',
  fromEmail = 'alerts@aijobalert.in',
}: {
  to: string | string[]
  subject: string
  html: string
  fromName?: string
  fromEmail?: string
}) => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set. Email not sent.')
    return { success: false, error: 'Missing API Key' }
  }

  const resend = new Resend(apiKey)

  try {
    const data = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}
