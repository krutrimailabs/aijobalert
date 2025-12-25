import React from 'react'
import '../globals.css'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { cn } from '@/utilities/ui'

export const metadata = {
  title: 'AI Job Alert Admin',
  description: 'Admin Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en">
      <body>{children}</body>
    </html>
  )
}
