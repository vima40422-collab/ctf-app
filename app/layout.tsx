import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CTF Platform',
  description: 'A competitive capture the flag platform',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
