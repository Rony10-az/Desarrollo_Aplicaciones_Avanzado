import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-rose-500 text-base text-zinc-950">
            ▶
          </span>
          <span className="text-white">
            Cine<span className="text-amber-400">Stream</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-semibold text-zinc-400 sm:gap-6">
          <Link href="/#cartelera" className="transition hover:text-amber-400">
            Cartelera
          </Link>
          <Link href="/#tendencias" className="transition hover:text-amber-400">
            Tendencias
          </Link>
          <Link href="/#buscar" className="transition hover:text-amber-400">
            Buscar
          </Link>
        </nav>
      </div>
    </header>
  )
}
