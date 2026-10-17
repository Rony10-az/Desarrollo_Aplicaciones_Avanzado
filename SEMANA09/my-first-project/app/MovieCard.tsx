'use client'

import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import type { OmdbMovieDetails } from '@/lib/omdb'

interface MovieCardProps {
  imdbID: string
  title: string
  year: string
  poster: string
  type?: string
  rating?: string
  plot?: string
}

const FALLBACK_POSTER = 'https://placehold.co/400x600?text=Sin+poster'

export default function MovieCard({
  imdbID,
  title,
  year,
  poster,
  type,
  rating,
  plot: initialPlot,
}: MovieCardProps) {
  const [plot, setPlot] = useState(initialPlot)
  const [loadingPlot, setLoadingPlot] = useState(false)
  const [requested, setRequested] = useState(Boolean(initialPlot))

  // Las tarjetas de búsqueda no traen sinopsis: se pide al primer hover, no antes.
  const loadPlot = async () => {
    if (requested) return
    setRequested(true)
    setLoadingPlot(true)
    try {
      const response = await axios.get<OmdbMovieDetails>('/api/omdb', {
        params: { i: imdbID, plot: 'short' },
      })
      setPlot(response.data.Plot && response.data.Plot !== 'N/A' ? response.data.Plot : undefined)
    } catch {
      setPlot(undefined)
    } finally {
      setLoadingPlot(false)
    }
  }

  const meta = [year, type].filter(Boolean).join(' · ')

  return (
    <div
      className="group h-96 w-full [perspective:1500px]"
      onMouseEnter={loadPlot}
      onTouchStart={loadPlot}
    >
      <div className="relative h-full w-full rounded-2xl shadow-xl shadow-black/40 transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-white/10 [backface-visibility:hidden]">
          <img
            src={poster && poster !== 'N/A' ? poster : FALLBACK_POSTER}
            alt={title}
            className="h-full w-full object-cover"
          />

          {rating && rating !== 'N/A' && (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-amber-300 backdrop-blur">
              ★ {rating}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-16">
            <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-white sm:text-2xl">
              {title}
            </h3>
            <p className="mt-1 text-sm font-medium capitalize text-zinc-300">{meta}</p>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-neutral-950 p-6 ring-1 ring-amber-500/30 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-white">{title}</h3>
          <p className="mb-4 mt-1 text-xs font-medium capitalize text-amber-400">{meta}</p>

          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Sinopsis
          </p>
          <p className="flex-1 overflow-y-auto pr-1 text-sm leading-relaxed text-zinc-300">
            {loadingPlot ? 'Cargando sinopsis...' : plot ?? 'Sinopsis no disponible.'}
          </p>

          <Link
            href={`/movies/${imdbID}`}
            className="mt-4 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-4 py-2.5 text-center text-sm font-bold text-zinc-950 transition hover:brightness-110"
          >
            Ver detalles →
          </Link>
        </div>
      </div>
    </div>
  )
}
