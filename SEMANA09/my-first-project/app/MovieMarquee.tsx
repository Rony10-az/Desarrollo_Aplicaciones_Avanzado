import type { OmdbMovieDetails } from '@/lib/omdb'
import MovieCard from './MovieCard'

export default function MovieMarquee({ movies }: { movies: OmdbMovieDetails[] }) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-neutral-950 to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-neutral-950 to-transparent sm:w-32" />

      {/* La lista se duplica para que la animación -50% vuelva al inicio sin salto visible. */}
      <div className="animate-marquee flex w-max gap-6 py-6">
        {[0, 1].map((copy) =>
          movies.map((movie) => (
            <div
              key={`${copy}-${movie.imdbID}`}
              className="w-60 shrink-0 sm:w-64"
              aria-hidden={copy === 1}
            >
              <MovieCard
                imdbID={movie.imdbID}
                title={movie.Title}
                year={movie.Year}
                poster={movie.Poster}
                type={movie.Type}
                rating={movie.imdbRating}
                plot={movie.Plot}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
