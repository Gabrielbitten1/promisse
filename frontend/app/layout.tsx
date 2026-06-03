import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EngiShield AI - Compliance Industrial',
  description: 'Plataforma de gestao de compliance industrial com IA - NR-1, NR-12, NR-17',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
