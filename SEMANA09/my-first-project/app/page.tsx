// Server Component: cartelera y tendencias se obtienen y cachean en el servidor (SSR) para una carga inicial instantánea.
import { getNowShowing, getPopularMovies } from '@/lib/omdb'
import HeroShowcase from './HeroShowcase'
import MovieMarquee from './MovieMarquee'
import MovieSearch from './MovieSearch'
import Reveal from './Reveal'
import SectionDivider from './SectionDivider'

const LOAD_ERROR = 'No pudimos cargar las películas en este momento. Intenta nuevamente más tarde.'

// Las animaciones de la portada arrancan cuando el telón de entrada termina de abrirse.
const afterCurtain = (extraMs: number) => ({ animationDelay: `${1300 + extraMs}ms` })

export default async function HomePage() {
  const [nowShowing, popularMovies] = await Promise.all([getNowShowing(), getPopularMovies()])

  const welcome = (
    <div className="mx-auto max-w-6xl px-4 pt-20 text-center sm:px-8 sm:pt-28">
      <p
        className="animate-fade-up mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400"
        style={afterCurtain(0)}
      >
        Películas · Series · Estrenos
      </p>
      <h1
        className="animate-fade-up mx-auto max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl"
        style={afterCurtain(150)}
      >
        Bienvenido a{' '}
        <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 bg-clip-text text-transparent">
          CineStream
        </span>
      </h1>
      <p
        className="animate-fade-up mx-auto mb-10 mt-6 max-w-2xl text-lg text-zinc-300"
        style={afterCurtain(300)}
      >
        Tu cartelera personal. Descubre lo que todos están viendo y encuentra tu próxima película
        o serie favorita en segundos.
      </p>
      <div className="animate-fade-up" style={afterCurtain(450)}>
        <MovieSearch />
      </div>
    </div>
  )

  return (
    <main className="min-h-screen overflow-x-hidden bg-neutral-950">
      {nowShowing.length > 0 ? (
        <HeroShowcase movies={nowShowing}>{welcome}</HeroShowcase>
      ) : (
        <section id="buscar" className="relative scroll-mt-20 pb-12">
          {welcome}
          <p className="mt-10 text-center text-rose-400">{LOAD_ERROR}</p>
        </section>
      )}

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
