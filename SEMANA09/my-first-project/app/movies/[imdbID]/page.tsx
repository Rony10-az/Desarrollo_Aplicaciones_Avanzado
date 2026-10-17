import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMovieDetails } from '@/lib/omdb'
import SectionDivider from '../../SectionDivider'

const FALLBACK_POSTER = 'https://placehold.co/400x600?text=Sin+poster'

export default function MovieDetailPage({
  params,
}: {
  params: Promise<{ imdbID: string }>
}) {
  return (
    <main className="min-h-screen bg-neutral-950">
      <Suspense fallback={<DetailSkeleton />}>
        <MovieDetailContent params={params} />
      </Suspense>
    </main>
  )
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-16 sm:px-8">
      <div className="grid gap-10 md:grid-cols-[320px_1fr]">
        <div className="aspect-[2/3] w-full rounded-2xl bg-white/5" />
        <div className="space-y-5 pt-4">
          <div className="h-12 w-3/4 rounded-lg bg-white/5" />
          <div className="h-5 w-1/3 rounded bg-white/5" />
          <div className="h-32 w-full rounded-lg bg-white/5" />
        </div>
      </div>
    </div>
  )
}

async function MovieDetailContent({
  params,
}: {
  params: Promise<{ imdbID: string }>
}) {
  const { imdbID } = await params
  const movie = await getMovieDetails(imdbID)

  if (movie.Response === 'False') {
    notFound()
  }

  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER
  const genres = movie.Genre ? movie.Genre.split(',').map((genre) => genre.trim()) : []
  const facts = [
    { label: 'Director', value: movie.Director },
    { label: 'Guion', value: movie.Writer },
    { label: 'Reparto', value: movie.Actors },
    { label: 'Estreno', value: movie.Released },
    { label: 'Idioma', value: movie.Language },
    { label: 'País', value: movie.Country },
    { label: 'Premios', value: movie.Awards },
  ].filter((fact) => fact.value && fact.value !== 'N/A')

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-110 object-cover opacity-30 blur-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/80 to-neutral-950" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-8">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-amber-400"
          >
            ← Volver al inicio
          </Link>

          <div className="grid gap-10 md:grid-cols-[320px_1fr] md:items-end">
            <img
              src={poster}
              alt={movie.Title}
              className="mx-auto w-64 rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-white/10 md:w-full"
            />

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
                {movie.Type === 'series' ? 'Serie' : 'Película'}
              </p>
              <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">
                {movie.Title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                {movie.imdbRating !== 'N/A' && (
                  <span className="rounded-full bg-amber-400 px-3 py-1 font-bold text-zinc-950">
                    ★ {movie.imdbRating}
                  </span>
                )}
                <span>{movie.Year}</span>
                <span className="text-zinc-600">•</span>
                <span>{movie.Runtime}</span>
                <span className="text-zinc-600">•</span>
                <span className="rounded border border-zinc-600 px-1.5 text-xs">{movie.Rated}</span>
              </div>

              {genres.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-200"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionDivider />

        <section className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-black text-white">Sinopsis</h2>
          <p className="text-lg leading-relaxed text-zinc-300">{movie.Plot}</p>
        </section>

        <SectionDivider />

        <section className="mx-auto max-w-3xl pb-16">
          <h2 className="mb-6 text-2xl font-black text-white">Ficha técnica</h2>
          <dl className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.03]">
            {facts.map((fact) => (
              <div key={fact.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[140px_1fr]">
                <dt className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  {fact.label}
                </dt>
                <dd className="text-zinc-200">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {movie.Ratings?.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {movie.Ratings.map((item) => (
                <div
                  key={item.Source}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center"
                >
                  <p className="text-2xl font-black text-white">{item.Value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.Source}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
