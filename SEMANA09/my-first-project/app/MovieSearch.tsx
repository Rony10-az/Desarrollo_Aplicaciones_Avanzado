'use client'
// Client Component: cada tecleo del usuario dispara una búsqueda desde el navegador (CSR).
import { useEffect, useState } from 'react'
import axios from 'axios'
import type { OmdbSearchItem, OmdbSearchResponse } from '@/lib/omdb'
import MovieCard from './MovieCard'

interface SearchOutcome {
  query: string
  results: OmdbSearchItem[]
  error: string | null
}

export default function MovieSearch() {
  const [query, setQuery] = useState('')
  const [outcome, setOutcome] = useState<SearchOutcome | null>(null)

  const trimmed = query.trim()
  const canSearch = trimmed.length >= 3
  // Solo se muestra la respuesta que corresponde al texto actual; así una respuesta tardía nunca pisa a otra.
  const isCurrent = canSearch && outcome?.query === trimmed
  const loading = canSearch && !isCurrent
  const results = isCurrent ? outcome.results : []
  const error = isCurrent ? outcome.error : null

  useEffect(() => {
    if (!canSearch) return

    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.get<OmdbSearchResponse>('/api/omdb', {
          params: { s: trimmed },
        })
        setOutcome({
          query: trimmed,
          results: response.data.Search ?? [],
          error: response.data.Response === 'False' ? response.data.Error ?? 'Sin resultados' : null,
        })
      } catch {
        setOutcome({ query: trimmed, results: [], error: 'Error al buscar. Intenta de nuevo.' })
      }
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [trimmed, canSearch])

  return (
    <div>
      <div className="relative mx-auto max-w-2xl">
        <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-zinc-500">
          ⌕
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busca una película o serie: Batman, Suits, Dune..."
          aria-label="Buscar películas o series"
          className="w-full rounded-full border border-white/10 bg-white/5 py-4 pl-14 pr-6 text-lg text-white shadow-2xl shadow-black/40 backdrop-blur placeholder:text-zinc-500 focus:border-amber-400/70 focus:outline-none focus:ring-4 focus:ring-amber-400/15"
        />
      </div>

      <div className="mt-6 min-h-6 text-sm">
        {loading && <p className="text-zinc-400">Buscando...</p>}
        {error && !loading && (
          <p className="text-rose-400">
            {error === 'Movie not found!' ? `No encontramos resultados para "${query.trim()}".` : error}
          </p>
        )}
        {!loading && !error && query.trim().length > 0 && query.trim().length < 3 && (
          <p className="text-zinc-500">Escribe al menos 3 letras...</p>
        )}
      </div>

      {!loading && results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((item, index) => (
            <div
              key={item.imdbID}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <MovieCard
                imdbID={item.imdbID}
                title={item.Title}
                year={item.Year}
                poster={item.Poster}
                type={item.Type}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
