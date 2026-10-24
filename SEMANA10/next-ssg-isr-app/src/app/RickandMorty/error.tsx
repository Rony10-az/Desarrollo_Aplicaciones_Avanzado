'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function RickAndMortyError({
    error,
    retry,
}: {
    error: unknown
    retry: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex items-center justify-center px-6 py-12 min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-xl bg-white text-gray-700 rounded-3xl shadow-2xl p-10 text-center">
                <h2 className="text-3xl font-bold text-gray-800">
                    No pudimos cargar los personajes
                </h2>
                <p className="mt-4 text-gray-500">
                    Hubo un problema al conectar con la API. Inténtalo nuevamente.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => retry()}
                        className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-700 transition cursor-pointer"
                    >
                        Reintentar
                    </button>
                    <Link
                        href="/RickandMorty"
                        className="bg-gray-100 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-200 transition"
                    >
                        Volver
                    </Link>
                </div>
            </div>
        </div>
    )
}
