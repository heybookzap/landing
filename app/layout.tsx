import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ONE BLANK',
  description: '영구적인 인지 보호 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-[#050505] text-white">{children}</body>
    </html>
  )
}
