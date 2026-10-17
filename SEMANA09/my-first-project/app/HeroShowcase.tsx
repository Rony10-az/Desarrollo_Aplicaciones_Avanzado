'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import type { OmdbMovieDetails } from '@/lib/omdb'

const SLIDE_DURATION_MS = 5500
const VISIBLE_RANGE = 2
const FALLBACK_POSTER = 'https://placehold.co/400x600?text=Sin+poster'

const posterOf = (movie: OmdbMovieDetails) =>
  movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER

// Distancia circular más corta al centro: el carrusel gira sin fin en ambos sentidos.
function circularOffset(index: number, current: number, total: number) {
  let offset = index - current
  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total
  return offset
}

interface HeroShowcaseProps {
  movies: OmdbMovieDetails[]
  children: React.ReactNode
}

export default function HeroShowcase({ movies, children }: HeroShowcaseProps) {
  const [position, setPosition] = useState({ current: 0, previous: 0 })
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const total = movies.length
  const { current, previous } = position
  const active = movies[current]
  const genres = active.Genre?.split(',').slice(0, 3).join(' · ')

  const goTo = (index: number) =>
    setPosition((pos) => ({ previous: pos.current, current: ((index % total) + total) % total }))

  return (
    <section id="buscar" className="relative scroll-mt-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {movies.map((movie, index) => (
          <img
            key={movie.imdbID}
            src={posterOf(movie)}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover blur-3xl transition-[opacity,transform] duration-[1600ms] ease-out ${
              index === current ? 'scale-110 opacity-40' : 'scale-100 opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/70 to-neutral-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.18),transparent_60%)]" />
      </div>

      <div className="relative">
        {children}

        <div
          id="cartelera"
          className="animate-fade-up scroll-mt-24 pb-16 pt-12"
          style={{ animationDelay: '1900ms' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="relative mx-auto h-[22rem] max-w-6xl touch-pan-y [--step:7rem] [perspective:1400px] sm:h-[27rem] sm:[--step:11rem] lg:h-[31rem] lg:[--step:14.5rem]"
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
            {movies.map((movie, index) => {
              const offset = circularOffset(index, current, total)
              const distance = Math.abs(offset)
              const isActive = offset === 0
              const isHidden = distance > VISIBLE_RANGE
              // Si la tarjeta dio la vuelta (de un extremo al otro), se reubica sin animar para que no cruce la escena.
              const wrapped = Math.abs(offset - circularOffset(index, previous, total)) > total / 2

              return (
                <div
                  key={movie.imdbID}
                  aria-hidden={isHidden}
                  className={`absolute left-1/2 top-2 -ml-[6.5rem] h-[19.5rem] w-[13rem] sm:-ml-[8rem] sm:h-[24rem] sm:w-[16rem] lg:-ml-[9.5rem] lg:h-[28.5rem] lg:w-[19rem] ${
                    isHidden ? 'pointer-events-none' : ''
                  }`}
                  style={{
                    transform: `translateX(calc(var(--step) * ${offset})) translateZ(${-distance * 140}px) rotateY(${
                      -Math.sign(offset) * 42
                    }deg) scale(${isActive ? 1 : 0.88})`,
                    zIndex: 10 - distance,
                    opacity: isHidden ? 0 : isActive ? 1 : distance === 1 ? 0.85 : 0.5,
                    filter: isActive ? 'none' : 'brightness(0.55) saturate(0.8)',
                    transition: wrapped
                      ? 'opacity 700ms ease'
                      : 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease, filter 700ms ease',
                  }}
                >
                  <div className={`h-full w-full ${isActive ? 'animate-float' : ''}`}>
                    <img
                      src={posterOf(movie)}
                      alt={movie.Title}
                      className={`h-full w-full rounded-2xl object-cover ring-1 ring-white/10 transition-shadow duration-700 ${
                        isActive
                          ? 'shadow-[0_40px_90px_-20px_rgba(251,191,36,0.55)]'
                          : 'shadow-2xl shadow-black/60'
                      }`}
                    />
                  </div>

                  {isActive ? (
                    <Link
                      href={`/movies/${movie.imdbID}`}
                      aria-label={`Ver detalles de ${movie.Title}`}
                      className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-amber-400"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      tabIndex={isHidden ? -1 : 0}
                      aria-label={`Mostrar ${movie.Title}`}
                      className="absolute inset-0 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-amber-400"
                    />
                  )}
                </div>
              )
            })}
          </div>

          <div key={current} className="animate-fade-up mx-auto mt-8 max-w-3xl px-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
              En cartelera · {String(current + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
              {active.Title}
            </h2>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-300">
              {active.imdbRating !== 'N/A' && (
                <span className="rounded-full bg-amber-400 px-3 py-1 font-bold text-zinc-950">
                  ★ {active.imdbRating}
                </span>
              )}
              <span>{active.Year}</span>
              <span className="text-zinc-600">•</span>
              <span>{active.Runtime}</span>
              {genres && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span>{genres}</span>
                </>
              )}
            </div>
            <p className="mx-auto mt-4 line-clamp-2 max-w-2xl text-zinc-300">{active.Plot}</p>
            <Link
              href={`/movies/${active.imdbID}`}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-7 py-3.5 font-bold text-zinc-950 shadow-lg shadow-rose-500/20 transition hover:scale-105 hover:brightness-110"
            >
              ▶ Ver detalles
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-2">
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
                  // El giro automático lo dispara el fin de esta barra: la pausa por hover la congela con exactitud.
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
      </div>
    </section>
  )
}
