import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from './Header'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CineStream — Películas y Series',
  description: 'Descubre y busca tus películas y series favoritas.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-neutral-950 font-sans antialiased`}>
        <Header />
        {children}
        <footer className="border-t border-white/5 bg-neutral-950 px-4 py-8 text-center text-sm text-zinc-500 sm:px-8">
          <p className="font-bold text-white">
            Cine<span className="text-amber-400">Stream</span>
          </p>
          <p className="mt-1">
            Datos proporcionados por{' '}
            <a
              href="https://www.omdbapi.com"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-amber-400"
            >
              OMDb API
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
