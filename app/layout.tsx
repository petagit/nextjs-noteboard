import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bunny Notes Notepad',
  description: 'A simple bunny-themed notepad application',
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

