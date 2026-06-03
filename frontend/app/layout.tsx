import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'EngiShield AI - Compliance Industrial',
  description: 'Plataforma de gestao de compliance industrial com IA - NR-1, NR-12, NR-17',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  )
}
