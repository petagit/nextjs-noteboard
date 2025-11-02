import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Noteboard',
  description: 'A simple noteboard application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

