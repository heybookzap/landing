import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ONE BLANK | 내 시간과 생각 지킴이',
  description: '복잡한 생각은 우리가 할게요. 당신은 오늘 딱 하나만 하세요.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="bg-[#050505]">
      <body className={`${inter.className} bg-[#050505] text-white antialiased selection:bg-[#C2A35D] selection:text-black min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
