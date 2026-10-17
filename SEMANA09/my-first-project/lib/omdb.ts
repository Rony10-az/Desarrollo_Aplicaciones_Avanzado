import { cacheLife } from 'next/cache'

const OMDB_BASE_URL = 'https://www.omdbapi.com/'

export interface OmdbSearchItem {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchItem[]
  totalResults?: string
  Response: 'True' | 'False'
  Error?: string
}

export interface OmdbMovieDetails extends OmdbSearchItem {
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Ratings: { Source: string; Value: string }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  Response: 'True' | 'False'
  Error?: string
}

export async function fetchOmdb<T>(params: Record<string, string>): Promise<T> {
  const apiKey = process.env.OMDB_API_KEY

  if (!apiKey) {
    throw new Error('Falta la variable de entorno OMDB_API_KEY')
  }

  const searchParams = new URLSearchParams({ ...params, apikey: apiKey })
  const response = await fetch(`${OMDB_BASE_URL}?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error(`OMDb respondió con estado ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const POPULAR_IMDB_IDS = [
  'tt1375666', // Inception
  'tt0468569', // The Dark Knight
  'tt4154796', // Avengers: Endgame
  'tt0816692', // Interstellar
  'tt0903747', // Breaking Bad
  'tt0944947', // Game of Thrones
  'tt0109830', // Forrest Gump
  'tt0137523', // Fight Club
]

export const NOW_SHOWING_IMDB_IDS = [
  'tt15239678', // Dune: Part Two
  'tt15398776', // Oppenheimer
  'tt9362722', // Spider-Man: Across the Spider-Verse
  'tt1745960', // Top Gun: Maverick
  'tt1517268', // Barbie
  'tt6710474', // Everything Everywhere All at Once
]

async function getMoviesByIds(ids: string[]): Promise<OmdbMovieDetails[]> {
  'use cache'
  cacheLife('max')

  const results = await Promise.all(
    ids.map((id) => fetchOmdb<OmdbMovieDetails>({ i: id, plot: 'short' }))
  )

  return results.filter((movie) => movie.Response === 'True')
}

export function getPopularMovies(): Promise<OmdbMovieDetails[]> {
  return getMoviesByIds(POPULAR_IMDB_IDS)
}

export function getNowShowing(): Promise<OmdbMovieDetails[]> {
  return getMoviesByIds(NOW_SHOWING_IMDB_IDS)
}

export async function getMovieDetails(imdbID: string): Promise<OmdbMovieDetails> {
  'use cache'
  cacheLife('hours')

  return fetchOmdb<OmdbMovieDetails>({ i: imdbID, plot: 'full' })
}
