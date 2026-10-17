// Server Component: cartelera y tendencias se obtienen y cachean en el servidor (SSR) para una carga inicial instantánea.
import { getNowShowing, getPopularMovies } from '@/lib/omdb'
import MovieBillboard from './MovieBillboard'
import MovieMarquee from './MovieMarquee'
import MovieSearch from './MovieSearch'
import Reveal from './Reveal'
import SectionDivider from './SectionDivider'

const LOAD_ERROR = 'No pudimos cargar las películas en este momento. Intenta nuevamente más tarde.'

export default async function HomePage() {
  const [nowShowing, popularMovies] = await Promise.all([getNowShowing(), getPopularMovies()])

  return (
    <main className="min-h-screen overflow-x-hidden bg-neutral-950">
      <section
        id="buscar"
        className="relative scroll-mt-20 overflow-hidden px-4 pb-8 pt-20 sm:px-8 sm:pt-28"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[56rem] -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-rose-500/20 blur-3xl [animation-duration:6s]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <p className="animate-fade-up mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Películas · Series · Estrenos
          </p>
          <h1
            className="animate-fade-up mx-auto max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl"
            style={{ animationDelay: '150ms' }}
          >
            Bienvenido a{' '}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 bg-clip-text text-transparent">
              CineStream
            </span>
          </h1>
          <p
            className="animate-fade-up mx-auto mb-10 mt-6 max-w-2xl text-lg text-zinc-400"
            style={{ animationDelay: '300ms' }}
          >
            Tu cartelera personal. Descubre lo que todos están viendo y encuentra tu próxima
            película o serie favorita en segundos.
          </p>

          <div className="animate-fade-up" style={{ animationDelay: '450ms' }}>
            <MovieSearch />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionDivider />
      </div>

      <section id="cartelera" className="mx-auto max-w-6xl scroll-mt-20 px-4 sm:px-8">
        <Reveal>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">En cartelera</h2>
            <p className="mt-2 text-zinc-400">Los estrenos más comentados, uno tras otro.</p>
          </div>
          {nowShowing.length === 0 ? (
            <p className="text-center text-rose-400">{LOAD_ERROR}</p>
          ) : (
            <MovieBillboard movies={nowShowing} />
          )}
        </Reveal>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionDivider />
      </div>

      <section id="tendencias" className="scroll-mt-20 pb-8">
        <Reveal>
          <div className="mx-auto mb-2 max-w-6xl px-4 text-center sm:px-8">
            <h2 className="text-3xl font-black text-white sm:text-4xl">En tendencia</h2>
            <p className="mt-2 text-zinc-400">
              Pasa el cursor sobre una película para ver su sinopsis.
            </p>
          </div>
          {popularMovies.length === 0 ? (
            <p className="text-center text-rose-400">{LOAD_ERROR}</p>
          ) : (
            <MovieMarquee movies={popularMovies} />
          )}
        </Reveal>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionDivider />
      </div>
    </main>
  )
}
