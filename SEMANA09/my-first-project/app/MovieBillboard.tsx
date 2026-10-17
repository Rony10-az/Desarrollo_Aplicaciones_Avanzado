'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import type { OmdbMovieDetails } from '@/lib/omdb'

const SLIDE_DURATION_MS = 6000
const FALLBACK_POSTER = 'https://placehold.co/400x600?text=Sin+poster'

const reveal = (active: boolean) =>
  `transition-all duration-700 ease-out motion-reduce:transition-none ${
    active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
  }`

export default function MovieBillboard({ movies }: { movies: OmdbMovieDetails[] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const goTo = (index: number) => setCurrent((index + movies.length) % movies.length)

  return (
    <div
      className="group/billboard relative overflow-hidden rounded-3xl ring-1 ring-white/10"
      aria-roledescription="carrusel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return
        const deltaX = event.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(deltaX) > 50) goTo(current + (deltaX < 0 ? 1 : -1))
        touchStartX.current = null
      }}
    >
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {movies.map((movie, index) => {
          const active = index === current
          const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER
          const genres = movie.Genre?.split(',').slice(0, 2).join(' · ')

          return (
            <article
              key={movie.imdbID}
              inert={!active}
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${movies.length}: ${movie.Title}`}
              className="relative h-[34rem] w-full shrink-0 overflow-hidden"
            >
              <img
                src={poster}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 h-full w-full object-cover opacity-50 blur-2xl transition-transform duration-[6000ms] ease-linear motion-reduce:transition-none ${
                  active ? 'scale-125' : 'scale-110'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />

              <div className="relative flex h-full items-center gap-12 px-6 pb-16 sm:px-14">
                <div className="flex-1">
                  <p className={`${reveal(active)} delay-100 mb-4 text-xs font-bold uppercase tracking-[0.3em] text-amber-400`}>
                    En cartelera · {String(index + 1).padStart(2, '0')}/{String(movies.length).padStart(2, '0')}
                  </p>
                  <h3 className={`${reveal(active)} delay-200 max-w-2xl text-4xl font-black leading-[1.05] text-white sm:text-6xl`}>
                    {movie.Title}
                  </h3>
                  <div className={`${reveal(active)} delay-300 mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-300`}>
                    {movie.imdbRating !== 'N/A' && (
                      <span className="rounded-full bg-amber-400 px-3 py-1 font-bold text-zinc-950">
                        ★ {movie.imdbRating}
                      </span>
                    )}
                    <span>{movie.Year}</span>
                    <span className="text-zinc-600">•</span>
                    <span>{movie.Runtime}</span>
                    {genres && (
                      <>
                        <span className="text-zinc-600">•</span>
                        <span>{genres}</span>
                      </>
                    )}
                  </div>
                  <p className={`${reveal(active)} delay-[400ms] mt-5 line-clamp-3 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg`}>
                    {movie.Plot}
                  </p>
                  <div className={`${reveal(active)} delay-500 mt-8`}>
                    <Link
                      href={`/movies/${movie.imdbID}`}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-7 py-3.5 font-bold text-zinc-950 shadow-lg shadow-rose-500/20 transition hover:scale-105 hover:brightness-110"
                    >
                      ▶ Ver detalles
                    </Link>
                  </div>
                </div>

                <img
                  src={poster}
                  alt={movie.Title}
                  className={`hidden w-60 shrink-0 rounded-2xl shadow-2xl shadow-black/70 ring-1 ring-white/10 transition-all delay-200 duration-1000 ease-out motion-reduce:transition-none md:block lg:w-72 ${
                    active ? 'translate-x-0 rotate-2 opacity-100' : 'translate-x-24 rotate-12 opacity-0'
                  }`}
                />
              </div>
            </article>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => goTo(current - 1)}
        aria-label="Película anterior"
        className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-2xl text-white opacity-0 backdrop-blur transition hover:bg-amber-400 hover:text-zinc-950 group-hover/billboard:opacity-100 focus-visible:opacity-100 sm:flex"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        aria-label="Película siguiente"
        className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-2xl text-white opacity-0 backdrop-blur transition hover:bg-amber-400 hover:text-zinc-950 group-hover/billboard:opacity-100 focus-visible:opacity-100 sm:flex"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-6 flex gap-2 sm:left-14">
        {movies.map((movie, index) => (
          <button
            key={movie.imdbID}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Ir a ${movie.Title}`}
            aria-current={index === current}
            className={`relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all duration-500 ${
              index === current ? 'w-14' : 'w-6 hover:bg-white/40'
            }`}
          >
            {index === current && (
              // El avance automático lo dispara el fin de esta barra, así la pausa por hover la congela con exactitud.
              <span
                key={current}
                className="animate-progress absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-rose-500"
                style={{
                  animationDuration: `${SLIDE_DURATION_MS}ms`,
                  animationPlayState: paused ? 'paused' : 'running',
                }}
                onAnimationEnd={() => goTo(current + 1)}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
